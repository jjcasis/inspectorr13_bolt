import React, { useState } from 'react';
import useDataStore from '../../store/tempDataStore';
import {
  IconArrowUp,
  IconArrowDown,
  IconFileExport,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';

interface Informe {
  id: string;
  titulo: string;
  fecha: string;
  items: any[];
}

const ListaInformesCaptura = () => {
  const {
    informesCapturaRapida,
    guardarInformeCaptura,
    informeCapturaActivoId,
    crearNuevoInformeCaptura
  } = useDataStore();

  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  const toggleExpandir = (id: string) => {
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const subirItem = (id: string, idx: number) => {
    const informes = [...informesCapturaRapida];
    const informe = informes.find(i => i.id === id);
    if (!informe || idx === 0) return;
    [informe.items[idx - 1], informe.items[idx]] = [informe.items[idx], informe.items[idx - 1]];
    guardarInformeCaptura(informe);
  };

  const bajarItem = (id: string, idx: number) => {
    const informes = [...informesCapturaRapida];
    const informe = informes.find(i => i.id === id);
    if (!informe || idx === informe.items.length - 1) return;
    [informe.items[idx + 1], informe.items[idx]] = [informe.items[idx], informe.items[idx + 1]];
    guardarInformeCaptura(informe);
  };

  const eliminarItem = (id: string, idx: number) => {
    const informes = [...informesCapturaRapida];
    const informe = informes.find(i => i.id === id);
    if (!informe) return;
    informe.items.splice(idx, 1);
    guardarInformeCaptura(informe);
  };

  const activarInforme = (informe: Informe) => {
    crearNuevoInformeCaptura({
      ...informe,
      items: [...informe.items]
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 Lista de Informes Captura Rápida</h2>

      {informesCapturaRapida.length === 0 ? (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          No hay informes guardados aún. Usa la captura rápida para crear uno nuevo.
        </div>
      ) : (
        informesCapturaRapida.map((informe: Informe) => (
          <div
            key={informe.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: informeCapturaActivoId === informe.id ? '#f0f7ff' : '#fff',
              borderColor: informeCapturaActivoId === informe.id ? '#007acc' : '#ccc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{informe.titulo}</h3>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>Fecha: {informe.fecha}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {informeCapturaActivoId !== informe.id && (
                  <button
                    onClick={() => activarInforme(informe)}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ▶️ Abrir
                  </button>
                )}
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
              <div style={{ marginTop: '1rem' }}>
                {informe.items.map((item: any, idx: number) => (
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
                      <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>
                        {item.comentario}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <button
                        onClick={() => subirItem(informe.id, idx)}
                        title="Subir"
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          backgroundColor: 'black',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <IconArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => bajarItem(informe.id, idx)}
                        title="Bajar"
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          backgroundColor: 'black',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <IconArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => alert('Exportar individual (demo)')}
                        title="Exportar"
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          backgroundColor: 'black',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <IconFileExport size={16} />
                      </button>
                      <button
                        onClick={() => alert('Modo edición aún no implementado')}
                        title="Editar"
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          backgroundColor: 'black',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => eliminarItem(informe.id, idx)}
                        title="Eliminar"
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          backgroundColor: 'black',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ListaInformesCaptura;
