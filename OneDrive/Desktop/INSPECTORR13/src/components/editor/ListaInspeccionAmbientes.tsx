import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconDownload,
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconArrowLeft
} from '@tabler/icons-react';
import useDataStore from '../../store/tempDataStore';
import ReportTemplateSelector from './ReportTemplateSelector';

const ListaInspeccionAmbientes: React.FC = () => {
  const navigate = useNavigate();
  const { 
    informesPorAmbiente,
    ambientesActivos,
    modulo,
    nivel
  } = useDataStore();
  
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState<any>(null);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  const toggleExpandir = (id: string) => {
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = (ambiente: string) => {
    const informe = {
      id: ambiente,
      titulo: `Inspección ${ambiente}`,
      fecha: informesPorAmbiente[ambiente]?.fecha || new Date().toISOString().slice(0, 10),
      items: [],
      ...informesPorAmbiente[ambiente]
    };
    setSelectedInforme(informe);
    setShowTemplateSelector(true);
  };

  const handleOpenEdit = (ambiente: string) => {
    navigate('/ambientes/editor', { state: { ambiente } });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>🏢 Informes de Inspección por Ambientes</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Volver"
          >
            <IconArrowLeft size={20} />
          </button>
          <button
            onClick={() => navigate('/ambientes/editor')}
            style={{
              padding: '0.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Nuevo Informe"
          >
            <IconPlus size={20} />
          </button>
        </div>
      </div>

      {ambientesActivos.map((ambiente) => {
        const informe = informesPorAmbiente[ambiente];
        if (!informe) return null;

        return (
          <div 
            key={ambiente}
            style={{ 
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '1rem',
              overflow: 'hidden',
              backgroundColor: '#fff'
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
                <h3 style={{ margin: 0 }}>
                  {informe.nombre || ambiente}
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                  Fecha: {informe.fecha || 'No especificada'} • Módulo: {modulo} • Nivel: {nivel}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleExport(ambiente)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Exportar"
                >
                  <IconDownload size={20} />
                </button>
                <button
                  onClick={() => handleOpenEdit(ambiente)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Editar"
                >
                  <IconEdit size={20} />
                </button>
                <button
                  onClick={() => toggleExpandir(ambiente)}
                  style={{ 
                    padding: '0.5rem',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#333'
                  }}
                  title={expandido[ambiente] ? 'Contraer' : 'Expandir'}
                >
                  {expandido[ambiente] ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
                </button>
              </div>
            </div>

            {expandido[ambiente] && (
              <div style={{ padding: '1rem' }}>
                {/* Estado */}
                {Object.entries(informe.estado || {}).map(([categoria, subelementos]) => (
                  <div key={categoria} style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{categoria}</h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {Object.entries(subelementos).map(([sub, estado]) => (
                        <div key={sub} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '0.5rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}>
                          <span>{sub}</span>
                          <span>{estado}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Comentarios */}
                {informe.comentarios && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4>Observaciones</h4>
                    <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
                      {informe.comentarios}
                    </p>
                  </div>
                )}

                {/* Imágenes */}
                {informe.imagenes?.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4>Imágenes</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '1rem',
                      marginTop: '0.5rem'
                    }}>
                      {informe.imagenes.map((img: any, idx: number) => (
                        <div key={idx} style={{ width: '150px', textAlign: 'center' }}>
                          <img 
                            src={img.src} 
                            alt={img.etiqueta || `Imagen ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          {img.etiqueta && (
                            <p style={{ 
                              margin: '0.3rem 0 0 0',
                              fontSize: '0.9rem',
                              color: '#666'
                            }}>
                              {img.etiqueta}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {(!ambientesActivos || ambientesActivos.length === 0) && (
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
            onClick={() => navigate('/ambientes/editor')}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <IconPlus size={20} />
            <span>Crear Primer Informe</span>
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

export default ListaInspeccionAmbientes;
