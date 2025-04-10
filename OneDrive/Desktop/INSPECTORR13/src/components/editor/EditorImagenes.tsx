import React, { useRef } from 'react';
import useDataStore from '../../store/tempDataStore';
import ImageUploader from '../common/ImageUploader';

interface Props {
  ambienteId: string;
}

const EditorImagenes: React.FC<Props> = ({ ambienteId }) => {
  const { informesPorAmbiente, setImagenes } = useDataStore();
  const informe = informesPorAmbiente?.[ambienteId] || {};
  const imagenes = informe.imagenes || [];

  const handleImageCaptured = (imageData: { src: string; etiqueta: string }) => {
    setImagenes(ambienteId, [...imagenes, imageData]);
  };

  const actualizarEtiqueta = (index: number, etiqueta: string) => {
    const copia = [...imagenes];
    copia[index].etiqueta = etiqueta;
    setImagenes(ambienteId, copia);
  };

  const eliminarImagen = (index: number) => {
    const copia = imagenes.filter((_, i) => i !== index);
    setImagenes(ambienteId, copia);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Imágenes</h4>
      
      <ImageUploader
        onImageCaptured={handleImageCaptured}
        allowMultiple={true}
        showPreview={false}
        style={{ marginBottom: '1rem' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {imagenes.map((img: any, idx: number) => (
          <div key={idx} style={{ width: '140px', textAlign: 'center' }}>
            <img
              src={img.src}
              alt={`img-${idx}`}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="text"
              value={img.etiqueta || ''}
              placeholder="Etiqueta"
              onChange={(e) => actualizarEtiqueta(idx, e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem', padding: '0.3rem', fontSize: '0.8rem' }}
            />
            <button
              onClick={() => eliminarImagen(idx)}
              style={{
                marginTop: '0.3rem',
                background: '#ffdddd',
                border: '1px solid #f44336',
                color: '#a00',
                fontSize: '0.8rem',
                padding: '0.3rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorImagenes;
