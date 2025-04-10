import React, { useState } from 'react';
import useDataStore from '../store/tempDataStore';

interface PanelConfiguracionProps {}

const PanelConfiguracion: React.FC<PanelConfiguracionProps> = () => {
  const { configuracion, setConfiguracion } = useDataStore();

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [tipoActivo, setTipoActivo] = useState<'comentarios' | 'imagenes' | 'frecuentes' | 'estiloInforme'>('comentarios');
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState('');
  const [nuevaPalabraFrecuente, setNuevaPalabraFrecuente] = useState('');

  // Handlers existentes
  const handleChangeEtiqueta = (tipo: 'comentarios' | 'imagenes', disciplina: string, index: number, value: string) => {
    const nuevaConfig = { ...configuracion };
    nuevaConfig.etiquetas[tipo][disciplina][index] = value;
    setConfiguracion(nuevaConfig);
  };

  const handleAddEtiqueta = (tipo: 'comentarios' | 'imagenes', disciplina: string) => {
    if (!nuevaEtiqueta.trim()) return;
    const nuevaConfig = { ...configuracion };
    nuevaConfig.etiquetas[tipo][disciplina].push(nuevaEtiqueta);
    setConfiguracion(nuevaConfig);
    setNuevaEtiqueta('');
  };

  const handleRemoveEtiqueta = (tipo: 'comentarios' | 'imagenes', disciplina: string, etiqueta: string) => {
    const nuevaConfig = { ...configuracion };
    nuevaConfig.etiquetas[tipo][disciplina] = nuevaConfig.etiquetas[tipo][disciplina].filter((e) => e !== etiqueta);
    setConfiguracion(nuevaConfig);
  };

  const handleAddDisciplina = (tipo: 'comentarios' | 'imagenes') => {
    if (!nuevoNombre.trim()) return;
    const disciplina = nuevoNombre.toUpperCase();
    const nuevaConfig = { ...configuracion };
    if (!nuevaConfig.etiquetas[tipo][disciplina]) {
      nuevaConfig.etiquetas[tipo][disciplina] = [];
      setConfiguracion(nuevaConfig);
      setNuevoNombre('');
      setDisciplinaSeleccionada(disciplina);
    }
  };

  const handleRemoveDisciplina = (tipo: 'comentarios' | 'imagenes', nombre: string) => {
    const nuevaConfig = { ...configuracion };
    delete nuevaConfig.etiquetas[tipo][nombre];
    setConfiguracion(nuevaConfig);
  };

  const handleRenameDisciplina = (tipo: 'comentarios' | 'imagenes', oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return;
    const nuevaConfig = { ...configuracion };
    nuevaConfig.etiquetas[tipo][newName.toUpperCase()] = [...nuevaConfig.etiquetas[tipo][oldName]];
    delete nuevaConfig.etiquetas[tipo][oldName];
    setConfiguracion(nuevaConfig);
  };

  const handleAddPalabraFrecuente = () => {
    if (!nuevaPalabraFrecuente.trim()) return;
    const nuevaConfig = { ...configuracion };
    if (!nuevaConfig.etiquetas.frecuentes) {
      nuevaConfig.etiquetas.frecuentes = [];
    }
    nuevaConfig.etiquetas.frecuentes.push(nuevaPalabraFrecuente);
    setConfiguracion(nuevaConfig);
    setNuevaPalabraFrecuente('');
  };

  const handleRemovePalabraFrecuente = (palabra: string) => {
    const nuevaConfig = { ...configuracion };
    if (nuevaConfig.etiquetas.frecuentes) {
      nuevaConfig.etiquetas.frecuentes = nuevaConfig.etiquetas.frecuentes.filter((p) => p !== palabra);
      setConfiguracion(nuevaConfig);
    }
  };

  // Handlers para estiloInforme
  const handleChangeEstiloInforme = (campo: keyof typeof configuracion.estiloInforme, valor: string | number) => {
    const nuevaConfig = { ...configuracion };
    nuevaConfig.estiloInforme[campo] = valor as never; // Type assertion para compatibilidad
    setConfiguracion(nuevaConfig);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChangeEstiloInforme('logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFirmaImagenUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChangeEstiloInforme('firmaImagen', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '0.5rem' }}>
        🛠️ Panel de Configuración
      </h2>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setTipoActivo('comentarios')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: tipoActivo === 'comentarios' ? '#007acc' : '#f0f0f0',
            color: tipoActivo === 'comentarios' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🗨️ Etiquetas para Comentarios
        </button>
        <button
          onClick={() => setTipoActivo('imagenes')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: tipoActivo === 'imagenes' ? '#007acc' : '#f0f0f0',
            color: tipoActivo === 'imagenes' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🏷️ Etiquetas para Imágenes
        </button>
        <button
          onClick={() => setTipoActivo('frecuentes')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: tipoActivo === 'frecuentes' ? '#007acc' : '#f0f0f0',
            color: tipoActivo === 'frecuentes' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ⭐ Palabras Frecuentes
        </button>
        <button
          onClick={() => setTipoActivo('estiloInforme')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: tipoActivo === 'estiloInforme' ? '#007acc' : '#f0f0f0',
            color: tipoActivo === 'estiloInforme' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📝 Estilo de Informe
        </button>
      </div>

      {tipoActivo === 'comentarios' && (
        <>
          {/* Formulario para nueva disciplina */}
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #e0e0e0',
            }}
          >
            <h3 style={{ marginTop: 0 }}>➕ Crear Nueva Disciplina</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={tipoActivo === 'comentarios' ? nuevoNombre : ''}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre de la disciplina"
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
              />
              <button
                onClick={() => handleAddDisciplina(tipoActivo)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Agregar Disciplina
              </button>
            </div>
          </div>

          {/* Listado de disciplinas */}
          {Object.entries(configuracion.etiquetas[tipoActivo] || {}).map(([disciplina, etiquetas]) => (
            <div
              key={disciplina}
              style={{
                marginBottom: '2rem',
                border: '1px solid #e0e0e0',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <h3 style={{ margin: 0, color: '#007acc' }}>{disciplina}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      const nuevo = prompt(`Renombrar disciplina: ${disciplina}`, disciplina);
                      if (nuevo) handleRenameDisciplina(tipoActivo, disciplina, nuevo);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Renombrar
                  </button>
                  <button
                    onClick={() => handleRemoveDisciplina(tipoActivo, disciplina)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#ffebee',
                      border: '1px solid #ffcdd2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#d32f2f',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              {/* Lista de etiquetas existentes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Etiquetas existentes:</h4>
                {etiquetas.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No hay etiquetas definidas</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {etiquetas.map((etiqueta, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '16px',
                          padding: '0.3rem 0.8rem',
                          border: '1px solid #bbdefb',
                        }}
                      >
                        <input
                          value={etiqueta}
                          onChange={(e) => handleChangeEtiqueta(tipoActivo, disciplina, index, e.target.value)}
                          style={{ background: 'transparent', border: 'none', outline: 'none', minWidth: '100px' }}
                        />
                        <button
                          onClick={() => handleRemoveEtiqueta(tipoActivo, disciplina, etiqueta)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                            fontSize: '0.9rem',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario para nueva etiqueta */}
              <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>➕ Agregar Nueva Etiqueta</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={disciplinaSeleccionada === disciplina ? nuevaEtiqueta : ''}
                    onChange={(e) => {
                      setDisciplinaSeleccionada(disciplina);
                      setNuevaEtiqueta(e.target.value);
                    }}
                    placeholder="Nombre de la etiqueta"
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
                  />
                  <button
                    onClick={() => handleAddEtiqueta(tipoActivo, disciplina)}
                    disabled={!nuevaEtiqueta.trim()}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: !nuevaEtiqueta.trim() ? '#ccc' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: !nuevaEtiqueta.trim() ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Agregar Etiqueta
                  </button>
                </div>
              </div>
            </div>
          ))}

          {Object.keys(configuracion.etiquetas[tipoActivo] || {}).length === 0 && (
            <div
              style={{
                backgroundColor: '#fff8e1',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ffe0b2',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#ff8f00' }}>
                No hay disciplinas definidas. Crea una nueva disciplina para comenzar.
              </p>
            </div>
          )}
        </>
      )}

      {tipoActivo === 'imagenes' && (
        <>
          {/* Formulario para nueva disciplina (Imágenes) */}
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #e0e0e0',
            }}
          >
            <h3 style={{ marginTop: 0 }}>➕ Crear Nueva Disciplina (Imágenes)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={tipoActivo === 'imagenes' ? nuevoNombre : ''}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre de la disciplina"
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
              />
              <button
                onClick={() => handleAddDisciplina(tipoActivo)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Agregar Disciplina
              </button>
            </div>
          </div>

          {/* Listado de disciplinas (Imágenes) */}
          {Object.entries(configuracion.etiquetas.imagenes || {}).map(([disciplina, etiquetas]) => (
            <div
              key={disciplina}
              style={{
                marginBottom: '2rem',
                border: '1px solid #e0e0e0',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <h3 style={{ margin: 0, color: '#007acc' }}>{disciplina}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      const nuevo = prompt(`Renombrar disciplina: ${disciplina}`, disciplina);
                      if (nuevo) handleRenameDisciplina(tipoActivo, disciplina, nuevo);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Renombrar
                  </button>
                  <button
                    onClick={() => handleRemoveDisciplina(tipoActivo, disciplina)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#ffebee',
                      border: '1px solid #ffcdd2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#d32f2f',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              {/* Lista de etiquetas existentes (Imágenes) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Etiquetas existentes:</h4>
                {etiquetas.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No hay etiquetas definidas</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {etiquetas.map((etiqueta, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '16px',
                          padding: '0.3rem 0.8rem',
                          border: '1px solid #bbdefb',
                        }}
                      >
                        <input
                          value={etiqueta}
                          onChange={(e) => handleChangeEtiqueta(tipoActivo, disciplina, index, e.target.value)}
                          style={{ background: 'transparent', border: 'none', outline: 'none', minWidth: '100px' }}
                        />
                        <button
                          onClick={() => handleRemoveEtiqueta(tipoActivo, disciplina, etiqueta)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                            fontSize: '0.9rem',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario para nueva etiqueta (Imágenes) */}
              <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>➕ Agregar Nueva Etiqueta</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={disciplinaSeleccionada === disciplina ? nuevaEtiqueta : ''}
                    onChange={(e) => {
                      setDisciplinaSeleccionada(disciplina);
                      setNuevaEtiqueta(e.target.value);
                    }}
                    placeholder="Nombre de la etiqueta"
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
                  />
                  <button
                    onClick={() => handleAddEtiqueta(tipoActivo, disciplina)}
                    disabled={!nuevaEtiqueta.trim()}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: !nuevaEtiqueta.trim() ? '#ccc' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: !nuevaEtiqueta.trim() ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Agregar Etiqueta
                  </button>
                </div>
              </div>
            </div>
          ))}

          {Object.keys(configuracion.etiquetas.imagenes || {}).length === 0 && (
            <div
              style={{
                backgroundColor: '#fff8e1',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ffe0b2',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#ff8f00' }}>
                No hay disciplinas definidas para imágenes. Crea una nueva disciplina para comenzar.
              </p>
            </div>
          )}
        </>
      )}

      {tipoActivo === 'frecuentes' && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #e0e0e0',
          }}
        >
          <h3 style={{ marginTop: 0 }}>⭐ Administrar Palabras Frecuentes</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="nueva-palabra-frecuente" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Añadir nueva palabra frecuente:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                id="nueva-palabra-frecuente"
                value={nuevaPalabraFrecuente}
                onChange={(e) => setNuevaPalabraFrecuente(e.target.value)}
                placeholder="Palabra frecuente"
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
              />
              <button
                onClick={handleAddPalabraFrecuente}
                disabled={!nuevaPalabraFrecuente.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: !nuevaPalabraFrecuente.trim() ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !nuevaPalabraFrecuente.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Añadir Palabra
              </button>
            </div>
          </div>

          <div>
            <h4>Palabras frecuentes existentes:</h4>
            {configuracion.etiquetas.frecuentes && configuracion.etiquetas.frecuentes.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {configuracion.etiquetas.frecuentes.map((palabra, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#f0f0f0',
                      borderRadius: '16px',
                      padding: '0.3rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      border: '1px solid #ccc',
                    }}
                  >
                    <span>{palabra}</span>
                    <button
                      onClick={() => handleRemovePalabraFrecuente(palabra)}
                      style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay palabras frecuentes definidas.</p>
            )}
          </div>
        </div>
      )}

      {tipoActivo === 'estiloInforme' && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #e0e0e0',
          }}
        >
          <h3 style={{ marginTop: 0 }}>📝 Configuración de Estilo de Informe</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Fuente */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fuente:</label>
              <input
                type="text"
                value={configuracion.estiloInforme.fontFamily}
                onChange={(e) => handleChangeEstiloInforme('fontFamily', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
              />
            </div>

            {/* Tamaño de fuente */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tamaño de fuente:</label>
              <input
                type="text"
                value={configuracion.estiloInforme.fontSize}
                onChange={(e) => handleChangeEstiloInforme('fontSize', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
              />
            </div>

            {/* Interlineado */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Interlineado:</label>
              <input
                type="number"
                step="0.1"
                value={configuracion.estiloInforme.lineHeight}
                onChange={(e) => handleChangeEstiloInforme('lineHeight', parseFloat(e.target.value))}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
              />
            </div>

            {/* Manager de Logo */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>🖼️ Logo Institucional</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subir Logo:</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ width: '100%' }} />
                </div>
                {configuracion.estiloInforme.logo && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Vista Previa:</label>
                    <img
                      src={configuracion.estiloInforme.logo}
                      alt="Logo"
                      style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tamaño del Logo:</label>
                  <input
                    type="text"
                    value={configuracion.estiloInforme.logoWidth}
                    onChange={(e) => handleChangeEstiloInforme('logoWidth', e.target.value)}
                    placeholder="Ej: 100px o 50%"
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Alineación del Logo:</label>
                  <select
                    value={configuracion.estiloInforme.logoAlign}
                    onChange={(e) => handleChangeEstiloInforme('logoAlign', e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                  >
                    <option value="izquierda">Izquierda</option>
                    <option value="centro">Centro</option>
                    <option value="derecha">Derecha</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Manager de Firma */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>✍️ Configuración de Firma</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Modo de Firma:</label>
                  <select
                    value={configuracion.estiloInforme.firmaModo}
                    onChange={(e) => handleChangeEstiloInforme('firmaModo', e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                  >
                    <option value="texto">Texto</option>
                    <option value="imagen">Texto + Imagen</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre de la Firma:</label>
                    <input
                      type="text"
                      value={configuracion.estiloInforme.firmaNombre}
                      onChange={(e) => handleChangeEstiloInforme('firmaNombre', e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Línea de la Firma:</label>
                    <input
                      type="text"
                      value={configuracion.estiloInforme.firmaLinea}
                      onChange={(e) => handleChangeEstiloInforme('firmaLinea', e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                    />
                  </div>
                  {configuracion.estiloInforme.firmaModo === 'imagen' && (
                    <>
                      <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subir Firma como Imagen:</label>
                        <input type="file" accept="image/*" onChange={handleFirmaImagenUpload} style={{ width: '100%' }} />
                      </div>
                      {configuracion.estiloInforme.firmaImagen && (
                        <div style={{ textAlign: 'right' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Vista Previa de la Firma:</label>
                          <img
                            src={configuracion.estiloInforme.firmaImagen}
                            alt="Firma"
                            style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelConfiguracion;
