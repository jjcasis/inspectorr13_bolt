import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useDataStore from '../../store/tempDataStore';

interface CrearInformeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const nivelesOrdenadosPorModulo = {
  A: ['-100', '000', '100', '200', '300'],
  B: ['000', '100', '200', 'TECHO'],
  C: ['-100', '000', '100', '200', '300']
};

const CrearInformeModal: React.FC<CrearInformeModalProps> = ({ isOpen, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');
  const { crearNuevoInformeCaptura } = useDataStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tituloGenerado = `Inspección ${modulo}-${nivel} (${tipo})`;
    const tituloFinal = titulo.trim() || tituloGenerado;
    
    const nuevoInforme = {
      id: uuidv4(),
      titulo: tituloFinal,
      fecha: new Date().toISOString().slice(0, 10),
      items: []
    };

    crearNuevoInformeCaptura(nuevoInforme);
    setTitulo('');
    onClose();
  };

  const nivelesDisponibles = nivelesOrdenadosPorModulo[modulo as keyof typeof nivelesOrdenadosPorModulo];

  // Asegurarse de que el nivel seleccionado existe para el módulo actual
  if (!nivelesDisponibles.includes(nivel)) {
    setNivel(nivelesDisponibles[0]);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h2 style={{ marginTop: 0 }}>Crear Nuevo Informe</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Selector de Módulo */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Módulo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['A', 'B', 'C'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModulo(m)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: modulo === m ? '#007acc' : 'white',
                    color: modulo === m ? 'white' : 'black',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Módulo {m}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Nivel */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Nivel:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {nivelesDisponibles.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNivel(n)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: nivel === n ? '#007acc' : 'white',
                    color: nivel === n ? 'white' : 'black',
                    cursor: 'pointer',
                    minWidth: '80px'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Tipo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Tipo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['INTERIOR', 'EXTERIOR', 'ESCALERA'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: tipo === t ? '#007acc' : 'white',
                    color: tipo === t ? 'white' : 'black',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Título personalizado (opcional) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Título personalizado (opcional):
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              placeholder={`Inspección ${modulo}-${nivel} (${tipo})`}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Crear Informe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearInformeModal;
