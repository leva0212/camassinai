import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://acmowkzvaefpnignvfab.supabase.co";
const supabaseKey = "sb_publishable_B9mhM6vMNwAUnr-dZ3SDpA_MdP9IloS";

export const supabase = createClient(supabaseUrl, supabaseKey);