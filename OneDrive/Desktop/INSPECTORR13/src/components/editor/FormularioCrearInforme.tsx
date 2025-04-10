import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useDataStore from '../../store/tempDataStore';

const niveles = ['-100', '000', '100', '200', '300', 'TECHO', 'ESCALERA'];
const tipos = ['INTERIOR', 'EXTERIOR'];

const FormularioCrearInforme: React.FC = () => {
  const { crearNuevoInformeCaptura, informeCapturaActivoId, informesCapturaRapida } = useDataStore();

  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');

  const fechaHoy = new Date().toISOString().slice(0, 10);
  const tituloGenerado = `Informe ${modulo}-${nivel} (${tipo}) - ${fechaHoy}`;

  const crear = () => {
    const nuevoInforme = {
      id: uuidv4(),
      titulo: tituloGenerado,
      fecha: fechaHoy,
      items: []
    };
    crearNuevoInformeCaptura(nuevoInforme);
    alert('Informe creado y activado');
  };

  const activo = informesCapturaRapida.find(i => i.id === informeCapturaActivoId);

  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>🆕 Crear Nuevo Informe de Captura</h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <label>Módulo:</label>
          <select value={modulo} onChange={(e) => setModulo(e.target.value)} style={{ padding: '0.4rem' }}>
            {['A', 'B', 'C'].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label>Nivel:</label>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} style={{ padding: '0.4rem' }}>
            {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '0.4rem' }}>
            {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Título generado:</strong><br />
        <input value={tituloGenerado} readOnly style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f9f9f9' }} />
      </div>

      <button onClick={crear} style={{ padding: '0.5rem 1rem' }}>➕ Crear y Activar</button>

      {activo && (
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Informe activo:</strong> {activo.titulo}
        </p>
      )}
    </div>
  );
};

export default FormularioCrearInforme;
