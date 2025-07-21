import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Añadir logs para verificar que las variables de entorno están definidas
console.log("Supabase URL defined:", !!supabaseUrl)
console.log("Supabase Anon Key defined:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not properly defined!")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Exportaciones requeridas
export { createClient }
export { supabase }
export default supabase
