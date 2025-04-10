// src/utils/ambientesUtils.ts

import dataJson from '../data/ambientes_proyecto_modificado.json';

export function getAmbientesDisponibles(modulo: string, nivel: string, tipo: string): { codigo: string; nombre: string }[] {
  const escalerasPorModulo = {
    A: ['Escalera A4', 'Escalera A3', 'Escalera A2', 'Escalera A1'],
    B: ['Escalera B1', 'Escalera B2', 'Escalera B3'],
    C: ['Escalera C5', 'Escalera C4', 'Escalera C3', 'Escalera C2', 'Escalera C1']
  };

  const exterioresFijos = [
    'Aceras', 'Jardinería', 'Calle / Pavimentos', 'Cordones', 'Plaza Central',
    'Estacionamientos', 'Señalización Vial', 'Pintura Exterior', 'Rampas'
  ];

  const normalizarNivel = (n: string) =>
    n === '-100' ? '-1'
      : n === '000' ? '0'
      : n === '100' ? '1'
      : n === '200' ? '2'
      : n === '300' ? '3'
      : n === 'TECHO' ? 'T'
      : n;

  const prefijoEsperado = `${normalizarNivel(nivel)}-${modulo}`;

  if (tipo === 'INTERIOR') {
    const niveles = dataJson.modulos?.[modulo]?.niveles || {};
    const ambientes = niveles[nivel] || [];
    return ambientes.filter((amb) => amb.codigo?.startsWith(prefijoEsperado));
  } else if (tipo === 'EXTERIOR') {
    return exterioresFijos.map((nombre, i) => ({
      codigo: `EXT-${modulo}-${nivel}-${i + 1}`,
      nombre
    }));
  } else if (tipo === 'ESCALERA') {
    return escalerasPorModulo[modulo]?.map((nombre, i) => ({
      codigo: `ESC-${modulo}-${nivel}-${i + 1}`,
      nombre
    })) || [];
  }

  return [];
}
