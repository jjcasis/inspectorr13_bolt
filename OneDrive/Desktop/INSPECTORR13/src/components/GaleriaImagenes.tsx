// src/components/GaleriaImagenes.tsx
import React, { useRef } from 'react'
import useDataStore from '../store/tempDataStore'

const layoutOpciones = ['grilla', 'fila', 'columna', 'collage']

const GaleriaImagenes: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { informe, setImagenes, setLayout } = useDataStore()

  const handleAgregarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const nuevasImagenes: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          nuevasImagenes.push(reader.result)
          setImagenes([...informe.imagenes, ...nuevasImagenes])
        }
      }
      reader.readAsDataURL(file)
    })

    // Limpia el input para permitir volver a subir la misma imagen si se desea
    e.target.value = ''
  }

  const handleEliminarImagen = (index: number) => {
    const nuevas = [...informe.imagenes]
    nuevas.splice(index, 1)
    setImagenes(nuevas)
  }

  const handleReemplazarImagen = (index: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const nuevas = [...informe.imagenes]
          nuevas[index] = reader.result
          setImagenes(nuevas)
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const layoutStyle = (() => {
    switch (informe.layout) {
      case 'fila':
        return { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem' }
      case 'columna':
        return { display: 'flex', flexDirection: 'column', gap: '0.5rem' }
      case 'collage':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.5rem'
        }
      default: // 'grilla'
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '0.5rem'
        }
    }
  })()

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Galería de Imágenes</h4>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Layout: </label>
        <select value={informe.layout} onChange={(e) => setLayout(e.target.value)}>
          {layoutOpciones.map((op) => (
            <option key={op} value={op}>{op.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div style={layoutStyle}>
        {informe.imagenes.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              border: '1px solid #ccc',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <img
              src={img}
              alt={`img-${i}`}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '4px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
              <button onClick={() => handleReemplazarImagen(i)} style={{ fontSize: '0.75rem' }}>
                🔁 Reemplazar
              </button>
              <button onClick={() => handleEliminarImagen(i)} style={{ fontSize: '0.75rem', color: 'red' }}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleAgregarImagen}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>📸 Subir Imagen</button>
      </div>
    </div>
  )
}

export default GaleriaImagenes
