-- OPCIÓN ALTERNATIVA: Desactivar RLS en la tabla franchises
-- NOTA: Solo usa esto si las políticas no funcionan y necesitas una solución rápida
-- No es recomendable para producción por razones de seguridad

-- Desactivar RLS en la tabla franchises
ALTER TABLE franchises DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está desactivado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'franchises';
