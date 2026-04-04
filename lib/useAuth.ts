"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useAuth() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let mounted = true;

    const loadSession = async () => {

      try {

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error obteniendo sesión:", error.message);
        }

        if (mounted) {
          setUser(data?.session?.user ?? null);
          setLoading(false);
        }

      } catch (err) {
        console.error("Error inesperado:", err);

        if (mounted) {
          setLoading(false);
        }

      }

    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };

  }, []);

  return {
    user,
    loading,
    isLogged: Boolean(user)
  };

}