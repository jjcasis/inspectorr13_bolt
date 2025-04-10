import React, { useRef, useState } from 'react';
import heic2any from 'heic2any';
import CanvasAnotador from './CanvasAnotador';
import { 
  IconCamera, 
  IconUpload, 
  IconPencil, 
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface ImageUploaderProps {
  onImageCaptured: (imageData: { src: string; etiqueta?: string }) => void;
  showPreview?: boolean;
  previewSize?: number;
  allowMultiple?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageCaptured,
  showPreview = true,
  previewSize = 150,
  allowMultiple = false,
  className,
  style
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDrawing, setShowDrawing] = useState(false);

  const processImage = async (file: File) => {
    try {
      let finalFile = file;

      // Convert HEIC to JPEG if needed
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          });
          finalFile = new File(
            [convertedBlob as Blob], 
            file.name.replace(/\.heic$/i, '.jpg'), 
            { type: 'image/jpeg' }
          );
        } catch (err) {
          console.warn('Error converting HEIC:', err);
          throw new Error('No se pudo convertir la imagen HEIC. Intenta con otro formato.');
        }
      }

      // Read the image file
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(finalFile);
      });

    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessing(true);

    try {
      for (const file of files) {
        const src = await processImage(file);
        setSelectedImage(src);
        if (!allowMultiple) break;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error procesando la imagen');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = undefined;
      fileInputRef.current.click();
    }
  };

  const handleDrawingSave = (dataUrl: string) => {
    onImageCaptured({ src: dataUrl, etiqueta: '' });
    setSelectedImage(null);
    setShowDrawing(false);
  };

  const handleCancelEdit = () => {
    setSelectedImage(null);
    setShowDrawing(false);
  };

  return (
    <div className={className} style={style}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic"
        onChange={handleFileSelect}
        multiple={allowMultiple}
        style={{ display: 'none' }}
      />

      {!showDrawing && selectedImage && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          alignItems: 'center'
        }}>
          <img 
            src={selectedImage} 
            alt="Preview" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '150px', 
              objectFit: 'contain',
              borderRadius: '4px'
            }} 
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onImageCaptured({ src: selectedImage })}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Usar imagen sin editar"
            >
              <IconCheck size={20} />
            </button>
            <button
              onClick={() => setShowDrawing(true)}
              style={{
                backgroundColor: '#007acc',
                color: 'white',
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Editar imagen"
            >
              <IconPencil size={20} />
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Cancelar"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>
      )}

      {!showDrawing && !selectedImage && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={handleCameraCapture}
            disabled={isProcessing}
            style={{
              padding: '0.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Tomar Foto"
          >
            <IconCamera size={20} />
          </button>
          <button
            onClick={handleFileUpload}
            disabled={isProcessing}
            style={{
              padding: '0.5rem',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Subir Imagen"
          >
            <IconUpload size={20} />
          </button>
        </div>
      )}

      {isProcessing && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '1rem'
        }}>
          Procesando imagen...
        </div>
      )}

      {showDrawing && selectedImage && (
        <CanvasAnotador
          imageUrl={selectedImage}
          onSave={handleDrawingSave}
          width={800}
          height={600}
        />
      )}

      {showPreview && !showDrawing && !selectedImage && (
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            width: previewSize,
            height: previewSize,
            border: '2px dashed #ccc',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Vista previa
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
