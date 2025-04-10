import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useDataStore from '../../store/tempDataStore';
import { getAmbientesDisponibles } from '../../utils/ambientesUtils';
import ImageUploader from '../common/ImageUploader';

const mockCategorias = {
  'PAREDES': ['Bloqueo', 'Repello', 'Pintura'],
  'VENTANA': ['Marco', 'Vidrio', 'Sello'],
};

const estados = ['✔️ Conforme', '✖️ No Conforme', '⚠️ Parcial'];

const InspeccionPorElementos: React.FC = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState('');
  const [subelemento, setSubelemento] = useState('');
  const [estado, setEstado] = useState('');
  const [observacion, setObservacion] = useState('');
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [ambientesSeleccionados, setAmbientesSeleccionados] = useState<{ codigo: string; nombre: string }[]>([]);
  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');

  const { 
    crearNuevoInformeElementos, 
    guardarItemEnInformeElementosActivo,
    informeElementosActivoId 
  } = useDataStore();

  const ambientesDisponibles = getAmbientesDisponibles(modulo, nivel, tipo);

  const handleImageCaptured = (imageData: { src: string; etiqueta: string }) => {
    setImagenes([...imagenes, imageData]);
  };

  const agregarAmbiente = (codigo: string) => {
    if (!codigo) return;
    const existente = ambientesSeleccionados.find((a) => a.codigo === codigo);
    if (!existente) {
      const ambiente = ambientesDisponibles.find((a) => a.codigo === codigo);
      if (ambiente) {
        setAmbientesSeleccionados([...ambientesSeleccionados, ambiente]);
      }
    }
  };

  const eliminarAmbiente = (codigo: string) => {
    setAmbientesSeleccionados((prev) => prev.filter((a) => a.codigo !== codigo));
  };

  const aplicar = () => {
    if (!categoria || !subelemento || !estado || ambientesSeleccionados.length === 0) {
      alert('Completa todos los campos y selecciona al menos un ambiente.');
      return;
    }

    if (!informeElementosActivoId) {
      // Create new report
      const nuevoInforme = {
        id: uuidv4(),
        titulo: `Inspección ${modulo}-${nivel} (${tipo})`,
        fecha: new Date().toISOString().slice(0, 10),
        modulo,
        nivel,
        tipo,
        items: []
      };
      crearNuevoInformeElementos(nuevoInforme);
    }

    // Add item to active report
    const nuevoItem = {
      categoria,
      subelemento,
      estado,
      observacion,
      imagen: imagenes[0],
      ambiente: ambientesSeleccionados[0].codigo
    };

    guardarItemEnInformeElementosActivo(nuevoItem);

    // Reset form
    setCategoria('');
    setSubelemento('');
    setEstado('');
    setObservacion('');
    setImagenes([]);
    setAmbientesSeleccionados([]);

    // Navigate to list
    navigate('/elementos');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h2>🔍 Inspección por Elementos</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Módulo:</label>
        <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Nivel:</label>
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="000">000</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="INTERIOR">INTERIOR</option>
          <option value="EXTERIOR">EXTERIOR</option>
          <option value="ESCALERA">ESCALERA</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Categoría:</label>
        <select value={categoria} onChange={(e) => {
          setCategoria(e.target.value);
          setSubelemento('');
        }}>
          <option value="">-- Seleccionar --</option>
          {Object.keys(mockCategorias).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {categoria && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Subelemento:</label>
          <select value={subelemento} onChange={(e) => setSubelemento(e.target.value)}>
            <option value="">-- Seleccionar --</option>
            {mockCategorias[categoria].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {estados.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Observación:</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          rows={3}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Imágenes:</label>
        <ImageUploader
          onImageCaptured={handleImageCaptured}
          allowMultiple={true}
          showPreview={true}
          style={{ marginTop: '0.5rem' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {imagenes.map((img, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img 
                src={img.src} 
                alt="preview" 
                style={{ 
                  width: 100, 
                  height: 100, 
                  objectFit: 'cover',
                  borderRadius: 4 
                }} 
              />
              <button
                onClick={() => setImagenes(imgs => imgs.filter((_, index) => index !== i))}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Agregar ambiente:</label>
        <select onChange={(e) => agregarAmbiente(e.target.value)} value="">
          <option value="">-- Seleccionar --</option>
          {ambientesDisponibles.map((amb) => (
            <option key={amb.codigo} value={amb.codigo} disabled={ambientesSeleccionados.some(a => a.codigo === amb.codigo)}>
              {amb.codigo} - {amb.nombre}
            </option>
          ))}
        </select>
      </div>

      {ambientesSeleccionados.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Ambientes incluidos:</strong>
          <ul>
            {ambientesSeleccionados.map((a) => (
              <li key={a.codigo}>
                {a.codigo} - {a.nombre}
                <button onClick={() => eliminarAmbiente(a.codigo)} style={{ marginLeft: 8, color: 'red' }}>✖</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={aplicar}
        style={{ marginTop: '1rem', padding: '0.8rem 2rem', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: 6 }}
      >
        ✅ Aplicar inspección
      </button>
    </div>
  );
};

export default InspeccionPorElementos;
