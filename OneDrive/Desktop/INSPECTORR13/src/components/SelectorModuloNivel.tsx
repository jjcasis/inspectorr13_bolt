import React from 'react';
import dataJson from '../data/ambientes_proyecto_modificado.json';
import useDataStore from '../store/tempDataStore';
import { IconCalendar } from '@tabler/icons-react';

const escalerasPorModulo = {
  A: ['Escalera A4', 'Escalera A3', 'Escalera A2', 'Escalera A1'],
  B: ['Escalera B1', 'Escalera B2', 'Escalera B3'],
  C: ['Escalera C5', 'Escalera C4', 'Escalera C3', 'Escalera C2', 'Escalera C1']
};

const exterioresFijos = [
  'Aceras',
  'Jardinería',
  'Calle / Pavimentos',
  'Cordones',
  'Plaza Central',
  'Estacionamientos',
  'Señalización Vial',
  'Pintura Exterior',
  'Rampas'
];

const nivelesOrdenadosPorModulo = {
  A: ['-100', '000', '100', '200', '300'],
  B: ['000', '100', '200', 'TECHO'],
  C: ['-100', '000', '100', '200', '300']
};

const normalizarNivel = (n: string) =>
  n === '-100' ? '-1'
    : n === '000' ? '0'
    : n === '100' ? '1'
    : n === '200' ? '2'
    : n === '300' ? '3'
    : n === 'TECHO' ? 'T'
    : n;

const SelectorModuloNivel: React.FC = () => {
  const {
    modulo,
    nivel,
    tipo,
    ambienteSeleccionado,
    setModulo,
    setNivel,
    setTipo,
    setAmbienteSeleccionado
  } = useDataStore();

  const nivelesDisponibles = nivelesOrdenadosPorModulo[modulo as keyof typeof nivelesOrdenadosPorModulo];
  const prefijoEsperado = `${normalizarNivel(nivel)}-${modulo}`;

  const botonEstilo = (activo: boolean) => ({
    padding: '0.5rem 0.75rem',
    border: '1px solid #ccc',
    backgroundColor: activo ? '#007acc' : '#f0f0f0',
    color: activo ? 'white' : 'black',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '0.9rem',
    flex: '1',
    minWidth: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  let ambientesVisibles: { codigo: string; nombre: string }[] = [];

  if (tipo === 'INTERIOR' && dataJson?.modulos) {
    try {
      Object.entries(dataJson.modulos).forEach(([modKey, modData]) => {
        if (modData?.niveles) {
          Object.entries(modData.niveles).forEach(([nivelKey, ambientes]) => {
            if (Array.isArray(ambientes)) {
              ambientes.forEach((amb) => {
                const coincideModulo = modKey === modulo;
                const coincideNivel = nivelKey === nivel;
                const coincideCodigo = amb.codigo?.startsWith(prefijoEsperado);

                if (coincideModulo && coincideNivel && coincideCodigo) {
                  ambientesVisibles.push(amb);
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error processing modulos data:', error);
    }
  } else if (tipo === 'EXTERIOR') {
    ambientesVisibles = exterioresFijos.map((nombre, index) => ({
      codigo: `EXT-${modulo}-${nivel}-${index + 1}`,
      nombre
    }));
  } else if (tipo === 'ESCALERA') {
    ambientesVisibles = escalerasPorModulo[modulo as keyof typeof escalerasPorModulo].map((nombre, index) => ({
      codigo: `ESC-${modulo}-${index + 1}`,
      nombre
    }));
  }

  return (
    <div style={{ 
      marginBottom: '2rem',
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '1rem',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <IconCalendar size={18} />
        Seleccionar Ubicación
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <label style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold' 
          }}>
            Módulo:
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem'
        }}>
          {['A', 'B', 'C'].map((m) => (
            <button
              type="button"
              key={m}
              style={botonEstilo(modulo === m)}
              onClick={() => {
                setModulo(m);
                setNivel(nivelesOrdenadosPorModulo[m as keyof typeof nivelesOrdenadosPorModulo][0]);
                setAmbienteSeleccionado('');
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <label style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold' 
          }}>
            Nivel:
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem'
        }}>
          {nivelesDisponibles.map((niv) => (
            <button
              type="button"
              key={niv}
              style={botonEstilo(nivel === niv)}
              onClick={() => {
                setNivel(niv);
                setAmbienteSeleccionado('');
              }}
            >
              {niv}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <label style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold' 
          }}>
            Tipo:
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem'
        }}>
          {['INTERIOR', 'EXTERIOR', 'ESCALERA'].map((t) => (
            <button
              type="button"
              key={t}
              style={botonEstilo(tipo === t)}
              onClick={() => {
                setTipo(t);
                setAmbienteSeleccionado('');
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <label style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold' 
          }}>
            Ambiente:
          </label>
        </div>
        <select
          value={ambienteSeleccionado}
          onChange={(e) => setAmbienteSeleccionado(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '0.9rem'
          }}
        >
          <option value="">-- Seleccionar --</option>
          {ambientesVisibles.map((amb) => (
            <option key={amb.codigo} value={amb.codigo}>
              {amb.codigo}, {amb.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectorModuloNivel;
