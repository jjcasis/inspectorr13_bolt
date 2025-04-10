import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconFileExport,
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconArrowLeft,
  IconDownload
} from '@tabler/icons-react';
import useDataStore from '../../store/tempDataStore';
import CrearInformeModal from './CrearInformeModal';
import ReportTemplateSelector from './ReportTemplateSelector';

const ListaInformesCaptura: React.FC = () => {
  const navigate = useNavigate();
  const { 
    informesCapturaRapida, 
    eliminarInformeCaptura,
    informeCapturaActivoId,
    activarInformeExistente
  } = useDataStore();
  
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState<any>(null);

  const toggleExpandir = (id: string) => {
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEliminarInforme = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este informe? Esta acción no se puede deshacer.')) {
      eliminarInformeCaptura(id);
    }
  };

  const handleOpenEdit = (id: string) => {
    activarInformeExistente(id);
    navigate('/excepciones/editor');
  };

  const handleExport = (informe: any) => {
    setSelectedInforme(informe);
    setShowTemplateSelector(true);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>📋 Informes de Inspección</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/excepciones')}
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
            onClick={() => setShowCrearModal(true)}
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
      
      {informesCapturaRapida.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ margin: '0 0 1rem 0' }}>No hay informes guardados aún.</p>
          <button
            onClick={() => setShowCrearModal(true)}
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
      ) : (
        informesCapturaRapida.map((informe) => (
          <div 
            key={informe.id} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: 8, 
              marginBottom: '1.5rem',
              backgroundColor: informeCapturaActivoId === informe.id ? '#f0f7ff' : '#fff',
              borderColor: informeCapturaActivoId === informe.id ? '#007acc' : '#ccc',
            }}
          >
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{informe.titulo}</h3>
                  {informeCapturaActivoId === informe.id && (
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
                    padding: '0.5rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Exportar Informe"
                >
                  <IconDownload size={20} />
                </button>
                <button
                  onClick={() => handleOpenEdit(informe.id)}
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
                  title="Abrir/Editar"
                >
                  <IconEdit size={20} />
                </button>
                <button
                  onClick={() => handleEliminarInforme(informe.id)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Eliminar"
                >
                  <IconTrash size={20} />
                </button>
                <button
                  onClick={() => toggleExpandir(informe.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem'
                  }}
                  title={expandido[informe.id] ? 'Contraer' : 'Expandir'}
                >
                  {expandido[informe.id] ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
                </button>
              </div>
            </div>

            {expandido[informe.id] && (
              <div style={{ padding: '1rem' }}>
                {informe.items.map((item, idx) => (
                  <div 
                    key={`${informe.id}-expanded-${idx}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      border: '1px solid #ddd', 
                      borderRadius: 6, 
                      padding: '0.5rem', 
                      marginBottom: '1rem',
                      backgroundColor: '#fff'
                    }}
                  >
                    <img 
                      src={item.imagen?.src} 
                      alt="thumb" 
                      style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 4, 
                        objectFit: 'cover' 
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0 }}>
                        <strong>{item.categoria}</strong> / {item.subelemento}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                        {item.modulo}-{item.nivel} ({item.tipo}) | {item.ambiente}
                      </p>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>
                        {item.comentario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <CrearInformeModal 
        isOpen={showCrearModal} 
        onClose={() => {
          setShowCrearModal(false);
          navigate('/excepciones/editor');
        }} 
      />

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

export default ListaInformesCaptura;
