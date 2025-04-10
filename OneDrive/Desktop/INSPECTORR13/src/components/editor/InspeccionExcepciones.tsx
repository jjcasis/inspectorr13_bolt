import React, { useState } from 'react';
import useDataStore from '../../store/tempDataStore';

const mockCategorias = {
  'PAREDES': ['Bloqueo', 'Repello', 'Pintura'],
  'VENTANA': ['Marco', 'Vidrio', 'Sello'],
};

const estados = ['✔️ Conforme', '✖️ No Conforme', '⚠️ Parcial'];

const nivelesOrdenadosPorModulo = {
  A: ['-100', '000', '100', '200', '300'],
  B: ['000', '100', '200', 'TECHO'],
  C: ['-100', '000', '100', '200', '300']
};

const InspeccionExcepciones: React.FC = () => {
  const [categoria, setCategoria] = useState('');
  const [subelemento, setSubelemento] = useState('');
  const [estado, setEstado] = useState('');
  const [observacion, setObservacion] = useState('');
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [ambientesSeleccionados, setAmbientesSeleccionados] = useState<{ codigo: string; nombre: string }[]>([]);

  // Location selector states
  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');

  const { aplicarExcepcionAMultiplesAmbientes } = useDataStore();

  const handleImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const nuevas: any[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        nuevas.push({ src: reader.result, etiqueta: '' });
        if (nuevas.length === files.length) {
          setImagenes([...imagenes, ...nuevas]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const eliminarAmbiente = (codigo: string) => {
    setAmbientesSeleccionados((prev) => prev.filter((a) => a.codigo !== codigo));
  };

  const aplicar = () => {
    if (!categoria || !subelemento || !estado || ambientesSeleccionados.length === 0) {
      alert('Completa todos los campos y selecciona al menos un ambiente.');
      return;
    }

    aplicarExcepcionAMultiplesAmbientes({
      categoria,
      subelemento,
      estado,
      observacion,
      imagenes,
      ambientes: ambientesSeleccionados.map((a) => a.codigo),
    });

    setCategoria('');
    setSubelemento('');
    setEstado('');
    setObservacion('');
    setImagenes([]);
    setAmbientesSeleccionados([]);
    alert('Inspección aplicada con éxito.');
  };

  const SelectorUbicacion = () => {
    const nivelesDisponibles = nivelesOrdenadosPorModulo[modulo as keyof typeof nivelesOrdenadosPorModulo];

    const buttonStyle = (active: boolean) => ({
      padding: '0.5rem 1rem',
      backgroundColor: active ? '#007acc' : '#f0f0f0',
      color: active ? 'white' : '#333',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      flex: 1,
      minWidth: '80px'
    });

    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Seleccionar Ubicación</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Módulo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['A', 'B', 'C'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setModulo(m);
                    setNivel(nivelesOrdenadosPorModulo[m as keyof typeof nivelesOrdenadosPorModulo][0]);
                  }}
                  style={buttonStyle(modulo === m)}
                >
                  Módulo {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Nivel:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {nivelesDisponibles.map((n) => (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  style={buttonStyle(nivel === n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Tipo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['INTERIOR', 'EXTERIOR', 'ESCALERA'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  style={buttonStyle(tipo === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h2>🛠️ Inspección por Excepciones</h2>

      <SelectorUbicacion />

      {/* Selector de categoría */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Categoría:</label>
        <select 
          value={categoria} 
          onChange={(e) => {
            setCategoria(e.target.value);
            setSubelemento('');
          }}
          style={{ 
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">-- Seleccionar --</option>
          {Object.keys(mockCategorias).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Selector de subelemento */}
      {categoria && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subelemento:</label>
          <select 
            value={subelemento} 
            onChange={(e) => setSubelemento(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">-- Seleccionar --</option>
            {mockCategorias[categoria].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Selector de estado */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estado:</label>
        <select 
          value={estado} 
          onChange={(e) => setEstado(e.target.value)}
          style={{ 
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">-- Seleccionar --</option>
          {estados.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>
      </div>

      {/* Observaciones */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Observación:</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          rows={3}
          style={{ 
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Cargar imágenes */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Imágenes:</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImagenes}
          style={{ 
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
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

      {/* Lista de ambientes seleccionados */}
      {ambientesSeleccionados.length > 0 && (
        <div style={{ 
          marginBottom: '1rem',
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #e0e0e0'
        }}>
          <strong>Ambientes incluidos:</strong>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            {ambientesSeleccionados.map((a) => (
              <div
                key={a.codigo}
                style={{
                  backgroundColor: '#e3f2fd',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                <span>{a.codigo} - {a.nombre}</span>
                <button
                  onClick={() => eliminarAmbiente(a.codigo)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    padding: '0 0.2rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón aplicar */}
      <button
        onClick={aplicar}
        style={{ 
          marginTop: '1rem', 
          padding: '0.8rem 2rem', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          width: '100%',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        ✅ Aplicar inspección
      </button>
    </div>
  );
};

export default InspeccionExcepciones;
