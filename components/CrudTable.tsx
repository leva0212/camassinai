"use client";

import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { supabase } from "@/lib/supabaseClient";

// --- Tipos ---
export type ColumnMeta = {
  field: string;
  label: string;
  type?: "text" | "number" | "boolean";
  visible?: boolean;
  headerColor?: string;
  textColor?: string;
  width?: number;
};

type RowData = Record<string, any>;

// --- Props ---
type CrudTableProps = {
  table: string;
  idField?: string;
  columnsMeta?: ColumnMeta[];
};

// --- Modal de Configuración ---
function ColumnsConfigModal({
  columnsConfig,
  setColumnsConfig,
  onClose,
}: {
  columnsConfig: ColumnMeta[];
  setColumnsConfig: (cols: ColumnMeta[]) => void;
  onClose: () => void;
}) {
  const [localConfig, setLocalConfig] = useState<ColumnMeta[]>(columnsConfig);

  const updateColumn = (index: number, key: keyof ColumnMeta, value: any) => {
    const updated = [...localConfig];
    (updated[index] as any)[key] = value;
    setLocalConfig(updated);
  };

  const saveConfig = () => {
    setColumnsConfig(localConfig);
    console.log("Configuración guardada:", JSON.stringify(localConfig, null, 2));
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: 600, maxHeight: "80%", overflowY: "auto" }}>
        <h3>Configuración de Columnas</h3>
        {localConfig.map((c, i) => (
          <div key={c.field} style={{ borderBottom: "1px solid #ddd", marginBottom: 10, paddingBottom: 8 }}>
            <strong>{c.field}</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <label>
                Label: <input value={c.label} onChange={(e) => updateColumn(i, "label", e.target.value)} />
              </label>
              <label>
                Visible:{" "}
                <input
                  type="checkbox"
                  checked={c.visible !== false}
                  onChange={(e) => updateColumn(i, "visible", e.target.checked)}
                />
              </label>
              <label>
                Width:{" "}
                <input
                  type="number"
                  value={c.width ?? 150}
                  onChange={(e) => updateColumn(i, "width", Number(e.target.value))}
                  style={{ width: 60 }}
                />
              </label>
              <label>
                Header Color:{" "}
                <input
                  type="color"
                  value={c.headerColor ?? "#ffffff"}
                  onChange={(e) => updateColumn(i, "headerColor", e.target.value)}
                />
              </label>
              <label>
                Text Color:{" "}
                <input
                  type="color"
                  value={c.textColor ?? "#000000"}
                  onChange={(e) => updateColumn(i, "textColor", e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={saveConfig}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// --- CrudTable ---
export function CrudTable({ table, idField = "id", columnsMeta = [] }: CrudTableProps) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columnsConfig, setColumnsConfig] = useState<ColumnMeta[]>(columnsMeta);
  const [showConfig, setShowConfig] = useState(false);

  // --- Cargar datos ---
  const loadData = async () => {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      alert(error.message);
      return;
    }
    setRows(data || []);
  };

  useEffect(() => {
    loadData();
  }, [table]);

  // --- Columnas dinámicas ---
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(
    () =>
      columnsConfig
        .filter((c) => c.visible !== false)
        .map((c) => ({
          accessorKey: c.field,
          header: c.label,
          size: c.width ?? 150,
          muiTableHeadCellProps: {
            sx: {
              backgroundColor: c.headerColor ?? undefined,
              color: c.textColor ?? undefined,
            },
          },
          Cell: ({ cell }): React.ReactNode => {
            if (c.type === "boolean") return cell.getValue() ? "✅" : "❌";
            return String(cell.getValue() ?? "");
          },
        })),
    [columnsConfig]
  );

  // --- Simular metadatos del servidor ---
  const fetchColumnsMeta = async () => {
    const serverMeta: ColumnMeta[] = [
      { field: "prod_id", label: "ID", visible: false },
      { field: "prod_nombre", label: "Nombre" },
      { field: "prod_precio", label: "Precio", type: "number" },
      { field: "prod_activo", label: "Activo", type: "boolean" },
    ];
    setColumnsConfig(serverMeta);
  };

  useEffect(() => {
    fetchColumnsMeta();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <MaterialReactTable
        columns={columns}
        data={rows}
        enableColumnActions
        enableColumnFilters
        enableSorting
        enablePagination
      />

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={() => setShowConfig(true)}>Configurar columnas</button>
        <button
          onClick={() => {
            console.log(JSON.stringify(columnsConfig, null, 2));
            alert("Configuración copiada a consola (JSON)");
          }}
        >
          Copiar JSON
        </button>
      </div>

      {showConfig && (
        <ColumnsConfigModal
          columnsConfig={columnsConfig}
          setColumnsConfig={setColumnsConfig}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}