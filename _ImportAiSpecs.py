import os
import shutil

def import_ai_settings():
    # 1. Definir origen y destino
    source_base = os.path.expanduser(os.path.join('~', '.ai'))
    # El destino es la carpeta .ai en el directorio actual del script
    dest_base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.ai')

    print(f"Origen: {source_base}")
    print(f"Destino: {dest_base}")

    # Verificar si el origen existe
    if not os.path.exists(source_base):
        print(f"Error: No se encuentra la carpeta de origen: {source_base}")
        return

    # 2. Recorrer la carpeta de origen
    for root, dirs, files in os.walk(source_base):
        # Calcular la ruta relativa para replicar la estructura
        relative_path = os.path.relpath(root, source_base)
        dest_dir = os.path.join(dest_base, relative_path)

        # Crear carpeta de destino si no existe
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # 3. Copiar archivos (Sobrescribe si existe, ignora si no está en origen)
        for file in files:
            src_file = os.path.join(root, file)
            dst_file = os.path.join(dest_dir, file)
            
            try:
                shutil.copy2(src_file, dst_file) # copy2 preserva metadatos
                print(f"[OK] Copiado: {file}")
            except Exception as e:
                print(f"[ERROR] No se pudo copiar {file}: {e}")

if __name__ == "__main__":
    import_ai_settings()