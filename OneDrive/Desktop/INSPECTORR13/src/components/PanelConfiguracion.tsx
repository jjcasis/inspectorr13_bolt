import React, { useState, useEffect } from 'react';
import useDataStore from '../store/tempDataStore';
import { CollapsibleSection } from './CollapsibleSection';

const PanelConfiguracion: React.FC = () => {
  const { configuracion, setConfiguracion } = useDataStore();
  const [tipoActivo, setTipoActivo] = useState<'comentarios' | 'imagenes' | 'frecuentes' | 'estiloInforme' | 'elementosInspeccion'>('comentarios');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState('');
  const [nuevaPalabraFrecuente, setNuevaPalabraFrecuente] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevoSubelemento, setNuevoSubelemento] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedPresets = localStorage.getItem('configPresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('configPresets', JSON.stringify(presets));
  }, [presets]);

  // Handlers: etiquetas
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
  const handleAddCategoria = () => {
    if (!nuevaCategoria.trim()) return;
    const nuevaConfig = { ...configuracion };
    nuevaConfig.elementosInspeccion.categorias.push({
      id: nuevaCategoria.toLowerCase().replace(/\s+/g, '-'),
      nombre: nuevaCategoria.toUpperCase(),
      activo: true,
      subelementos: []
    });
    setConfiguracion(nuevaConfig);
    setNuevaCategoria('');
  };

  const handleRemoveCategoria = (id: string) => {
    const nuevaConfig = { ...configuracion };
    nuevaConfig.elementosInspeccion.categorias = nuevaConfig.elementosInspeccion.categorias.filter(c => c.id !== id);
    setConfiguracion(nuevaConfig);
  };

  const handleToggleCategoria = (id: string) => {
    const nuevaConfig = { ...configuracion };
    const categoria = nuevaConfig.elementosInspeccion.categorias.find(c => c.id === id);
    if (categoria) {
      categoria.activo = !categoria.activo;
      setConfiguracion(nuevaConfig);
    }
  };

  const handleAddSubelemento = (categoriaId: string) => {
    if (!nuevoSubelemento.trim()) return;
    const nuevaConfig = { ...configuracion };
    const categoria = nuevaConfig.elementosInspeccion.categorias.find(c => c.id === categoriaId);
    if (categoria) {
      categoria.subelementos.push(nuevoSubelemento);
      setConfiguracion(nuevaConfig);
      setNuevoSubelemento('');
    }
  };

  const handleRemoveSubelemento = (categoriaId: string, sub: string) => {
    const nuevaConfig = { ...configuracion };
    const categoria = nuevaConfig.elementosInspeccion.categorias.find(c => c.id === categoriaId);
    if (categoria) {
      categoria.subelementos = categoria.subelementos.filter(s => s !== sub);
      setConfiguracion(nuevaConfig);
    }
  };

  const renderCategorias = () => {
    return configuracion.elementosInspeccion.categorias.map(cat => (
      <div key={cat.id} style={{ 
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '6px'
      }}>
        <button
          onClick={() => handleToggleCategoria(cat.id)}
          style={{
            width: '100%',
            padding: '0.75rem',
            textAlign: 'left',
            backgroundColor: '#fff',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {cat.nombre} {cat.activo ? '▲' : '▼'}
        </button>
        {cat.activo && (
          <div style={{ padding: '1rem' }}>
            <ul>
              {cat.subelementos.map((sub, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {sub}
                  <button onClick={() => handleRemoveSubelemento(cat.id, sub)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✖
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="Nuevo subelemento"
                value={nuevoSubelemento}
                onChange={e => setNuevoSubelemento(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={() => handleAddSubelemento(cat.id)} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem' }}>
                Agregar
              </button>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleRemoveCategoria(cat.id)} style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '0.4rem 0.75rem' }}>
                Eliminar Categoría
              </button>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '0.5rem' }}>
        🛠️ Panel de Configuración
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setTipoActivo('elementosInspeccion')} style={{ backgroundColor: tipoActivo === 'elementosInspeccion' ? '#007acc' : '#eee', color: tipoActivo === 'elementosInspeccion' ? '#fff' : '#000', padding: '0.5rem', borderRadius: '5px' }}>
          🔍 Elementos de Inspección
        </button>
        <button onClick={() => setTipoActivo('comentarios')} style={{ backgroundColor: tipoActivo === 'comentarios' ? '#007acc' : '#eee', color: tipoActivo === 'comentarios' ? '#fff' : '#000', padding: '0.5rem', borderRadius: '5px' }}>
          💬 Etiquetas para Comentarios
        </button>
        <button onClick={() => setTipoActivo('imagenes')} style={{ backgroundColor: tipoActivo === 'imagenes' ? '#007acc' : '#eee', color: tipoActivo === 'imagenes' ? '#fff' : '#000', padding: '0.5rem', borderRadius: '5px' }}>
          🏷️ Etiquetas para Imágenes
        </button>
        <button onClick={() => setTipoActivo('frecuentes')} style={{ backgroundColor: tipoActivo === 'frecuentes' ? '#007acc' : '#eee', color: tipoActivo === 'frecuentes' ? '#fff' : '#000', padding: '0.5rem', borderRadius: '5px' }}>
          ⭐ Palabras Frecuentes
        </button>
        <button onClick={() => setTipoActivo('estiloInforme')} style={{ backgroundColor: tipoActivo === 'estiloInforme' ? '#007acc' : '#eee', color: tipoActivo === 'estiloInforme' ? '#fff' : '#000', padding: '0.5rem', borderRadius: '5px' }}>
          📝 Estilo de Informe
        </button>
      </div>

      {/* Render dinámico */}
      {tipoActivo === 'elementosInspeccion' && (
        <CollapsibleSection title="🛠️ Gestión de Elementos de Inspección" defaultExpanded>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Agregar Nueva Categoría</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nuevaCategoria}
                onChange={e => setNuevaCategoria(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={handleAddCategoria} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem' }}>
                Agregar
              </button>
            </div>
          </div>
          {renderCategorias()}
        </CollapsibleSection>
      )}

      {/* Aquí seguiría el renderizado de los demás tabs: comentarios, imágenes, etc... */}
    </div>
  );
};

export default PanelConfiguracion;
