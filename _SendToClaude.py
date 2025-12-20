import os
import shutil
from pathlib import Path

def copy_web_files(source_dir='.', target_dir='.send'):
    """
    Script mejorado para copiar archivos web respetando .gitignore y
    añadiendo el prefijo de la carpeta de origen. Genera también un archivo
    structure.txt con la estructura de directorios.
    """
    # Extensiones de archivos a copiar - ampliamos la lista
    extensions = ('.html', '.js', '.css', '.json', '.jsx', '.ts', '.tsx')
    
    # Convertir a Path para operaciones consistentes
    source_path = Path(source_dir).absolute()
    target_path = Path(target_dir).absolute()
    
    print(f"Directorio fuente: {source_path}")
    print(f"Directorio destino: {target_path}")
    
    # Recrear directorio destino
    if target_path.exists():
        shutil.rmtree(target_path)
        print(f"Directorio {target_path} eliminado")
    target_path.mkdir()
    print(f"Directorio {target_path} creado")
    
    # Patrones por defecto para ignorar
    ignore_patterns = ['.git', target_dir]
    
    # Cargar .gitignore si existe
    gitignore_path = source_path / '.gitignore'
    if gitignore_path.exists():
        with open(gitignore_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    # Limpiar patrones (quitar barras al inicio y final)
                    clean_pattern = line.strip('/')
                    if clean_pattern:
                        ignore_patterns.append(clean_pattern)
    
    print(f"Patrones a ignorar: {ignore_patterns}")
    
    # Lista para almacenar archivos copiados
    copied_files = []
    
    # Lista para almacenar la estructura de directorios
    structure_lines = []
    
    # Función simple para verificar si se debe ignorar una ruta
    def should_ignore(path):
        # Obtener ruta relativa a la fuente
        try:
            rel_path = path.relative_to(source_path)
        except ValueError:
            return False
            
        # Convertir a string para comparaciones
        path_str = str(rel_path).replace('\\', '/')
        
        # Ignorar directorios/archivos específicos
        if path.name in ignore_patterns:
            print(f"Ignorando por nombre: {path}")
            return True
            
        # Verificar cada patrón
        for pattern in ignore_patterns:
            # Coincidencia exacta con el patrón
            if path_str == pattern:
                print(f"Ignorando por coincidencia exacta: {path}")
                return True
                
            # Si alguna parte del path coincide con un patrón
            parts = path_str.split('/')
            if pattern in parts:
                print(f"Ignorando por parte del path: {path}")
                return True
                
            # Si la ruta comienza con el patrón
            if path_str.startswith(f"{pattern}/"):
                print(f"Ignorando por comenzar con patrón: {path}")
                return True
        
        return False
    
    # Función para generar la estructura de directorios
    def generate_structure(directory, prefix='', is_last=True, indent_level=0):
        # Obtener ruta relativa al directorio fuente
        try:
            rel_path = directory.relative_to(source_path)
            dir_name = directory.name if rel_path != Path('.') else source_path.name
        except ValueError:
            dir_name = directory.name
        
        # Añadir directorio a la estructura
        if indent_level == 0:
            # Directorio raíz
            structure_lines.append(dir_name)
        else:
            # Subdirectorio con indentación
            indent = '-' * indent_level
            structure_lines.append(f"{indent}{dir_name}")
        
        # Listar todos los elementos
        try:
            items = sorted(list(directory.iterdir()), key=lambda x: (x.is_file(), x.name))
            
            # Filtrar elementos ignorados
            items = [item for item in items if not should_ignore(item)]
            
            # Procesar cada elemento
            for i, item in enumerate(items):
                is_last_item = (i == len(items) - 1)
                
                if item.is_dir():
                    # Procesar subdirectorio
                    generate_structure(item, prefix + ('└── ' if is_last_item else '├── '), 
                                       is_last_item, indent_level + 1)
                else:
                    # Añadir archivo a la estructura
                    indent = '-' * (indent_level + 1)
                    structure_lines.append(f"{indent}{item.name}")
        except Exception as e:
            print(f"Error al listar directorio {directory}: {e}")
    
    # Recorrer archivos y directorios manualmente para mejor control
    def process_directory(directory):
        print(f"\nProcesando directorio: {directory}")
        
        try:
            # Listar todos los elementos en el directorio
            items = list(directory.iterdir())
            print(f"Elementos en directorio ({len(items)}): {[item.name for item in items]}")
            
            # Verificar cada archivo y subdirectorio
            for item in items:
                if should_ignore(item):
                    continue
                    
                if item.is_file():
                    # Mostrar info de todos los archivos encontrados
                    print(f"Archivo encontrado: {item} (Extensión: {item.suffix})")
                    
                    # Verificar extensión
                    if item.suffix.lower() in extensions:
                        # Calcular ruta relativa para el prefijo
                        try:
                            rel_path = item.relative_to(source_path).parent
                        except ValueError:
                            print(f"Error al obtener ruta relativa para: {item}")
                            continue
                        
                        # Generar nombre con prefijo
                        if str(rel_path) == '.':
                            # Archivo en la raíz
                            new_name = item.name
                        else:
                            # Añadir prefijo de carpeta
                            prefix = str(rel_path).replace('\\', '_').replace('/', '_')
                            new_name = f"{prefix}_{item.name}"
                        
                        # Ruta de destino
                        dest_file = target_path / new_name
                        
                        # Copiar el archivo
                        try:
                            shutil.copy2(item, dest_file)
                            copied_files.append((str(item), str(dest_file)))
                            print(f"Copiado: {item} -> {dest_file}")
                        except Exception as e:
                            print(f"Error al copiar {item}: {e}")
                    else:
                        print(f"Archivo ignorado por extensión: {item}")
                
                elif item.is_dir():
                    # Procesar subdirectorio recursivamente
                    print(f"Entrando en subdirectorio: {item}")
                    process_directory(item)
        except Exception as e:
            print(f"Error al procesar directorio {directory}: {e}")
    
    # Iniciar procesamiento desde el directorio raíz
    process_directory(source_path)
    
    # Generar la estructura de directorios
    print("\nGenerando estructura de directorios...")
    generate_structure(source_path)
    
    # Guardar la estructura en un archivo
    structure_file = target_path / 'structure.txt'
    with open(structure_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(structure_lines))
    print(f"Estructura guardada en: {structure_file}")
    
    # Mostrar resumen
    print("\n--- RESUMEN ---")
    print(f"Total de archivos copiados: {len(copied_files)}")
    for src, dst in copied_files:
        print(f"  {src} -> {dst}")

if __name__ == "__main__":
    try:
        copy_web_files()
    except Exception as e:
        print(f"\nERROR CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Mantener la ventana abierta
        input("\nPresiona Enter para salir...")