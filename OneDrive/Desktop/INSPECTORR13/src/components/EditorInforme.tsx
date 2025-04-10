import React, { useEffect, useState, useRef } from 'react';
import useDataStore from '../store/tempDataStore';
import EditorCabecera from './editor/EditorCabecera';
import EditorComentarios from './editor/EditorComentarios';
import EditorImagenes from './editor/EditorImagenes';
import styles from './EditorInforme.module.css';

interface Props {
  ambienteId: string;
}

const estados = ['✅', '❌', '⚠️', '⭕'];

const EditorInforme: React.FC<Props> = ({ ambienteId }) => {
  const {
    informesPorAmbiente,
    setEstadoInforme,
    updateNombreAmbiente,
    setComentarios,
    toggleCategoriaActiva,
    configuracion
  } = useDataStore();

  const informe = informesPorAmbiente?.[ambienteId] || {};
  const estado = informe.estado || {};
  const categoriasVisibles = informe.categoriasVisibles || {};
  const elementosInspeccion = configuracion.elementosInspeccion.categorias;

  const [nombreEditando, setNombreEditando] = useState(false);
  const [nombreTemporal, setNombreTemporal] = useState(informe.nombre || ambienteId);
  const esClon = ambienteId.includes('_CLON_');

  const carruselRef = useRef<HTMLDivElement>(null);

  const handleGuardarNombre = () => {
    updateNombreAmbiente(ambienteId, nombreTemporal);
    setNombreEditando(false);
  };

  useEffect(() => {
    // Initialize visibility states for new categories
    const categoriasActuales = Object.keys(categoriasVisibles);
    const categoriasConfiguracion = elementosInspeccion.map(c => c.id);
    
    if (categoriasConfiguracion.some(c => !categoriasActuales.includes(c))) {
      const nuevasVisibilidades = Object.fromEntries(
        elementosInspeccion.map(c => [c.id, c.activo])
      );
      toggleCategoriaActiva(ambienteId, nuevasVisibilidades, true);
    }
  }, [elementosInspeccion]);

  const handleClickTitulo = (categoria: string) => {
    const existente = informe.comentarios || '';
    const nuevo = existente.trim() ? `${existente} [${categoria}]` : `[${categoria}]`;
    setComentarios(ambienteId, nuevo);
  };

  const handleEstadoClick = (categoria: string, sub: string, estadoNuevo: string) => {
    setEstadoInforme(ambienteId, categoria, sub, estadoNuevo);
  };

  const scrollCarrusel = (dir: 'left' | 'right') => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Filter active categories from configuration
  const categoriasActivas = elementosInspeccion.filter(c => c.activo);

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fafafa', borderRadius: '8px' }}>
      <EditorCabecera
        ambienteId={ambienteId}
        nombreActual={informe.nombre || ambienteId}
        esClon={esClon && nombreEditando}
        nombreTemporal={nombreTemporal}
        setNombreTemporal={setNombreTemporal}
        setNombreEditando={setNombreEditando}
        onGuardarNombre={handleGuardarNombre}
      />

      <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>Elementos de Inspección</h4>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => scrollCarrusel('left')}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer'
          }}
        >
          ‹
        </button>

        <div
          ref={carruselRef}
          className={styles.carousel}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '1rem',
            padding: '0.5rem 2rem',
            scrollBehavior: 'smooth'
          }}
        >
          {categoriasActivas.map((categoria) => (
            <div
              key={categoria.id}
              style={{
                minWidth: '220px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '0.8rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{ fontWeight: 'bold', color: '#007acc', cursor: 'pointer' }}
                  onClick={() => handleClickTitulo(categoria.nombre)}
                  title="Insertar en comentarios"
                >
                  {categoria.nombre}
                </span>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {categoria.subelementos.filter(sub => sub.activo).map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{sub.nombre}</span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {estados.map((e) => (
                        <span
                          key={e}
                          onClick={() => handleEstadoClick(categoria.nombre, sub.nombre, e)}
                          style={{
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: estado[categoria.nombre]?.[sub.nombre] === e ? 1 : 0.3,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollCarrusel('right')}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer'
          }}
        >
          ›
        </button>
      </div>

      <EditorComentarios ambienteId={ambienteId} />
      <EditorImagenes ambienteId={ambienteId} />
    </div>
  );
};

export default EditorInforme;
