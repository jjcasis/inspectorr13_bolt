import React, { useEffect, useState } from 'react';
import { getAmbientesDisponibles } from '../../utils/ambientesUtils';

interface SelectorLiteElementosProps {
  modulo: string;
  nivel: string;
  tipo: string;
  onAmbientesChange: (ambs: { codigo: string; nombre: string }[]) => void;
}

const SelectorLiteElementos: React.FC<SelectorLiteElementosProps> = ({ 
  modulo, 
  nivel, 
  tipo,
  onAmbientesChange 
}) => {
  useEffect(() => {
    const nuevos = getAmbientesDisponibles(modulo, nivel, tipo);
    onAmbientesChange(nuevos);
  }, [modulo, nivel, tipo, onAmbientesChange]);

  return null; // This component doesn't render anything, it just manages state
};

export default SelectorLiteElementos;
