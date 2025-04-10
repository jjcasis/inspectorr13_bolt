import React, { useState } from 'react';
import EditorInforme from './EditorInforme';
import VistaPreviaInforme from './VistaPreviaInforme';
import useDataStore from '../store/tempDataStore';
import {
  IconEye,
  IconEyeOff,
  IconCopy,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconPencil
} from '@tabler/icons-react';
import { getAmbientesDisponibles } from '../utils/ambientesUtils';

interface Props {
  ambiente: string;
}

const CardInformeAmbiente: React.FC<Props> = ({ ambiente }) => {
  const [expandido, setExpandido] = useState(true);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);

  const {
    informesPorAmbiente,
    modulo,
    nivel,
    tipo,
    toggleVisibilidadAmbiente,
    clonarAmbiente,
    eliminarAmbiente,
    updateNombreAmbiente
  } = useDataStore();

  const informe = informesPorAmbiente?.[ambiente] || {};
  const visible = informe.visible ?? true;
  const esClon = ambiente.includes('_CLON_');
  const [nombreEditando, setNombreEditando] = useState(false);
  const [nombreTemporal, setNombreTemporal] = useState(informe.nombre || ambiente);

  const ambientesDisponibles = getAmbientesDisponibles(modulo, nivel, tipo);
  const ambienteInfo = ambientesDisponibles.find(a => a.codigo === ambiente);
  let ambienteNombre = ambienteInfo?.nombre || informe.nombre || '';

  const handleGuardarNombre = () => {
    updateNombreAmbiente(ambiente, nombreTemporal);
    setNombreEditando(false);
  };

  const truncate = (str: string, n: number) => {
    return (str.length > n) ? str.substring(0, n - 3) + '...' : str;
  };

  ambienteNombre = truncate(ambienteNombre, 20);

  return (
    <div className="card-ambiente" style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      overflow: 'hidden'
    }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #eee'
      }}>
        {/* Top row with expand/collapse and title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setExpandido(!expandido)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                backgroundColor: '#ddd'
              }}
              title={expandido ? 'Contraer' : 'Expandir'}
            >
              {expandido ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </button>

            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {ambiente}
              </h3>
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '0.1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {ambienteNombre}
                {/* Display Module and Level info */}
                {!expandido && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#777',
                    marginTop: '0.1rem',
                    whiteSpace: 'nowrap'
                  }}>
                    Módulo: {modulo} Nivel: {nivel}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
              className="action-button"
              style={{
                backgroundColor: mostrarVistaPrevia ? '#007acc' : 'black',
                color: 'white',
                padding: '0.4rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={mostrarVistaPrevia ? 'Ocultar vista previa' : 'Mostrar vista previa'}
            >
              <IconEye size={18} />
            </button>
            <button
              onClick={() => toggleVisibilidadAmbiente(ambiente)}
              className="action-button"
              style={{
                backgroundColor: visible ? 'grey' : 'black',
                color: 'white',
                padding: '0.4rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={visible ? 'Ocultar ambiente' : 'Mostrar ambiente'}
            >
              {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
            <button
              onClick={() => clonarAmbiente(ambiente)}
              className="action-button"
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '0.4rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Clonar ambiente"
            >
              <IconCopy size={18} />
            </button>
            <button
              onClick={() => eliminarAmbiente(ambiente)}
              className="action-button"
              style={{
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                padding: '0.4rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Eliminar ambiente"
            >
              <IconTrash size={18} />
            </button>
          </div>
        </div>

        {/* Second row with date and name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>


          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {esClon && nombreEditando ? (
              <input
                type="text"
                value={nombreTemporal}
                onChange={(e) => setNombreTemporal(e.target.value)}
                onBlur={handleGuardarNombre}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGuardarNombre();
                }}
                autoFocus
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '0.9rem',
                  width: '150px'
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'black',
                  cursor: esClon ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  maxWidth: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => esClon && setNombreEditando(true)}
                title={informe.nombre || ambiente}
              >
                <span>{informe.nombre || ambiente}</span>
                {esClon && <IconPencil size={14} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {mostrarVistaPrevia && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fffbe6',
          borderBottom: '1px solid #eee'
        }}>
          <VistaPreviaInforme ambienteId={ambiente} />
        </div>
      )}

      {/* Editor Section */}
      {expandido && !mostrarVistaPrevia && (
        <div className="card-body" style={{ padding: '1rem' }}>
          <EditorInforme ambienteId={ambiente} />
        </div>
      )}
    </div>
  );
};

export default CardInformeAmbiente;
