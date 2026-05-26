import pandas as pd
from supabase import create_client

SUPABASE_URL = "https://tczjuhgpyqrdkqrlsskf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjemp1aGdweXFyZGtxcmxzc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzcwMDIsImV4cCI6MjA5NDk1MzAwMn0.L1CQfkGWwJk2g1e9DiGLZ4OCEkHvWQhx0FB8oiXpYao""

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def limpiar(valor):
    if pd.isna(valor):
        return None
    return str(valor).strip() or None

def importar_hoja(df, rubro, col_nombre, col_telefono, col_email=None, col_ciudad=None, col_direccion=None, skip_rows=1):
    data = df.iloc[skip_rows:].copy()
    registros = []
    for _, row in data.iterrows():
        nombre = limpiar(row.iloc[col_nombre])
        if not nombre:
            continue
        registro = {
            'nombre': nombre,
            'telefono': limpiar(row.iloc[col_telefono]) if col_telefono is not None else None,
            'email': limpiar(row.iloc[col_email]) if col_email is not None else None,
            'ciudad': limpiar(row.iloc[col_ciudad]) if col_ciudad is not None else None,
            'direccion': limpiar(row.iloc[col_direccion]) if col_direccion is not None else None,
            'rubro': rubro,
        }
        registros.append(registro)
    
    # Insertar en lotes de 100
    total = 0
    for i in range(0, len(registros), 100):
        lote = registros[i:i+100]
        supabase.table('directorio').insert(lote).execute()
        total += len(lote)
    print(f'{rubro}: {total} registros importados')

# Leer Excel
xl = pd.read_excel('Construcción.xlsx', sheet_name=None, header=None)

# Constructoras: nombre=1, telefono=4, email=8, ciudad=6
importar_hoja(xl['Constructoras'], 'Constructoras', col_nombre=1, col_telefono=4, col_email=8, col_ciudad=6, skip_rows=2)

# Arquitectos: nombre=1, telefono=4, email=7
importar_hoja(xl['Arquitectos'], 'Arquitectos', col_nombre=1, col_telefono=4, col_email=7, skip_rows=2)

# Materiales: nombre=1, telefono=2, ciudad=4, email=5
importar_hoja(xl['Materiales de construcción'], 'Materiales de construcción', col_nombre=1, col_telefono=2, col_email=5, col_ciudad=4, skip_rows=2)

# Sanitarios: nombre=1, telefono=4, ciudad=5, email=8
importar_hoja(xl['Sanitarios, pisos y otros'], 'Sanitarios y pisos', col_nombre=1, col_telefono=4, col_email=8, col_ciudad=5, skip_rows=2)

# Metalúrgicas: nombre=1, telefono=4, ciudad=6, email=7
importar_hoja(xl['Metalúrgica'], 'Metalúrgicas', col_nombre=1, col_telefono=4, col_email=7, col_ciudad=6, skip_rows=2)

# Altura y seguridad: nombre=1, telefono=4, ciudad=6, email=7
importar_hoja(xl['Altura y seguridad'], 'Altura y seguridad', col_nombre=1, col_telefono=4, col_email=7, col_ciudad=6, skip_rows=2)

# PCI: nombre=1, telefono=2, ciudad=4, email=5
importar_hoja(xl['PCI'], 'Prevención de incendios', col_nombre=1, col_telefono=2, col_email=5, col_ciudad=4, skip_rows=2)

print('Importación completada.')