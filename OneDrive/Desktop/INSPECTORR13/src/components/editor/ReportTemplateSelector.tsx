import React, { useState } from 'react';
import useDataStore from '../../store/tempDataStore';
import exportadorPDF from './exportadorPDF';
import exportarDOCX from './exportadorDOCX';

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  layout: 'single' | 'grid' | 'mixed' | 'side';
  format: 'pdf' | 'docx';
  style: {
    columns: number;
    imageSize: 'small' | 'medium' | 'large';
    showText: boolean;
    textPosition: 'below' | 'side';
    gridLayout?: number[];
    pageSize?: {
      width: number;
      height: number;
    };
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}

interface Props {
  informe: any;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: 'side-by-side',
    name: 'Foto y Datos',
    description: 'Imagen mediana con información al lado',
    preview: '📑',
    layout: 'side',
    format: 'pdf',
    style: {
      columns: 2,
      imageSize: 'medium',
      showText: true,
      textPosition: 'side',
      pageSize: {
        width: 8.5,
        height: 11
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  },
  {
    id: 'single-column',
    name: 'Informe Detallado',
    description: 'Una columna con imágenes grandes y texto',
    preview: '📄',
    layout: 'single',
    format: 'pdf',
    style: {
      columns: 1,
      imageSize: 'large',
      showText: true,
      textPosition: 'below',
      pageSize: {
        width: 8.5,
        height: 11
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  },
  {
    id: 'grid-4x4',
    name: 'Cuadrícula 4x4',
    description: 'Vista en cuadrícula de 16 imágenes',
    preview: '📊',
    layout: 'grid',
    format: 'pdf',
    style: {
      columns: 4,
      imageSize: 'small',
      showText: false,
      textPosition: 'below',
      gridLayout: [4, 4],
      pageSize: {
        width: 11,
        height: 8.5
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  },
  {
    id: 'grid-comments',
    name: 'Grilla con Comentarios',
    description: 'Cuatro imágenes con datos a la derecha',
    preview: '🖼️',
    layout: 'grid',
    format: 'pdf',
    style: {
      columns: 2,
      imageSize: 'medium',
      showText: true,
      textPosition: 'side',
      gridLayout: [2, 2],
      pageSize: {
        width: 8.5,
        height: 11
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  },
  {
    id: 'mixed-layout',
    name: 'Diseño Mixto',
    description: 'Imágenes grandes y pequeñas con texto',
    preview: '📑',
    layout: 'mixed',
    format: 'pdf',
    style: {
      columns: 2,
      imageSize: 'medium',
      showText: true,
      textPosition: 'side',
      pageSize: {
        width: 8.5,
        height: 11
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  },
  {
    id: 'docx-single',
    name: 'Documento Word',
    description: 'Exportar como documento de Word',
    preview: '📝',
    layout: 'single',
    format: 'docx',
    style: {
      columns: 1,
      imageSize: 'medium',
      showText: true,
      textPosition: 'below',
      pageSize: {
        width: 8.5,
        height: 11
      },
      margins: {
        top: 0.75,
        right: 0.75,
        bottom: 0.75,
        left: 0.75
      }
    }
  }
];

const ReportTemplateSelector: React.FC<Props> = ({ informe, onClose }) => {
  const { configuracion } = useDataStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customSettings, setCustomSettings] = useState({
    showHeader: true,
    showFooter: true,
    includeDate: true,
    includeLogo: true,
    includeSignature: true
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleExport = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    try {
      const container = document.createElement('div');
      container.innerHTML = generateReportHTML(informe, template);
      document.body.appendChild(container);

      const options = {
        template,
        customSettings,
        configuracion
      };

      if (template.format === 'pdf') {
        await exportadorPDF(container, options);
      } else if (template.format === 'docx') {
        await exportarDOCX(container, options);
      }

      document.body.removeChild(container);
      onClose();
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Error al exportar el documento. Por favor, intente nuevamente.');
    }
  };

  const generateReportHTML = (informe: any, template: Template) => {
    let html = '';

    if (customSettings.showHeader) {
      html += `
        <div class="header">
          ${customSettings.includeLogo && configuracion.estiloInforme.logo ? 
            `<img src="${configuracion.estiloInforme.logo}" class="logo" style="max-height: 60px; margin-bottom: 10px;" />` : ''}
          <h1 style="margin: 0; text-align: center;">${informe.titulo || 'Informe de Inspección'}</h1>
          ${customSettings.includeDate ? `<p style="text-align: center; margin: 5px 0;">Fecha: ${informe.fecha || new Date().toLocaleDateString('es-ES')}</p>` : ''}
        </div>
      `;
    }

    // For grid-comments layout (4 images with data on right)
    if (template.id === 'grid-comments') {
      const uniqueItems = informe.items && Array.isArray(informe.items) 
        ? informe.items.filter((item: any, index: number) => {
            return informe.items.findIndex((i: any) => i.id === item.id) === index;
          })
        : [];
      
      // Group items into sets of 4 for pagination
      const itemGroups = [];
      for (let i = 0; i < uniqueItems.length; i += 4) {
        itemGroups.push(uniqueItems.slice(i, i + 4));
      }

      itemGroups.forEach((group, groupIndex) => {
        html += `<div class="page" ${groupIndex > 0 ? 'style="page-break-before: always;"' : ''}>`;
        
        html += `<div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">`;
        
        // Left column - images in 2x2 grid
        html += `<div class="images-grid" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; grid-gap: 15px;">`;
        
        group.forEach((item: any, idx: number) => {
          // Check if item has multiple images
          const images = item.imagenes || [item.imagen];
          if (!images || !images.length || !images[0].src) return;
          
          // Use the first image for the grid
          html += `
            <div class="grid-image-container" style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden; border: 1px solid #ddd; border-radius: 4px;">
              <img 
                src="${images[0].src}" 
                alt="${item.categoria || ''} ${item.subelemento || ''}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                data-item-id="${item.id || Math.random().toString(36).substr(2, 9)}"
              />
              ${images.length > 1 ? `
                <div style="position: absolute; top: 5px; right: 5px; background-color: rgba(0,122,204,0.8); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                  ${images.length}
                </div>
              ` : ''}
            </div>
          `;
        });
        
        // Fill empty slots if needed
        for (let i = group.length; i < 4; i++) {
          html += `<div class="grid-image-container" style="position: relative; width: 100%; padding-bottom: 100%; border: 1px solid #eee; border-radius: 4px;"></div>`;
        }
        
        html += `</div>`;
        
        // Right column - data
        html += `<div class="data-column" style="display: flex; flex-direction: column; justify-content: space-between;">`;
        
        group.forEach((item: any, idx: number) => {
          // Check if item has multiple images
          const images = item.imagenes || [item.imagen];
          
          html += `
            <div class="item-data" style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px;">${item.categoria || ''} / ${item.subelemento || ''}</h3>
              <p style="margin: 0 0 5px 0; font-size: 12px;">
                <strong>Ubicación:</strong> ${item.modulo || ''}-${item.nivel || ''} (${item.tipo || ''})
              </p>
              <p style="margin: 0 0 5px 0; font-size: 12px;">
                <strong>Ambiente:</strong> ${item.ambiente || ''}
              </p>
              <p style="margin: 0 0 5px 0; font-size: 12px;">
                <strong>Estado:</strong> ${item.estado || ''}
              </p>
              <p style="margin: 0; font-size: 12px; font-style: italic;">
                ${item.comentario || ''}
              </p>
              ${images.length > 1 ? `
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #007acc;">
                  <strong>Imágenes:</strong> ${images.length} fotos
                </p>
              ` : ''}
            </div>
          `;
        });
        
        html += `</div>`;
        html += `</div>`;
        
        // If there are multiple images, add them below in a grid
        const itemsWithMultipleImages = group.filter(item => (item.imagenes && item.imagenes.length > 1) || false);
        
        if (itemsWithMultipleImages.length > 0) {
          html += `<div style="margin-top: 20px; page-break-inside: avoid;">`;
          
          itemsWithMultipleImages.forEach((item: any) => {
            const images = item.imagenes || [];
            if (images.length <= 1) return;
            
            html += `
              <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                  ${item.categoria || ''} / ${item.subelemento || ''} - Imágenes adicionales
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
            `;
            
            // Skip the first image as it's already in the main grid
            images.slice(1).forEach((img: any, imgIdx: number) => {
              html += `
                <div style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden; border: 1px solid #ddd; border-radius: 4px;">
                  <img 
                    src="${img.src}" 
                    alt="Imagen adicional ${imgIdx + 2}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                  />
                </div>
              `;
            });
            
            html += `</div></div>`;
          });
          
          html += `</div>`;
        }
        
        html += `</div>`;
      });
    } else {
      // Original HTML generation for other templates
      html += '<div class="items-container">';
      
      const uniqueItems = informe.items && Array.isArray(informe.items) 
        ? informe.items.filter((item: any, index: number) => {
            return informe.items.findIndex((i: any) => i.id === item.id) === index;
          })
        : [];

      uniqueItems.forEach((item: any) => {
        // Check if item has multiple images
        const images = item.imagenes || [item.imagen];
        if (!images || !images.length || !images[0].src) return;
        
        html += `
          <div class="item" data-item-id="${item.id || Math.random().toString(36).substr(2, 9)}">
            <img src="${images[0].src}" class="item-image" alt="${item.categoria || ''} ${item.subelemento || ''}" />
            ${template.style.showText ? `
              <div class="item-text">
                <h3>${item.categoria || ''} / ${item.subelemento || ''}</h3>
                <p>${item.modulo || ''}-${item.nivel || ''} (${item.tipo || ''}) | ${item.ambiente || ''}</p>
                <p>${item.comentario || ''}</p>
                ${images.length > 1 ? `<p><strong>Imágenes adicionales:</strong> ${images.length - 1}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `;
        
        // If there are multiple images, add them in a grid below the main item
        if (images.length > 1 && template.style.showText) {
          html += `<div class="additional-images" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">`;
          
          // Skip the first image as it's already shown
          images.slice(1).forEach((img: any, imgIdx: number) => {
            html += `
              <div style="position: relative;">
                <img 
                  src="${img.src}" 
                  alt="Imagen adicional ${imgIdx + 2}" 
                  style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;"
                />
                ${img.etiqueta ? `<div style="font-size: 0.8rem; margin-top: 5px; text-align: center;">${img.etiqueta}</div>` : ''}
              </div>
            `;
          });
          
          html += `</div>`;
        }
      });
      
      html += '</div>';
    }

    if (customSettings.includeSignature) {
      html += `
        <div class="signature" style="margin-top: 2rem; text-align: center;">
          <p class="signature-line" style="margin-bottom: 0.5rem;">${configuracion.estiloInforme.firmaLinea || '______________________'}</p>
          <p class="signature-name" style="margin: 0;">${configuracion.estiloInforme.firmaNombre || 'Nombre y Firma del Inspector'}</p>
        </div>
      `;
    }

    if (customSettings.showFooter) {
      html += `
        <div class="footer" style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #666;">
          <p>Página {page} de {total}</p>
        </div>
      `;
    }

    return html;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Seleccione una plantilla de informe</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            style={{
              border: `2px solid ${selectedTemplate === template.id ? '#007acc' : '#ddd'}`,
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedTemplate === template.id ? '#f0f7ff' : '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              textAlign: 'center' 
            }}>
              {template.preview}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{template.name}</h3>
            <p style={{ 
              margin: 0,
              fontSize: '0.9rem',
              color: '#666'
            }}>
              {template.description}
            </p>
            <div style={{
              marginTop: '0.5rem',
              padding: '0.3rem',
              backgroundColor: template.format === 'pdf' ? '#4CAF50' : '#007acc',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}>
              {template.format.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3>Personalizar Plantilla</h3>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={customSettings.showHeader} 
                onChange={(e) => setCustomSettings(prev => ({
                  ...prev,
                  showHeader: e.target.checked
                }))}
              /> Mostrar Encabezado
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={customSettings.showFooter} 
                onChange={(e) => setCustomSettings(prev => ({
                  ...prev,
                  showFooter: e.target.checked
                }))}
              /> Mostrar Pie de Página
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={customSettings.includeDate} 
                onChange={(e) => setCustomSettings(prev => ({
                  ...prev,
                  includeDate: e.target.checked
                }))}
              /> Incluir Fecha
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={customSettings.includeLogo} 
                onChange={(e) => setCustomSettings(prev => ({
                  ...prev,
                  includeLogo: e.target.checked
                }))}
              /> Incluir Logo
            </label>

            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <input 
                type="checkbox" 
                checked={customSettings.includeSignature} 
                onChange={(e) => setCustomSettings(prev => ({
                  ...prev,
                  includeSignature: e.target.checked
                }))}
              /> Incluir Firma
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTemplateSelector;
