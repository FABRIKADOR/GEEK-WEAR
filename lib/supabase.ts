import { supabase } from "./supabase-client"

// Eliminar los logs de consola que pueden estar causando problemas
// console.log("Supabase URL defined:", !!supabaseUrl)
// console.log("Supabase Anon Key defined:", !!supabaseAnonKey)

export default supabase

// Exportar también como named export para compatibilidad
export { supabase }
