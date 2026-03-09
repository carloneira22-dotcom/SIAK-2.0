-- ==============================================================================
-- SIAK MULTI-MÓDULO - Script de Base de Datos para Supabase
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PARTE 1: TABLA DE INVESTIGACIONES
-- ------------------------------------------------------------------------------

-- 1. Crear la tabla principal para almacenar las investigaciones
CREATE TABLE IF NOT EXISTS investigaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- --- NUEVOS CAMPOS DE CONTEXTO TERRITORIAL Y SECTORIAL ---
    region VARCHAR(100) DEFAULT 'No especificada',
    provincia VARCHAR(100) DEFAULT 'No especificada',
    comuna VARCHAR(100) DEFAULT 'No especificada',
    sector VARCHAR(100) DEFAULT 'No especificado', -- Ej: 'Ley Karin en Educación', 'Ley Karin en Salud'
    
    -- Columnas extraídas para facilitar la búsqueda y filtrado rápido
    investigador_rut VARCHAR(20),
    victima_rut VARCHAR(20),
    denunciado_nombre VARCHAR(255),
    tipo_hecho VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'Borrador', -- Ej: 'Borrador', 'En Proceso', 'Finalizada'
    
    -- Columna JSONB para almacenar todo el objeto FormData de React de forma flexible
    form_data JSONB NOT NULL
);

-- 2. Crear índices para mejorar la velocidad de las búsquedas
CREATE INDEX IF NOT EXISTS idx_investigaciones_investigador_rut ON investigaciones(investigador_rut);
CREATE INDEX IF NOT EXISTS idx_investigaciones_victima_rut ON investigaciones(victima_rut);
CREATE INDEX IF NOT EXISTS idx_investigaciones_comuna ON investigaciones(comuna);
CREATE INDEX IF NOT EXISTS idx_investigaciones_sector ON investigaciones(sector);
CREATE INDEX IF NOT EXISTS idx_investigaciones_form_data ON investigaciones USING GIN (form_data);

-- 3. Configurar un Trigger para actualizar automáticamente la fecha de 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_investigaciones_modtime ON investigaciones;
CREATE TRIGGER update_investigaciones_modtime
BEFORE UPDATE ON investigaciones
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 4. Configurar Seguridad de Nivel de Fila (RLS - Row Level Security)
ALTER TABLE investigaciones ENABLE ROW LEVEL SECURITY;

-- ATENCIÓN: Esta política permite acceso público (lectura/escritura) para propósitos de DEMO.
-- En un entorno de producción real, debes cambiar 'anon' por 'authenticated' y filtrar por usuario.
DROP POLICY IF EXISTS "Permitir acceso anonimo para demo" ON investigaciones;
CREATE POLICY "Permitir acceso anonimo para demo" 
ON investigaciones 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- PARTE 2: ALMACENAMIENTO DE ARCHIVOS GRANDES (STORAGE)
-- ------------------------------------------------------------------------------

-- 1. Crear el bucket "evidencias" (Si no existe)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidencias', 
  'evidencias', 
  true, -- true = público (se puede acceder vía URL), false = privado
  1048576000, -- Límite de 1GB en bytes (1000 * 1024 * 1024)
  ARRAY[
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'video/mp4', 
    'video/quicktime', 
    'audio/mpeg', 
    'audio/wav', 
    'application/zip', 
    'application/x-rar-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Configurar políticas de seguridad para el bucket "evidencias"

-- Permitir que cualquier usuario (incluso anónimo) pueda subir archivos
DROP POLICY IF EXISTS "Permitir subida publica a evidencias" ON storage.objects;
CREATE POLICY "Permitir subida publica a evidencias" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'evidencias');

-- Permitir que cualquier usuario pueda leer/descargar los archivos
DROP POLICY IF EXISTS "Permitir lectura publica de evidencias" ON storage.objects;
CREATE POLICY "Permitir lectura publica de evidencias" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'evidencias');

-- Permitir que cualquier usuario pueda actualizar sus archivos
DROP POLICY IF EXISTS "Permitir actualizacion publica de evidencias" ON storage.objects;
CREATE POLICY "Permitir actualizacion publica de evidencias" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'evidencias');

-- Permitir que cualquier usuario pueda eliminar archivos
DROP POLICY IF EXISTS "Permitir eliminacion publica de evidencias" ON storage.objects;
CREATE POLICY "Permitir eliminacion publica de evidencias" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'evidencias');

