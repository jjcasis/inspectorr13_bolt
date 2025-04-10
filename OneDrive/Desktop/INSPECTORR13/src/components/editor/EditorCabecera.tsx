import React from 'react';
import useDataStore from '../../store/tempDataStore';
import { IconCalendar, IconPencil } from '@tabler/icons-react';
import { getAmbientesDisponibles } from '../../utils/ambientesUtils';

interface Props {
  ambienteId: string;
  nombreActual: string;
  esClon: boolean;
  nombreTemporal: string;
  setNombreTemporal: (val: string) => void;
  setNombreEditando: (val: boolean) => void;
  onGuardarNombre: () => void;
}

const EditorCabecera: React.FC<Props> = ({
  ambienteId,
  nombreActual,
  esClon,
  nombreTemporal,
  setNombreTemporal,
  setNombreEditando,
  onGuardarNombre
}) => {
  const { modulo, nivel, tipo, informesPorAmbiente, setFechaInforme } = useDataStore();
  const informe = informesPorAmbiente?.[ambienteId] || {};
  const fechaActual = informe.fecha || new Date().toISOString().slice(0, 10);

  // Get ambiente name from available ambientes
  const ambientesDisponibles = getAmbientesDisponibles(modulo, nivel, tipo);
  const ambienteInfo = ambientesDisponibles.find(a => a.codigo === ambienteId);
  const ambienteNombre = ambienteInfo?.nombre || informe.nombre || '';

  return (
    <div style={{ 
      marginBottom: '1.5rem', 
      borderBottom: '1px solid #ccc', 
      paddingBottom: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.5rem',
              fontWeight: 600,
              lineHeight: 1.2
            }}>
              {ambienteId}
            </h2>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginTop: '0.2rem'
            }}>
              {ambienteNombre}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem'
          }}>
            <IconCalendar size={18} color="#666" />
            <input
              type="date"
              id="fecha-informe"
              value={fechaActual}
              onChange={(e) => setFechaInforme(ambienteId, e.target.value)}
              style={{ 
                padding: '0.3rem', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            {esClon ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={nombreTemporal}
                  onChange={(e) => setNombreTemporal(e.target.value)}
                  onBlur={onGuardarNombre}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onGuardarNombre();
                  }}
                  autoFocus
                  style={{ 
                    padding: '0.3rem 0.5rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    fontSize: '0.9rem'
                  }}
                />
                <IconPencil size={16} color="#666" />
              </div>
            ) : (
              <div style={{ 
                fontSize: '0.95rem', 
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{nombreActual}</span>
              </div>
            )}
          </div>

          <div style={{ 
            fontSize: '0.95rem', 
            color: '#666',
            display: 'flex',
            gap: '1rem'
          }}>
            <span><strong>Módulo:</strong> {modulo}</span>
            <span><strong>Nivel:</strong> {nivel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCabecera;
