import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/tempDataStore';
import { getAmbientesDisponibles } from '../../utils/ambientesUtils';
import CrearInformeModal from './CrearInformeModal';
import ImageUploader from '../common/ImageUploader';
import { IconTrash, IconArrowUp, IconArrowDown, IconCopy, IconEye, IconPlus } from '@tabler/icons-react';

const mockCategorias = {
  'PAREDES': ['Bloqueo', 'Repello', 'Pintura'],
  'VENTANA': ['Marco', 'Vidrio', 'Sello'],
  'CIELORRASO': ['Estructura ángulo', 'Estructura Retícula', 'Láminas'],
};

const estados = ['✔️ Conforme', '✖️ No Conforme', '⚠️ Parcial'];

const CapturaRapida: React.FC = () => {
  const navigate = useNavigate();
  const [imagen, setImagen] = useState<any>(null);
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [comentario, setComentario] = useState('');
  const [ambiente, setAmbiente] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subelemento, setSubelemento] = useState('');
  const [estado, setEstado] = useState('');
  const [modulo, setModulo] = useState('A');
  const [nivel, setNivel] = useState('000');
  const [tipo, setTipo] = useState('INTERIOR');
  const [showModal, setShowModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const {
    setImagenes: setStoreImagenes,
    setComentarios,
    setEstadoInforme,
    guardarItemEnInformeActivo,
    informeCapturaActivoId,
    informesCapturaRapida,
    guardarInformeCaptura
  } = useDataStore();

  const ambientesDisponibles = getAmbientesDisponibles(modulo, nivel, tipo);
  const informeActivo = informesCapturaRapida.find(i => i.id === informeCapturaActivoId);

  const handleImageCaptured = (imageData: { src: string; etiqueta: string }) => {
    setImagenes([...imagenes, imageData]);
  };

  const removeImage = (index: number) => {
    const newImagenes = [...imagenes];
    newImagenes.splice(index, 1);
    setImagenes(newImagenes);
  };

  const toggleItemExpanded = (idx: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const guardarItem = () => {
    if (!informeActivo) {
      setShowModal(true);
      return;
    }

    setValidationErrors({});
    const errors: Record<string, string> = {};

    if (imagenes.length === 0) errors.imagen = 'Debes tomar o seleccionar al menos una imagen';
    if (!ambiente) errors.ambiente = 'Selecciona un ambiente';
    if (!categoria) errors.categoria = 'Selecciona una categoría';
    if (!subelemento) errors.subelemento = 'Selecciona un subelemento';
    if (!estado) errors.estado = 'Selecciona un estado';
    if (!comentario.trim()) errors.comentario = 'Ingresa un comentario';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const nuevoItem = {
      imagen: imagenes[0], // Mantener compatibilidad con el primer elemento
      imagenes: imagenes,
      comentario,
      categoria,
      subelemento,
      estado,
      modulo,
      nivel,
      tipo,
      ambiente,
    };

    guardarItemEnInformeActivo(nuevoItem);
    setStoreImagenes(ambiente, imagenes);
    setComentarios(ambiente, comentario);
    setEstadoInforme(ambiente, categoria, subelemento, estado);

    setImagen(null);
    setImagenes([]);
    setComentario('');
    setCategoria('');
    setSubelemento('');
    setEstado('');
    setValidationErrors({});
  };

  const subirItem = (idx: number) => {
    if (!informeActivo || idx === 0) return;
    const items = [...informeActivo.items];
    [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
    guardarInformeCaptura({ ...informeActivo, items });
  };

  const bajarItem = (idx: number) => {
    if (!informeActivo || idx === informeActivo.items.length - 1) return;
    const items = [...informeActivo.items];
    [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]];
    guardarInformeCaptura({ ...informeActivo, items });
  };

  const eliminarItem = (idx: number) => {
    if (!informeActivo) return;
    if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      const items = informeActivo.items.filter((_, i) => i !== idx);
      guardarInformeCaptura({ ...informeActivo, items });
    }
  };

  const clonarItem = (idx: number) => {
    if (!informeActivo) return;
    const items = [...informeActivo.items];
    const itemClonado = { ...items[idx] };
    items.splice(idx + 1, 0, itemClonado);
    guardarInformeCaptura({ ...informeActivo, items });
  };

  const renderButtonGroup = (label: string, options: string[], value: string, onChange: (v: string) => void) => (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}:</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
        {options.map((opt) => (
          <button
            key={`${label}-${opt}-${value === opt ? 'selected' : 'unselected'}`}
            onClick={() => onChange(opt)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: value === opt ? '#007acc' : '#fff',
              color: value === opt ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  if (!informeActivo) {
    return (
      <div style={{ padding: '1rem', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2>📷 Captura Rápida</h2>
        
        <div style={{ 
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>
            Para comenzar a capturar elementos, primero debes crear un nuevo informe.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <IconPlus size={20} style={{ marginRight: '0.5rem' }} /> Crear Nuevo Informe
          </button>
        </div>

        <CrearInformeModal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            navigate('/excepciones');
          }} 
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f7ff',
        borderRadius: '8px',
        border: '1px solid #007acc'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>📷 Captura Rápida</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            Informe activo: {informeActivo.titulo}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/excepciones')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <IconPlus size={18} /> Nuevo Informe
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Imágenes</h3>
        <ImageUploader
          onImageCaptured={handleImageCaptured}
          showPreview={true}
          previewSize={200}
        />
        
        {imagenes.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '0.75rem' 
            }}>
              {imagenes.map((img, index) => (
                <div 
                  key={index} 
                  style={{ 
                    position: 'relative',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={img.src} 
                    alt={`Imagen ${index + 1}`} 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                  <button
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(220, 53, 69, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {validationErrors.imagen && (
          <p style={{ color: '#dc3545', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {validationErrors.imagen}
          </p>
        )}
      </div>

      <div>
        {renderButtonGroup('Módulo', ['A', 'B', 'C'], modulo, setModulo)}
        {renderButtonGroup('Nivel', ['-100', '000', '100', '200', '300', 'TECHO'], nivel, setNivel)}
        {renderButtonGroup('Tipo', ['INTERIOR', 'EXTERIOR', 'ESCALERA'], tipo, setTipo)}

        <div>
          <label>Ambiente destino:</label>
          <select 
            value={ambiente} 
            onChange={(e) => setAmbiente(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              marginBottom: '0.5rem',
              border: validationErrors.ambiente ? '1px solid #dc3545' : '1px solid #ccc'
            }}
          >
            <option value="">-- Seleccionar --</option>
            {ambientesDisponibles.map((a) => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.nombre}</option>
            ))}
          </select>
          {validationErrors.ambiente && (
            <p style={{ color: '#dc3545', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
              {validationErrors.ambiente}
            </p>
          )}
        </div>

        <div style={{ marginBottom: validationErrors.categoria ? '0.5rem' : '1rem' }}>
          {renderButtonGroup('Categoría', Object.keys(mockCategorias), categoria, (val) => {
            setCategoria(val);
            setSubelemento('');
          })}
          {validationErrors.categoria && (
            <p style={{ color: '#dc3545', margin: '0', fontSize: '0.9rem' }}>
              {validationErrors.categoria}
            </p>
          )}
        </div>

        {categoria && (
          <div style={{ marginBottom: validationErrors.subelemento ? '0.5rem' : '1rem' }}>
            {renderButtonGroup('Subelemento', mockCategorias[categoria], subelemento, setSubelemento)}
            {validationErrors.subelemento && (
              <p style={{ color: '#dc3545', margin: '0', fontSize: '0.9rem' }}>
                {validationErrors.subelemento}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: validationErrors.estado ? '0.5rem' : '1rem' }}>
          {renderButtonGroup('Estado', estados, estado, setEstado)}
          {validationErrors.estado && (
            <p style={{ color: '#dc3545', margin: '0', fontSize: '0.9rem' }}>
              {validationErrors.estado}
            </p>
          )}
        </div>

        <div>
          <label>Comentario:</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            style={{ 
              width: '100%',
              border: validationErrors.comentario ? '1px solid #dc3545' : '1px solid #ccc',
              marginBottom: validationErrors.comentario ? '0.5rem' : '1rem'
            }}
          />
          {validationErrors.comentario && (
            <p style={{ color: '#dc3545', margin: '0', fontSize: '0.9rem' }}>
              {validationErrors.comentario}
            </p>
          )}
        </div>

        <button
          onClick={guardarItem}
          style={{ 
            marginTop: '1rem', 
            padding: '0.8rem 2rem', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <IconPlus size={20} /> Guardar en informe
        </button>
      </div>

      {informeActivo?.items?.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>🧾 Elementos del informe actual</h3>
          {informeActivo.items.map((item, idx) => (
            <div 
              key={`${informeActivo.id}-item-${idx}`}
              style={{ 
                marginBottom: '1rem', 
                border: '1px solid #ccc', 
                borderRadius: 8,
                backgroundColor: '#fff',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => toggleItemExpanded(idx)}
              >
                <div>
                  <strong>{item.categoria}</strong> / {item.subelemento}
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {item.modulo}-{item.nivel} ({item.tipo}) | {item.ambiente}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.imagenes && item.imagenes.length > 1 && (
                    <span style={{ 
                      backgroundColor: '#007acc', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: '0.5rem',
                      fontSize: '0.8rem'
                    }}>
                      {item.imagenes.length}
                    </span>
                  )}
                  <button 
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer'
                    }}
                  >
                    {expandedItems[idx] ? '🔽' : '▶️'}
                  </button>
                </div>
              </div>

              {expandedItems[idx] && (
                <div style={{ 
                  padding: '1rem'
                }}>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    {(item.imagenes || [item.imagen]).map((img, imgIdx) => (
                      <img 
                        key={imgIdx}
                        src={img.src} 
                        alt={`Imagen ${imgIdx + 1}`} 
                        style={{ 
                          width: '100%', 
                          aspectRatio: '1/1',
                          objectFit: 'cover', 
                          borderRadius: 4,
                          border: '1px solid #eee'
                        }} 
                      />
                    ))}
                  </div>
                  
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
                    {item.comentario}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem',
                    justifyContent: 'flex-end'
                  }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        subirItem(idx);
                      }}
                      title="Subir"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconArrowUp size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        bajarItem(idx);
                      }}
                      title="Bajar"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconArrowDown size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clonarItem(idx);
                      }}
                      title="Clonar"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconCopy size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      title="Vista Previa"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconEye size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarItem(idx);
                      }}
                      title="Eliminar"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        color: '#ff4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CrearInformeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {previewItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>Vista Previa del Elemento</h2>
              <button
                onClick={() => setPreviewItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {(previewItem.imagenes || [previewItem.imagen]).map((img, imgIdx) => (
                <img
                  key={imgIdx}
                  src={img.src}
                  alt={`Inspección ${imgIdx + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <p><strong>Fecha:</strong> {informeActivo.fecha}</p>
              <p><strong>Ubicación:</strong> {previewItem.modulo}-{previewItem.nivel} ({previewItem.tipo})</p>
              <p><strong>Ambiente:</strong> {previewItem.ambiente}</p>
              <p><strong>Categoría:</strong> {previewItem.categoria} / {previewItem.subelemento}</p>
              <p><strong>Estado:</strong> {previewItem.estado}</p>
              <p><strong>Comentario:</strong> {previewItem.comentario}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapturaRapida;
