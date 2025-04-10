import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/tempDataStore';
import ReportTemplateSelector from './ReportTemplateSelector';

const ListaInspeccionElementos: React.FC = () => {
  const navigate = useNavigate();
  const { 
    informesElementos, 
    eliminarInformeElementos, 
    activarInformeElementos,
    informeElementosActivoId 
  } = useDataStore();
  
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState<any>(null);

  const toggleExpandir = (id: string) => {
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenEdit = (id: string) => {
    activarInformeElementos(id);
    navigate('/elementos/editor');
  };

  const handleExport = (informe: any) => {
    setSelectedInforme(informe);
    setShowTemplateSelector(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este informe? Esta acción no se puede deshacer.')) {
      eliminarInformeElementos(id);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>🔍 Informes de Inspección por Elementos</h2>
        <button
          onClick={() => navigate('/elementos/editor')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Nuevo Informe
        </button>
      </div>

      {informesElementos?.map((informe) => (
        <div 
          key={informe.id}
          style={{ 
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '1rem',
            overflow: 'hidden',
            backgroundColor: informeElementosActivoId === informe.id ? '#f0f7ff' : '#fff',
            borderColor: informeElementosActivoId === informe.id ? '#007acc' : '#ccc',
          }}
        >
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ margin: 0 }}>{informe.titulo}</h3>
                {informeElementosActivoId === informe.id && (
                  <span style={{ 
                    backgroundColor: '#007acc', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem' 
                  }}>
                    Activo
                  </span>
                )}
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                Fecha: {informe.fecha} • {informe.items.length} elementos
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleExport(informe)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📄 Exportar
              </button>
              <button
                onClick={() => handleOpenEdit(informe.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007acc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Abrir/Editar
              </button>
              <button
                onClick={() => handleDelete(informe.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
              <button
                onClick={() => toggleExpandir(informe.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.2rem',
                  padding: '0.5rem'
                }}
              >
                {expandido[informe.id] ? '🔽' : '▶️'}
              </button>
            </div>
          </div>

          {expandido[informe.id] && (
            <div style={{ padding: '1rem' }}>
              {informe.items.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                  }}
                >
                  <img 
                    src={item.imagen?.src} 
                    alt="preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>{item.categoria}</strong> / {item.subelemento}
                    </p>
                    <p style={{ margin: '0', color: '#666' }}>
                      {item.ambiente} • {item.estado}
                    </p>
                    {item.observacion && (
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                        {item.observacion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {(!informesElementos || informesElementos.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            No hay informes de inspección. Crea uno nuevo para comenzar.
          </p>
          <button
            onClick={() => navigate('/elementos/editor')}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Crear Primer Informe
          </button>
        </div>
      )}

      {showTemplateSelector && selectedInforme && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Seleccionar Formato de Exportación</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <ReportTemplateSelector 
              informe={selectedInforme}
              onClose={() => setShowTemplateSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaInspeccionElementos;
