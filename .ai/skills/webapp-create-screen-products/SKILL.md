---
name: webapp-create-screen-products
description: Create a screen with list and detail view for a product entity. It can create, read, update and delete products.
---

# SKILL: Crear Pantalla CRUD con Lista y Detalle

**Última actualización:** 2025-12-27  
**Versión:** 1.0  

---

## 🎯 Cuándo Usar Esta Skill

Cuando necesites implementar una pantalla que:

- Muestre una lista de items (ej: productos, tareas, notas)
- Permita crear nuevos items
- Permita editar items existentes
- Permita eliminar items
- Tenga vista de detalle individual

---

## 📝 Información que Debes Proveer

Antes de usar esta skill, ten claro:

1. **Nombre de la entidad** (singular y plural)
   
   - Ejemplo: "Tarea" / "Tareas", "Producto" / "Productos"

2. **Campos del modelo**
   
   ```typescript
   interface Entidad {
    id: string
    campo1: string
    campo2: number
    campo3?: boolean
    created_at: string
   }
   ```

3. **Tabla Base de datos**
   
   - Nombre de la tabla
   - Columnas y tipos

---

## 🗂️ Estructura de Archivos a Generar

```
app/
  tasks/                    # Ejemplo: "tasks"
    index.tsx               # Lista de tareas
    [id].tsx                # Detalle de tarea
    _layout.tsx             # Layout del stack

components/
  tasks/
    TaskListItem.tsx        # Item de lista
    TaskForm.tsx            # Formulario crear/editar
    TaskFilters.tsx         # Filtros opcionales

services/
  task.service.ts           # CRUD operations

types/
  task.types.ts             # Interfaces TypeScript
```

---

## 📋 Template de Código

### 1. Lista Screen (index.tsx)

```typescript
import { FlatList, View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { [Entity]Service } from '@/services/[entity].service'
import type { [Entity] } from '@/types/[entity].types'

export default function [Entity]ListScreen() {
  const [items, setItems] = useState<[Entity][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const data = await [Entity]Service.getAll()
      setItems(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header con botón crear */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Pressable
          onPress={() => router.push('/[entity]/new')}
          className="bg-blue-500 px-4 py-2 rounded-lg"
          accessibilityRole="button"
          accessibilityLabel="Crear nuevo [entity]"
        >
          <Text className="text-white font-semibold">Crear</Text>
        </Pressable>
      </View>

      {/* Lista */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/[entity]/${item.id}`)}
            className="p-4 border-b border-gray-100"
            accessibilityRole="button"
            accessibilityLabel={`Ver detalles de ${item.name}`}
          >
            <Text className="font-semibold text-lg">{item.name}</Text>
            <Text className="text-gray-600 mt-1">{item.description}</Text>
          </Pressable>
        )}
        refreshing={loading}
        onRefresh={loadItems}
      />
    </View>
  )
}
```

### 2. Service Template

```typescript
import { supabase } from '@/utils/supabase'
import type { [Entity], Create[Entity]Input } from '@/types/[entity].types'

export const [Entity]Service = {
  async getAll(): Promise<[Entity][]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string): Promise<[Entity]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(input: Create[Entity]Input): Promise<[Entity]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<[Entity]>): Promise<[Entity]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('[table_name]')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
```

### 3. Types Template

```typescript
export interface [Entity] {
  id: string
  // ... tus campos aquí
  created_at: string
  updated_at: string
}

export type Create[Entity]Input = Omit<[Entity], 'id' | 'created_at' | 'updated_at'>
export type Update[Entity]Input = Partial<Create[Entity]Input>
```

---

## ✅ Checklist de Validación

Después de generar el código, verifica:

- [ ] Todos los archivos creados en las rutas correctas
- [ ] Imports correctos (sin errores)
- [ ] TypeScript sin `any`
- [ ] NativeWind usado (no StyleSheet.create)
- [ ] accessibilityLabel en elementos interactivos
- [ ] Manejo de loading states
- [ ] Manejo de errores
- [ ] Navegación funcional con Expo Router
- [ ] Supabase RLS policies configuradas

---

## 🔄 Variaciones Comunes

**Con búsqueda:**

```
Agrega barra de búsqueda que filtre por [campo]
```

**Con filtros:**

```
Agrega filtros por [categoría, estado, fecha]
```

**Con paginación:**

```
Implementa paginación de 20 items por página
```

**Con imágenes:**

```
Cada item tiene una imagen, usar Storage de Supabase
```

---

## 📝 Ejemplo de Uso Real

```
Crea una pantalla CRUD siguiendo .ai/skills/create-screen-products.md

Entidad: "Receta" / "Recetas"
Campos:
  - id: string (auto)
  - title: string (obligatorio)
  - description: string (opcional)
  - ingredients: string[] (array)
  - prep_time: number (minutos)
  - image_url: string (opcional)
  - category: 'breakfast' | 'lunch' | 'dinner' | 'dessert'
  - created_at: string (auto)

Tabla Supabase: "recipes"

Extras:
- Agrega filtro por categoría
- Incluye campo de búsqueda por título
- Cada receta debe mostrar imagen thumbnail en la lista
```
