import React, { useState } from 'react';
import useDataStore from '../../store/tempDataStore';

interface Props {
  ambienteId: string;
}

const simbolos = [
  { label: '✔', value: '✓' },
  { label: '✖', value: '✗' },
  { label: '⚠', value: 'O' },
  { label: '⬜', value: '' },
];

const EditorChecklist: React.FC<Props> = ({ ambienteId }) => {
  const { setEstadoInforme, informesPorAmbiente } = useDataStore();
  const informe = informesPorAmbiente?.[ambienteId] || {};
  const estado = informe.estado || {};
  const categorias = Object.entries(estado);

  const [indiceCategoria, setIndiceCategoria] = useState(0);

  if (!categorias.length) {
    return <p style={{ fontStyle: 'italic', color: '#888' }}>No hay elementos para inspeccionar.</p>;
  }

  const avanzar = () => setIndiceCategoria((prev) => (prev + 1) % categorias.length);
  const retroceder = () => setIndiceCategoria((prev) => (prev - 1 + categorias.length) % categorias.length);

  const [categoriaActual, subelementos] = categorias[indiceCategoria];

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={retroceder} style={{ padding: '0.3rem 0.6rem' }}>{'←'}</button>
        <h4 style={{ color: '#007acc', marginBottom: '0.5rem' }}>{categoriaActual}</h4>
        <button onClick={avanzar} style={{ padding: '0.3rem 0.6rem' }}>{'→'}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Object.entries(subelementos).map(([sub, valor]) => (
          <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ flex: 1 }}>{sub}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {simbolos.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setEstadoInforme(ambienteId, categoriaActual, sub, s.value)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    border: valor === s.value ? '2px solid #007acc' : '1px solid #ccc',
                    backgroundColor: valor === s.value ? '#e3f2fd' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorChecklist;
