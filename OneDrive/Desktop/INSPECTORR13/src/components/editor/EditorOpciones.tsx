import React from 'react';
import useDataStore from '../../store/tempDataStore';

interface Props {
  ambienteId: string;
}

const EditorOpciones: React.FC<Props> = ({ ambienteId }) => {
  const {
    informesPorAmbiente,
    setLayout,
    toggleCategoriaActiva,
  } = useDataStore();

  const informe = informesPorAmbiente?.[ambienteId] || {};
  const layout = informe.layout || 'grilla';
  const categoriasVisibles = informe.categoriasVisibles || {};
  const todasCategorias = Object.keys(informe.estado || {});

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ marginBottom: '0.5rem' }}>Opciones de Visualización</h4>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Diseño del Informe:</label>
        <select
          value={layout}
          onChange={(e) => setLayout(ambienteId, e.target.value)}
          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="grilla">Tabla Transpuesta (Grilla)</option>
          <option value="lista">Lista Vertical</option>
        </select>
      </div>

      <div>
        <label style={{ fontWeight: 'bold' }}>Categorías Visibles:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {todasCategorias.map((cat) => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <input
                type="checkbox"
                checked={categoriasVisibles?.[cat] ?? true}
                onChange={() => toggleCategoriaActiva(ambienteId, cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorOpciones;
