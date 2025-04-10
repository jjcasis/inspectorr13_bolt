import React from 'react';
import useDataStore from '../store/tempDataStore';

const CheckpointManager: React.FC = () => {
  const { 
    checkpoints, 
    createCheckpoint, 
    rollbackToCheckpoint, 
    deleteCheckpoint 
  } = useDataStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRollback = (timestamp: number) => {
    if (confirm('¿Estás seguro de que deseas restaurar este punto de control? Se perderán todos los cambios realizados después de este punto.')) {
      rollbackToCheckpoint(timestamp);
    }
  };

  const handleDelete = (timestamp: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este punto de control?')) {
      deleteCheckpoint(timestamp);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ margin: 0 }}>🔖 Puntos de Control</h2>
        <button
          onClick={createCheckpoint}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Crear Punto de Control
        </button>
      </div>

      {checkpoints.length === 0 ? (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px dashed #ccc',
          color: '#666'
        }}>
          No hay puntos de control guardados.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {checkpoints.map((cp) => (
            <div
              key={cp.timestamp}
              style={{
                padding: '1rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  Punto de Control - {formatDate(cp.timestamp)}
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                  {cp.informesCapturaRapida.length} informes • {Object.keys(cp.informesPorAmbiente).length} ambientes
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRollback(cp.timestamp)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ↺ Restaurar
                </button>
                <button
                  onClick={() => handleDelete(cp.timestamp)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckpointManager;
