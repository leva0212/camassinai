"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";
import { supabase } from "@/lib/supabaseClient";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Modal, Button, Input, Checkbox, Loader, Box } from "@mantine/core";

type ColumnConfig = {
  field: string;
  label?: string;
  type?: "text" | "number" | "boolean";
  visible?: boolean;
  width?: number;
  titleColor?: string;
  textColor?: string;
};

type RowData = { [key: string]: any };
type CrudTableProps = { tableName: string };

const DEFAULT_COLUMN_COLOR = "#1976d2";
const DEFAULT_TEXT_COLOR = "#000";
const PAGE_SIZE = 50;
const ROW_COLORS = ["#fff", "#f5f5f5"]; // Zebra stripes

export function CrudTable({ tableName }: CrudTableProps) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [primaryKey, setPrimaryKey] = useState<string>("");

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const loadColumnsConfig = useCallback(async () => {
    if (!tableName?.trim()) return;
    try {
      const { data: configData } = await supabase
        .from("table_config")
        .select("*")
        .eq("table_name", tableName)
        .single();

      if (!configData) {
        const { data: columnsData, error } = await supabase.rpc(
          "get_table_columns",
          { p_table_name: tableName }
        );
        if (error) throw error;

        const defaultConfig: ColumnConfig[] = columnsData.map((c: any) => ({
          field: c.column_name,
          label: c.column_name,
          visible: true,
          width: 150,
          titleColor: DEFAULT_COLUMN_COLOR,
          textColor: DEFAULT_TEXT_COLOR,
        }));

        setColumnsConfig(defaultConfig);

        await supabase.from("table_config").insert({
          table_name: tableName,
          config: defaultConfig,
        });
      } else {
        setColumnsConfig(configData.config);
      }
    } catch (err) {
      console.error("Error cargando configuración:", err);
    }
  }, [tableName]);


type PrimaryKeyResult = {
  primary_key: string;
} | null;

const loadPrimaryKey = useCallback(async () => {
  if (!tableName?.trim()) return;

  try {
    // Obtenemos datos con supabase RPC
    const res = await supabase.rpc("get_primary_key", { p_table_name: tableName }).single();

    // Desestructuramos de forma segura usando optional chaining y type assertion
    const data = res.data as PrimaryKeyResult;

    if (res.error) throw res.error;

    // Validamos que data y data.primary_key existan
    if (data && data.primary_key) {
      setPrimaryKey(String(data.primary_key)); // ✅ primaryKey es string
    } else {
      console.warn("No se encontró primary key para la tabla", tableName);
      setPrimaryKey(""); // fallback seguro
    }
  } catch (err) {
    console.error("Error obteniendo primary key:", err);
    setPrimaryKey(""); // fallback seguro
  }
}, [tableName]);

  const loadRows = useCallback(async () => {
    if (!tableName?.trim() || !primaryKey) return;
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .range(from, to)
        .order(primaryKey, { ascending: true });

      if (error) throw error;

      setRows((prev) => [...prev, ...(data || [])]);
      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (err) {
      console.error("Error Supabase:", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [tableName, page, primaryKey]);

  const loadMore = () => {
    if (!hasMore || fetchingMore) return;
    setFetchingMore(true);
    setPage((p) => p + 1);
  };

  const handleRealtime = useCallback(
    (payload: any) => {
      if (!primaryKey) return;
      const updatedRow = payload.new || {};
      const oldRow = payload.old || {};

      setRows((prev) => {
        switch (payload.eventType) {
          case "INSERT":
            return [updatedRow, ...prev];
          case "UPDATE":
            return prev.map((r) =>
              r[primaryKey] === updatedRow[primaryKey] ? updatedRow : r
            );
          case "DELETE":
            return prev.filter((r) => r[primaryKey] !== oldRow[primaryKey]);
          default:
            return prev;
        }
      });
    },
    [primaryKey]
  );

  useEffect(() => {
    if (!tableName || !primaryKey) return;
    const channel = supabase
      .channel(`realtime_${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        handleRealtime
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, primaryKey, handleRealtime]);

  useEffect(() => {
    setRows([]);
    setPage(0);
    setHasMore(true);
    loadColumnsConfig();
    loadPrimaryKey();
  }, [tableName, loadColumnsConfig, loadPrimaryKey]);

  useEffect(() => {
    loadRows();
  }, [loadRows, page]);

  const columns = useMemo<MRT_ColumnDef<RowData>[]>(
    () =>
      columnsConfig
        .filter((c) => c.visible)
        .map((c) => ({
          accessorKey: c.field,
          header: c.label ?? c.field,
          size: c.width,
          Cell: ({ cell, row }) => (
            <span
              style={{
                color: c.textColor ?? DEFAULT_TEXT_COLOR,
                backgroundColor: ROW_COLORS[row.index % ROW_COLORS.length],
                display: "block",
                width: "100%",
                padding: "4px 8px",
              }}
            >
              {String(cell.getValue())}
            </span>
          ),
          headerCellProps: {
            sx: { backgroundColor: c.titleColor ?? DEFAULT_COLUMN_COLOR },
          },
          enableColumnFilter: true,
        })),
    [columnsConfig]
  );

  const saveConfig = async (newConfig: ColumnConfig[]) => {
    setColumnsConfig(newConfig);
    try {
      await supabase.from("table_config").upsert(
        { table_name: tableName, config: newConfig },
        { onConflict: "table_name" }
      );
    } catch (err) {
      console.error("Error guardando configuración:", err);
    }
  };

  const exportCSV = () => {
    const csvContent =
      columns.map((c) => c.header ?? c.accessorKey).join(",") +
      "\n" +
      rows
        .map((r) => columns.map((c) => r[c.accessorKey as string]).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${tableName}.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [columns.map((c) => c.header ?? c.accessorKey)],
      body: rows.map((r) => columns.map((c) => r[c.accessorKey as string])),
    });
    doc.save(`${tableName}.pdf`);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      loadMore();
    }
  };

  if (loading && rows.length === 0)
    return (
      <Box p="md" style={{ display: "flex", justifyContent: "center" }}>
        <Loader />
      </Box>
    );

  return (
    <Box p="md">
      <Box mb="sm" style={{ display: "flex", gap: 8 }}>
        <Button onClick={exportCSV}>Exportar CSV</Button>
        <Button onClick={exportPDF}>Exportar PDF</Button>
        <Button onClick={() => setModalOpen(true)}>Configurar columnas</Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={rows}
        enableSorting
        enableColumnFilters
        enablePagination={false}
        enableColumnOrdering
        enableRowSelection
        enableStickyHeader
        muiTableContainerProps={{
          sx: { maxHeight: 600, overflowY: "auto" },
          onScroll: handleScroll,
          ref: tableContainerRef,
        }}
      />

      {fetchingMore && (
        <Box style={{ display: "flex", justifyContent: "center", margin: 8 }}>
          <Loader size="sm" />
        </Box>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configurar columnas"
        size="xl"
      >
        {columnsConfig.map((c, idx) => (
          <Box
            key={c.field}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <Input
              value={c.label}
              onChange={(e) => {
                const newCols = [...columnsConfig];
                newCols[idx].label = e.target.value;
                setColumnsConfig(newCols);
              }}
              placeholder="Label"
            />
            <Input
              type="number"
              value={c.width}
              onChange={(e) => {
                const newCols = [...columnsConfig];
                newCols[idx].width = parseInt(e.target.value);
                setColumnsConfig(newCols);
              }}
              placeholder="Width"
            />
            <Input
              type="color"
              value={c.titleColor}
              onChange={(e) => {
                const newCols = [...columnsConfig];
                newCols[idx].titleColor = e.target.value;
                setColumnsConfig(newCols);
              }}
            />
            <Input
              type="color"
              value={c.textColor}
              onChange={(e) => {
                const newCols = [...columnsConfig];
                newCols[idx].textColor = e.target.value;
                setColumnsConfig(newCols);
              }}
            />
            <Checkbox
              checked={c.visible}
              onChange={(e) => {
                const newCols = [...columnsConfig];
                newCols[idx].visible = e.currentTarget.checked;
                setColumnsConfig(newCols);
              }}
              label="Visible"
            />
          </Box>
        ))}
        <Box mt="md">
          <Button onClick={() => saveConfig(columnsConfig)}>
            Guardar Configuración Global
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}