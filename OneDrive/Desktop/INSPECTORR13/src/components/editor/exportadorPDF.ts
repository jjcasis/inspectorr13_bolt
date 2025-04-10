import html2pdf from 'html2pdf.js';
import { Template } from './ReportTemplateSelector';

interface ExportOptions {
  template: Template;
  customSettings: {
    showHeader: boolean;
    showFooter: boolean;
    includeDate: boolean;
    includeLogo: boolean;
    includeSignature: boolean;
  };
}

const exportadorPDF = async (elemento: HTMLElement, options: ExportOptions) => {
  const { template, customSettings } = options;
  const fecha = new Date();
  const fechaStr = fecha.toISOString().split('T')[0];
  
  const elementoClonado = elemento.cloneNode(true) as HTMLElement;
  
  // Apply template-specific styles
  if (template.layout === 'side') {
    const items = elementoClonado.querySelectorAll('.item');
    items.forEach(item => {
      (item as HTMLElement).style.display = 'flex';
      (item as HTMLElement).style.gap = '1rem';
      (item as HTMLElement).style.marginBottom = '2rem';
      (item as HTMLElement).style.pageBreakInside = 'avoid';
      
      const img = item.querySelector('.item-image');
      if (img) {
        (img as HTMLElement).style.width = '45%';
        (img as HTMLElement).style.objectFit = 'contain';
      }

      const text = item.querySelector('.item-text');
      if (text) {
        (text as HTMLElement).style.width = '55%';
        (text as HTMLElement).style.display = 'flex';
        (text as HTMLElement).style.flexDirection = 'column';
        (text as HTMLElement).style.justifyContent = 'center';
      }
    });
  } else if (template.layout === 'grid' && template.style.gridLayout) {
    const [rows, cols] = template.style.gridLayout;
    const container = elementoClonado.querySelector('.items-container');
    if (container) {
      (container as HTMLElement).style.display = 'grid';
      (container as HTMLElement).style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      (container as HTMLElement).style.gap = '1rem';
    }
  }

  // Apply image sizes
  const images = elementoClonado.getElementsByTagName('img');
  for (let img of Array.from(images)) {
    if (img.classList.contains('logo')) continue; // Skip logo image
    
    if (template.id === 'grid-comments') {
      // Images are already styled in the HTML for grid-comments
      continue;
    }
    
    switch (template.style.imageSize) {
      case 'small':
        img.style.maxWidth = '150px';
        break;
      case 'medium':
        img.style.maxWidth = '300px';
        break;
      case 'large':
        img.style.maxWidth = '100%';
        break;
    }
    img.style.height = 'auto';
  }

  const nombreArchivo = `informe_${fechaStr}.pdf`;

  // Convert margins object to array format expected by html2pdf
  const margins = template.style.margins 
    ? [template.style.margins.top, template.style.margins.right, template.style.margins.bottom, template.style.margins.left]
    : [0.75, 0.75, 0.75, 0.75]; // Default margins in inches

  const opciones: html2pdf.Options = {
    margin: margins,
    filename: nombreArchivo,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: 'in',
      format: template.style.pageSize ? [template.style.pageSize.width, template.style.pageSize.height] : 'letter',
      orientation: template.layout === 'grid' ? 'landscape' : 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    return html2pdf()
      .from(elementoClonado)
      .set(opciones)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const pageCount = pdf.internal.getNumberOfPages();
        
        if (customSettings.showFooter) {
          for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.text(`Página ${i} de ${pageCount}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 0.3, {
              align: 'center'
            });
          }
        }
      })
      .save();
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF export failed. See console for details."); // Display error message
    throw error;
  }
};

export default exportadorPDF;
