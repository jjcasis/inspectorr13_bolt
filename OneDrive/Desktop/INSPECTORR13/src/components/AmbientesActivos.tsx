import React from 'react'
import useDataStore from '../store/tempDataStore'
import CardInformeAmbiente from './CardInformeAmbiente'

const AmbientesActivos: React.FC = () => {
  const { ambientesActivos } = useDataStore()

  if (!ambientesActivos || ambientesActivos.length === 0) {
    return (
      <div style={{ marginTop: '2rem', fontStyle: 'italic', color: '#888' }}>
        No hay ambientes seleccionados. Usa el selector para comenzar.
      </div>
    )
  }

  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {ambientesActivos.map((ambienteId) => (
        <CardInformeAmbiente key={ambienteId} ambiente={ambienteId} />
      ))}
    </div>
  )
}

export default AmbientesActivos
