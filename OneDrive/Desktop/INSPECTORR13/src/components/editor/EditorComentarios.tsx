import React, { useRef, useState, useEffect } from 'react';
import useDataStore from '../../store/tempDataStore';

interface Props {
  ambienteId: string;
}

const EditorComentarios: React.FC<Props> = ({ ambienteId }) => {
  const { setComentarios, informesPorAmbiente, configuracion } = useDataStore();
  const informe = informesPorAmbiente?.[ambienteId] || {};
  const frecuentes = configuracion?.etiquetas?.frecuentes || [];
  const etiquetasPorDisciplina = configuracion?.etiquetas?.comentarios || {};
  const texto = informe.comentarios || '';

  const disciplinas = Object.entries(etiquetasPorDisciplina);
  const [indiceDisciplina, setIndiceDisciplina] = useState(0);
  const carruselRef = useRef<HTMLDivElement>(null);

  const agregarPalabra = (palabra: string) => {
    const nuevo = texto.trim() ? texto.trim() + ' ' + palabra : palabra;
    setComentarios(ambienteId, nuevo);
  };

  const avanzar = () => setIndiceDisciplina((prev) => (prev + 1) % disciplinas.length);
  const retroceder = () => setIndiceDisciplina((prev) => (prev - 1 + disciplinas.length) % disciplinas.length);

  useEffect(() => {
    if (carruselRef.current) {
      carruselRef.current.scrollTo({
        left: carruselRef.current.clientWidth * indiceDisciplina,
        behavior: 'smooth',
      });
    }
  }, [indiceDisciplina]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ marginBottom: '0.5rem' }}>Observaciones / Comentarios</h4>

      {frecuentes.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Palabras frecuentes:</span>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '0.5rem', 
            marginTop: '0.3rem' 
          }}>
            {frecuentes.map((palabra, idx) => (
              <button
                key={idx}
                onClick={() => agregarPalabra(palabra)}
                style={{
                  padding: '0.3rem 0.6rem',
                  backgroundColor: '#007acc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {palabra}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={texto}
        onChange={(e) => setComentarios(ambienteId, e.target.value)}
        placeholder="Escribe observaciones relevantes..."
        style={{
          width: '100%',
          height: '100px',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {disciplinas.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h5 style={{ marginBottom: '0.5rem' }}>Etiquetas por Disciplina</h5>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={retroceder} style={{ padding: '0.3rem 0.6rem' }}>{'←'}</button>
            <strong>{disciplinas[indiceDisciplina][0]}</strong>
            <button onClick={avanzar} style={{ padding: '0.3rem 0.6rem' }}>{'→'}</button>
          </div>

          <div
            ref={carruselRef}
            style={{
              overflow: 'hidden',
              display: 'flex',
              width: '100%',
              marginTop: '0.5rem',
            }}
          >
            {disciplinas.map(([disciplina, etiquetas], index) => (
              <div
                key={disciplina}
                style={{
                  minWidth: '100%',
                  display: index === indiceDisciplina ? 'block' : 'none',
                }}
              >
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {etiquetas.map((etiqueta, idx) => (
                    <button
                      key={idx}
                      onClick={() => agregarPalabra(etiqueta)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        backgroundColor: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center'
                      }}
                    >
                      {etiqueta}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorComentarios;
