import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { 
  IconPencil, 
  IconSquare, 
  IconCircle, 
  IconArrowRight,
  IconArrowBack,
  IconArrowForward,
  IconTrash,
  IconCrop,
  IconDeviceFloppy,
  IconPalette,
  IconRuler,
  IconCheck
} from '@tabler/icons-react';

interface CanvasAnotadorProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  width?: number;
  height?: number;
}

const CanvasAnotador: React.FC<CanvasAnotadorProps> = ({
  imageUrl,
  onSave,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [drawingMode, setDrawingMode] = useState<'brush' | 'shape' | 'crop'>('brush');
  const [shapeType, setShapeType] = useState<'rect' | 'circle' | 'arrow'>('rect');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [cropActive, setCropActive] = useState(false);
  const cropRectRef = useRef<fabric.Rect | null>(null);
  const originalImageRef = useRef<fabric.Image | null>(null);

  // History management
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const updateHistory = () => {
    if (!fabricRef.current) return;

    const json = JSON.stringify(fabricRef.current.toJSON(['data']));
    
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }

    historyRef.current.push(json);
    historyIndexRef.current++;

    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const undo = () => {
    if (!fabricRef.current || historyIndexRef.current <= 0) return;
    
    historyIndexRef.current--;
    const json = historyRef.current[historyIndexRef.current];
    fabricRef.current.loadFromJSON(json, () => {
      fabricRef.current?.renderAll();
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    });
  };

  const redo = () => {
    if (!fabricRef.current || historyIndexRef.current >= historyRef.current.length - 1) return;
    
    historyIndexRef.current++;
    const json = historyRef.current[historyIndexRef.current];
    fabricRef.current.loadFromJSON(json, () => {
      fabricRef.current?.renderAll();
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  };

  // Initialize Fabric canvas
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }

    if (!canvasRef.current) return;

    fabric.Image.fromURL(imageUrl, (img) => {
      if (!canvasRef.current) return;

      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width,
        height
      });

      const canvas = fabricRef.current;

      // Store original image for cropping
      originalImageRef.current = img;

      const scale = Math.min(
        width / img.width!,
        height / img.height!
      );
      img.scale(scale);
      
      img.set({
        left: (width - img.width! * scale) / 2,
        top: (height - img.height! * scale) / 2,
        selectable: false,
        evented: false
      });

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

      const brush = new fabric.PencilBrush(canvas);
      brush.color = currentColor;
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;

      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('object:added', updateHistory);
      canvas.on('object:modified', updateHistory);
      canvas.on('object:removed', updateHistory);

      updateHistory();
    });

    return () => {
      if (fabricRef.current) {
        fabricRef.current.off('mouse:down', handleMouseDown);
        fabricRef.current.off('mouse:move', handleMouseMove);
        fabricRef.current.off('mouse:up', handleMouseUp);
        fabricRef.current.off('object:added', updateHistory);
        fabricRef.current.off('object:modified', updateHistory);
        fabricRef.current.off('object:removed', updateHistory);
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [imageUrl, width, height]);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    canvas.freeDrawingBrush.color = currentColor;
    canvas.freeDrawingBrush.width = brushSize;
  }, [currentColor, brushSize]);

  const handleMouseDown = (event: fabric.IEvent) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const pointer = canvas.getPointer(event.e);
    startPointRef.current = { x: pointer.x, y: pointer.y };

    if (drawingMode === 'crop' && !cropActive) {
      // Create crop rectangle
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'rgba(0,0,0,0.2)',
        stroke: '#007acc',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: true,
        cornerColor: '#007acc',
        cornerSize: 10,
        transparentCorners: false,
        hasRotatingPoint: false
      });
      
      cropRectRef.current = rect;
      canvas.add(rect);
      canvas.setActiveObject(rect);
      return;
    }

    if (drawingMode !== 'shape') return;

    let shape: fabric.Object;
    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: currentColor,
          strokeWidth: brushSize
        });
        break;

      case 'circle':
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: 'transparent',
          stroke: currentColor,
          strokeWidth: brushSize,
          originX: 'center',
          originY: 'center'
        });
        break;

      case 'arrow':
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        shape = new fabric.Line(points, {
          stroke: currentColor,
          strokeWidth: brushSize,
          selectable: true
        });
        break;

      default:
        return;
    }

    shapeRef.current = shape;
    canvas.add(shape);
    canvas.renderAll();
  };

  const handleMouseMove = (event: fabric.IEvent) => {
    if (!fabricRef.current || !startPointRef.current) return;
    const canvas = fabricRef.current;
    const pointer = canvas.getPointer(event.e);
    const startPoint = startPointRef.current;

    if (drawingMode === 'crop' && cropRectRef.current && !cropActive) {
      const width = Math.abs(pointer.x - startPoint.x);
      const height = Math.abs(pointer.y - startPoint.y);
      
      cropRectRef.current.set({
        width: width,
        height: height,
        left: Math.min(startPoint.x, pointer.x),
        top: Math.min(startPoint.y, pointer.y)
      });
      
      canvas.renderAll();
      return;
    }

    if (!shapeRef.current || drawingMode !== 'shape') return;
    
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);

    switch (shapeType) {
      case 'rect':
        const rect = shapeRef.current as fabric.Rect;
        rect.set({
          width: width,
          height: height,
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y)
        });
        break;

      case 'circle':
        const circle = shapeRef.current as fabric.Circle;
        const radius = Math.sqrt(width * width + height * height) / 2;
        circle.set({
          radius: radius
        });
        break;

      case 'arrow':
        const arrow = shapeRef.current as fabric.Line;
        arrow.set({
          x2: pointer.x,
          y2: pointer.y
        });

        const angle = Math.atan2(pointer.y - startPoint.y, pointer.x - startPoint.x);
        const headLength = 20;
        const x2 = pointer.x;
        const y2 = pointer.y;
        const x3 = x2 - headLength * Math.cos(angle - Math.PI / 6);
        const y3 = y2 - headLength * Math.sin(angle - Math.PI / 6);
        const x4 = x2 - headLength * Math.cos(angle + Math.PI / 6);
        const y4 = y2 - headLength * Math.sin(angle + Math.PI / 6);

        canvas.getObjects().forEach(obj => {
          if (obj.data?.isArrowhead && obj.data.parentId === arrow.data?.id) {
            canvas.remove(obj);
          }
        });

        const arrowhead = new fabric.Triangle({
          left: x2,
          top: y2,
          points: [
            { x: 0, y: 0 },
            { x: x3 - x2, y: y3 - y2 },
            { x: x4 - x2, y: y4 - y2 }
          ],
          fill: currentColor,
          selectable: false,
          data: { isArrowhead: true, parentId: arrow.data?.id }
        });

        canvas.add(arrowhead);
        break;
    }

    canvas.renderAll();
  };

  const handleMouseUp = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (drawingMode === 'crop' && cropRectRef.current && !cropActive) {
      // Make sure the crop rectangle is at least 50x50 pixels
      if (cropRectRef.current.width! < 50 || cropRectRef.current.height! < 50) {
        canvas.remove(cropRectRef.current);
        cropRectRef.current = null;
        return;
      }
      
      // Make the crop rectangle a perfect square
      const size = Math.max(cropRectRef.current.width!, cropRectRef.current.height!);
      cropRectRef.current.set({
        width: size,
        height: size
      });
      
      setCropActive(true);
      canvas.renderAll();
      return;
    }

    if (drawingMode !== 'shape' || !shapeRef.current) return;

    const shape = shapeRef.current;
    if (shapeType === 'rect') {
      const rect = shape as fabric.Rect;
      const width = rect.width || 0;
      const height = rect.height || 0;

      if (Math.abs(width - height) / Math.max(width, height) < 0.2) {
        const size = Math.max(width, height);
        rect.set({
          width: size,
          height: size
        });
      }

      const angle = Math.atan2(height, width) * 180 / Math.PI;
      if (Math.abs(angle) < 10 || Math.abs(angle - 90) < 10) {
        rect.set({
          width: Math.abs(width),
          height: Math.abs(height)
        });
      }
    } else if (shapeType === 'arrow') {
      const arrow = shape as fabric.Line;
      const dx = arrow.x2! - arrow.x1!;
      const dy = arrow.y2! - arrow.y1!;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      const snapAngles = [0, 45, 90, 135, 180, -135, -90, -45];
      const closestAngle = snapAngles.reduce((prev, curr) => {
        return Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev;
      });

      if (Math.abs(closestAngle - angle) < 15) {
        const length = Math.sqrt(dx * dx + dy * dy);
        const x2 = arrow.x1! + length * Math.cos(closestAngle * Math.PI / 180);
        const y2 = arrow.y1! + length * Math.sin(closestAngle * Math.PI / 180);
        
        arrow.set({
          x2: x2,
          y2: y2
        });

        canvas.getObjects().forEach(obj => {
          if (obj.data?.isArrowhead && obj.data.parentId === arrow.data?.id) {
            canvas.remove(obj);
          }
        });

        const headLength = 20;
        const x3 = x2 - headLength * Math.cos((closestAngle - 30) * Math.PI / 180);
        const y3 = y2 - headLength * Math.sin((closestAngle - 30) * Math.PI / 180);
        const x4 = x2 - headLength * Math.cos((closestAngle + 30) * Math.PI / 180);
        const y4 = y2 - headLength * Math.sin((closestAngle + 30) * Math.PI / 180);

        const arrowhead = new fabric.Triangle({
          left: x2,
          top: y2,
          points: [
            { x: 0, y: 0 },
            { x: x3 - x2, y: y3 - y2 },
            { x: x4 - x2, y: y4 - y2 }
          ],
          fill: currentColor,
          selectable: false,
          data: { isArrowhead: true, parentId: arrow.data?.id }
        });

        canvas.add(arrowhead);
      }
    }

    canvas.renderAll();
    updateHistory();

    shapeRef.current = null;
    startPointRef.current = null;
  };

  const applyCrop = () => {
    if (!fabricRef.current || !cropRectRef.current || !originalImageRef.current) return;
    const canvas = fabricRef.current;
    
    const cropRect = cropRectRef.current;
    const bgImage = canvas.backgroundImage as fabric.Image;
    
    if (!bgImage) return;
    
    // Get the current scale of the background image
    const imgElement = bgImage.getElement() as HTMLImageElement;
    const imgWidth = imgElement.width;
    const imgHeight = imgElement.height;
    
    // Calculate the crop coordinates in the original image space
    const scaleX = imgWidth / (bgImage.width! * bgImage.scaleX!);
    const scaleY = imgHeight / (bgImage.height! * bgImage.scaleY!);
    
    const cropX = (cropRect.left! - bgImage.left!) * scaleX;
    const cropY = (cropRect.top! - bgImage.top!) * scaleY;
    const cropWidth = cropRect.width! * scaleX;
    const cropHeight = cropRect.height! * scaleY;
    
    // Create a temporary canvas to crop the image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) return;
    
    // Draw the cropped portion of the image
    ctx.drawImage(
      imgElement,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );
    
    // Create a new image from the cropped canvas
    fabric.Image.fromURL(tempCanvas.toDataURL(), (croppedImg) => {
      // Clear the canvas
      canvas.clear();
      
      // Scale the cropped image to fit the canvas
      const scale = Math.min(
        width / croppedImg.width!,
        height / croppedImg.height!
      );
      croppedImg.scale(scale);
      
      // Center the cropped image
      croppedImg.set({
        left: (width - croppedImg.width! * scale) / 2,
        top: (height - croppedImg.height! * scale) / 2,
        selectable: false,
        evented: false
      });
      
      // Set the cropped image as the new background
      canvas.setBackgroundImage(croppedImg, canvas.renderAll.bind(canvas));
      
      // Reset crop mode
      setCropActive(false);
      cropRectRef.current = null;
      
      // Update history
      updateHistory();
    });
  };

  const cancelCrop = () => {
    if (!fabricRef.current || !cropRectRef.current) return;
    
    fabricRef.current.remove(cropRectRef.current);
    cropRectRef.current = null;
    setCropActive(false);
    fabricRef.current.renderAll();
  };

  const handleSave = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    onSave(dataUrl);
  };

  const handleClear = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const backgroundImage = canvas.backgroundImage;
    canvas.clear();
    if (backgroundImage) {
      canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas));
    }
    updateHistory();
  };

  const activateCropMode = () => {
    if (!fabricRef.current) return;
    
    // If already in crop mode with an active crop rectangle, apply the crop
    if (drawingMode === 'crop' && cropActive && cropRectRef.current) {
      applyCrop();
      return;
    }
    
    // If already in crop mode but no active crop, cancel it
    if (drawingMode === 'crop' && !cropActive) {
      setDrawingMode('brush');
      if (fabricRef.current) {
        fabricRef.current.isDrawingMode = true;
      }
      return;
    }
    
    // Enter crop mode
    setDrawingMode('crop');
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
      
      // Remove any existing crop rectangle
      if (cropRectRef.current) {
        fabricRef.current.remove(cropRectRef.current);
        cropRectRef.current = null;
      }
      
      setCropActive(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      backgroundColor: '#f5f5f5',
      padding: '1rem',
      borderRadius: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={() => {
            if (cropActive) return; // Don't allow mode change during active crop
            setDrawingMode('brush');
            if (fabricRef.current) {
              fabricRef.current.isDrawingMode = true;
            }
          }}
          style={{
            backgroundColor: drawingMode === 'brush' ? '#007acc' : '#fff',
            color: drawingMode === 'brush' ? '#fff' : '#000',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: cropActive ? 'not-allowed' : 'pointer',
            opacity: cropActive ? 0.5 : 1
          }}
          title="Dibujo Libre"
          disabled={cropActive}
        >
          <IconPencil size={20} />
        </button>

        <button
          onClick={() => {
            if (cropActive) return; // Don't allow mode change during active crop
            setDrawingMode('shape');
            setShapeType('rect');
            if (fabricRef.current) {
              fabricRef.current.isDrawingMode = false;
            }
          }}
          style={{
            backgroundColor: drawingMode === 'shape' && shapeType === 'rect' ? '#007acc' : '#fff',
            color: drawingMode === 'shape' && shapeType === 'rect' ? '#fff' : '#000',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: cropActive ? 'not-allowed' : 'pointer',
            opacity: cropActive ? 0.5 : 1
          }}
          title="Rectángulo"
          disabled={cropActive}
        >
          <IconSquare size={20} />
        </button>

        <button
          onClick={() => {
            if (cropActive) return; // Don't allow mode change during active crop
            setDrawingMode('shape');
            setShapeType('circle');
            if (fabricRef.current) {
              fabricRef.current.isDrawingMode = false;
            }
          }}
          style={{
            backgroundColor: drawingMode === 'shape' && shapeType === 'circle' ? '#007acc' : '#fff',
            color: drawingMode === 'shape' && shapeType === 'circle' ? '#fff' : '#000',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: cropActive ? 'not-allowed' : 'pointer',
            opacity: cropActive ? 0.5 : 1
          }}
          title="Círculo"
          disabled={cropActive}
        >
          <IconCircle size={20} />
        </button>

        <button
          onClick={() => {
            if (cropActive) return; // Don't allow mode change during active crop
            setDrawingMode('shape');
            setShapeType('arrow');
            if (fabricRef.current) {
              fabricRef.current.isDrawingMode = false;
            }
          }}
          style={{
            backgroundColor: drawingMode === 'shape' && shapeType === 'arrow' ? '#007acc' : '#fff',
            color: drawingMode === 'shape' && shapeType === 'arrow' ? '#fff' : '#000',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: cropActive ? 'not-allowed' : 'pointer',
            opacity: cropActive ? 0.5 : 1
          }}
          title="Flecha"
          disabled={cropActive}
        >
          <IconArrowRight size={20} />
        </button>

        <button
          onClick={activateCropMode}
          style={{
            backgroundColor: drawingMode === 'crop' ? '#007acc' : '#fff',
            color: drawingMode === 'crop' ? '#fff' : '#000',
            padding: '0.5rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title={cropActive ? "Aplicar recorte" : "Recortar imagen"}
        >
          <IconCrop size={20} />
        </button>

        {!cropActive && (
          <>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              style={{ 
                width: '40px', 
                height: '40px',
                padding: '0',
                border: 'none'
              }}
              title="Color"
              disabled={drawingMode === 'crop'}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconRuler size={20} />
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                style={{ width: '100px' }}
                title="Tamaño"
                disabled={drawingMode === 'crop'}
              />
            </div>

            <button
              onClick={undo}
              disabled={!canUndo || cropActive}
              style={{
                backgroundColor: canUndo && !cropActive ? '#007acc' : '#ccc',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '4px',
                opacity: canUndo && !cropActive ? 1 : 0.5,
                cursor: canUndo && !cropActive ? 'pointer' : 'not-allowed'
              }}
              title="Deshacer"
            >
              <IconArrowBack size={20} />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo || cropActive}
              style={{
                backgroundColor: canRedo && !cropActive ? '#007acc' : '#ccc',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '4px',
                opacity: canRedo && !cropActive ? 1 : 0.5,
                cursor: canRedo && !cropActive ? 'pointer' : 'not-allowed'
              }}
              title="Rehacer"
            >
              <IconArrowForward size={20} />
            </button>

            <button
              onClick={handleClear}
              disabled={cropActive}
              style={{
                backgroundColor: cropActive ? '#ccc' : '#dc3545',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '4px',
                opacity: cropActive ? 0.5 : 1,
                cursor: cropActive ? 'not-allowed' : 'pointer'
              }}
              title="Limpiar"
            >
              <IconTrash size={20} />
            </button>
          </>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {cropActive && (
            <>
              <button
                onClick={cancelCrop}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title="Cancelar recorte"
              >
                <IconTrash size={20} />
              </button>
              <button
                onClick={applyCrop}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title="Aplicar recorte"
              >
                <IconCheck size={20} />
              </button>
            </>
          )}

          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: cropActive ? 'not-allowed' : 'pointer',
              opacity: cropActive ? 0.5 : 1
            }}
            title="Guardar"
            disabled={cropActive}
          >
            <IconDeviceFloppy size={20} />
          </button>
        </div>
      </div>

      <div style={{ 
        position: 'relative',
        width: width,
        height: height,
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} />
        
        {cropActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}>
            <div style={{
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(0,0,0,0.7)'
            }}>
              Ajusta el recuadro para encuadrar la imagen
            </div>
          </div>
        )}
      </div>
      
      {cropActive && (
        <div style={{
          backgroundColor: '#f0f7ff',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #007acc',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, textAlign: 'center' }}>
            <strong>Modo Recorte:</strong> Ajusta el recuadro para encuadrar la imagen en formato cuadrado.
            Cuando termines, haz clic en el botón de verificación para aplicar el recorte.
          </p>
        </div>
      )}
    </div>
  );
};

export default CanvasAnotador;
