import React, { useState } from 'react';
import useDataStore from '../store/tempDataStore';
import dataJson from '../data/ambientes_proyecto_modificado.json';
import { getAmbientesDisponibles } from '../utils/ambientesUtils';

const mockCategorias: Record<string, string[]> = {
  'PAREDES': ['Bloqueo', 'Repello', 'Pasta', 'Sellador', 'Pintura 1', 'Pintura 2'],
  'VENTANA EXTERIOR': ['Marco', 'Vidrio', 'Sello neopreno'],
  'VENTANA INTERIOR': ['Marco', 'Vidrio', 'Sello neopreno'],
  'PUERTA': ['Marco', 'Hoja', 'Cerradura', 'Manigueta'],
  'CIELORRASO': ['Estructura ángulo', 'Estructura Retícula', 'Láminas'],
  'CORTINERO': ['Estructura', 'Forro', 'Pasta', 'Sellador', 'Pintura'],
  'PISOS': ['Topping', 'Baldosa', 'Lechada'],
  'SOCALO': ['Baldosa', 'Lechada'],
  
};

const getSimboloEstado = (estado?: string): string => {
  switch (estado) {
    case '✅': return '✔';
    case '❌': return '✖';
    case '⚠️': return '⚠';
    case '⭕': return '⭕';
    default: return '';
  }
};

const VistaPreviaInforme = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { modulo, nivel, tipo, configuracion, informesPorAmbiente, ambientesActivos } = useDataStore();
  const estilo = configuracion?.estiloInforme || {};
  const [exportando, setExportando] = useState(false);

  const today = new Date();
  const fechaFormateada = today.toLocaleDateString('es-ES');
  const claveHoy = today.toISOString().slice(0, 10);

  const informesHoy = Object.keys(localStorage)
    .filter(k => k.startsWith('draft_'))
    .map(k => {
      try {
        const data = JSON.parse(localStorage.getItem(k) || '{}');
        return data?.fecha === claveHoy;
      } catch { return false; }
    })
    .filter(Boolean).length;

  const numeroInforme = informesHoy || 1;

  const renderAmbiente = (ambienteId: string) => {
    const informe = informesPorAmbiente?.[ambienteId];
    if (!informe) return null;

    // Get ambiente name from available ambientes
    const ambientesDisponibles = getAmbientesDisponibles(modulo, nivel, tipo);
    const ambienteInfo = ambientesDisponibles.find(a => a.codigo === ambienteId);
    const ambienteNombre = ambienteInfo?.nombre || informe.nombre || '';

    const visibleCategorias = Object.entries(mockCategorias)
      .filter(([cat]) => informe.categoriasVisibles?.[cat] ?? true)
      .map(([cat, subs]) => {
        const conEstado = subs.filter((sub) => informe.estado?.[cat]?.[sub]);
        return [cat, conEstado] as [string, string[]];
      })
      .filter(([_, subs]) => subs.length > 0);

    const numFilas = Math.max(0, ...visibleCategorias.map(([_, subs]) => subs.length));

    if (visibleCategorias.length === 0 && !informe.comentarios && (!informe.imagenes || informe.imagenes.length === 0)) {
      return null;
    }

    return (
      <div key={ambienteId} style={{ marginBottom: '2rem' }} data-ambiente={ambienteId}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>Ambiente:</strong> {ambienteId} {ambienteNombre ? `- ${ambienteNombre}` : ''}
        </p>

        <h3 style={{ margin: '0.5rem 0' }}>Tabla de Inspección</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              {visibleCategorias.map(([cat]) => (
                <th key={cat} style={{ border: '1px solid #ccc', padding: '0.25rem', background: '#f0f0f0' }}>{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numFilas }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {visibleCategorias.map(([cat, subs]) => {
                  const sub = subs[rowIdx];
                  const estado = informe.estado?.[cat]?.[sub];
                  return (
                    <td key={cat + '-' + rowIdx} style={{ border: '1px solid #ddd', padding: '0.25rem', textAlign: 'center' }}>
                      {sub ? (
                        <>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.1rem' }}>{sub}</div>
                          <div>{getSimboloEstado(estado)}</div>
                        </>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {informe.comentarios && (
          <>
            <h3 style={{ margin: '0.5rem 0' }}>Observaciones</h3>
            <p style={{ margin: '0 0 0.5rem 0' }}>{informe.comentarios}</p>
          </>
        )}

        {informe.imagenes?.length > 0 && (
          <>
            <h3 style={{ margin: '0.5rem 0' }}>Imágenes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {informe.imagenes.map((img: any, idx: number) => (
                <div key={idx} style={{ width: '140px', textAlign: 'center' }}>
                  <img src={img.src} alt={`img-${idx}`} style={{ width: '100%', border: '1px solid #ccc' }} />
                  <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{img.etiqueta || 'Sin etiqueta'}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      id="vista-previa"
      ref={ref}
      style={{
        fontFamily: estilo.fontFamily || 'Arial',
        fontSize: estilo.fontSize || '12pt',
        lineHeight: 0.5,
        maxWidth: estilo.maxWidth || '800px',
        margin: '1rem auto',
        color: '#000',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {estilo.logo && (
          <img src={estilo.logo} alt="Logo" style={{ maxHeight: '60px', marginBottom: '0.5rem' }} />
        )}
        <h2 style={{ margin: 0 }}>
          {fechaFormateada} - INFORME DE INSPECCIÓN Nº{numeroInforme}
        </h2>
      </div>

      <p style={{ margin: '0.5rem 0' }}><strong>Módulo:</strong> {modulo} &nbsp; <strong>Nivel:</strong> {nivel}</p>

      {!exportando && (
        <div style={{ textAlign: 'right', marginBottom: '1rem' }} className="solo-pantalla">
          <button
            onClick={() => {
              const elemento = document.getElementById('vista-previa');
              if (elemento) {
                setExportando(true);
                import('./exportadorPDF')
                  .then(({ default: exportadorPDF }) => {
                    if (exportadorPDF) {
                      exportadorPDF(elemento)
                        .finally(() => {
                          setTimeout(() => setExportando(false), 500);
                        });
                    } else {
                      console.error("exportadorPDF is not a function");
                      setExportando(false);
                    }
                  })
                  .catch(error => {
                    console.error("Error importing exportadorPDF:", error);
                    setExportando(false);
                  });
              }
            }}
            style={{
              backgroundColor: '#007acc',
              color: 'white',
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '0.5rem'
            }}
          >
            📅 Descargar Informe
          </button>
        </div>
      )}

      {ambientesActivos.map(renderAmbiente)}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem' }}>{estilo.firmaLinea || '______________________'}</p>
        <p style={{ margin: 0 }}>{estilo.firmaNombre || 'Nombre y Firma del Inspector'}</p>
      </div>
    </div>
  );
});

export default VistaPreviaInforme;
