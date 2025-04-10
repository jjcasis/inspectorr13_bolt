import React, { useEffect, useState } from 'react';
import { getAmbientesDisponibles } from '../../utils/ambientesUtils';

interface SelectorLiteExcepcionesProps {
  onAmbientesChange: (ambs: { codigo: string; nombre: string }[]) => void;
}

const SelectorLiteExcepciones: React.FC<SelectorLiteExcepcionesProps> = ({ onAmbientesChange }) => {
  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');
  const [ambientes, setAmbientes] = useState<{ codigo: string; nombre: string }[]>([]);

  useEffect(() => {
    const nuevos = getAmbientesDisponibles(modulo, nivel, tipo);
    setAmbientes(nuevos);
    onAmbientesChange(nuevos);
  }, [modulo, nivel, tipo]);

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <label>Módulo:</label>
        <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div>
        <label>Nivel:</label>
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="-100">-100</option>
          <option value="000">000</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="TECHO">TECHO</option>
        </select>
      </div>

      <div>
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="INTERIOR">INTERIOR</option>
          <option value="EXTERIOR">EXTERIOR</option>
          <option value="ESCALERA">ESCALERA</option>
        </select>
      </div>
    </div>
  );
};

export default SelectorLiteExcepciones;
