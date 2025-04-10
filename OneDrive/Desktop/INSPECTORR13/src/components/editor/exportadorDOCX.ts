import {
  Document,
  Paragraph,
  ImageRun,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer
} from 'docx';
import { saveAs } from 'file-saver';
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

async function imageUrlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const exportarDOCX = async (elemento: HTMLElement, options: ExportOptions) => {
  const { template, customSettings } = options;
  const fecha = new Date().toLocaleDateString('es-ES');

  const titulo = elemento.querySelector('h2')?.textContent || 'Informe de Inspección';
  const modulo = elemento.querySelector('p strong:first-child')?.nextSibling?.textContent?.trim() || '';
  const nivel = elemento.querySelector('p strong:last-child')?.nextSibling?.textContent?.trim() || '';

  const sections: any[] = [];

  if (customSettings.showHeader) {
    sections.push(
      new Paragraph({
        text: titulo,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );

    if (customSettings.includeDate) {
      sections.push(
        new Paragraph({
          text: `Fecha: ${fecha}`,
          alignment: AlignmentType.CENTER,
        })
      );
    }

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Módulo: ", bold: true }),
          new TextRun(modulo),
          new TextRun({ text: "   Nivel: ", bold: true }),
          new TextRun(nivel),
        ],
      })
    );
  }

  const ambienteSections = elemento.querySelectorAll('[data-ambiente]');
  for (const ambiente of Array.from(ambienteSections)) {
    const ambienteId = ambiente.getAttribute('data-ambiente');
    sections.push(
      new Paragraph({
        text: `Ambiente: ${ambienteId}`,
        heading: HeadingLevel.HEADING_2,
      })
    );

    const table = ambiente.querySelector('table');
    if (table) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const docxTable = new Table({
        rows: rows.map(row => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          return new TableRow({
            children: cells.map(cell => {
              return new TableCell({
                children: [new Paragraph({ text: cell.textContent || '' })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              });
            }),
          });
        }),
      });
      sections.push(docxTable);
    }

    const comentarios = ambiente.querySelector('[data-comentarios]')?.textContent;
    if (comentarios) {
      sections.push(
        new Paragraph({
          text: "Observaciones",
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: comentarios,
        })
      );
    }

    const imagenes = Array.from(ambiente.querySelectorAll('img'));
    if (imagenes.length > 0) {
      sections.push(
        new Paragraph({
          text: "Imágenes",
          heading: HeadingLevel.HEADING_3,
        })
      );

      for (const img of imagenes) {
        try {
          const blob = await imageUrlToBlob(img.src);
          const base64 = await blobToBase64(blob);
          const imageRun = new ImageRun({
            data: base64.split(',')[1],
            transformation: {
              width: template.style.imageSize === 'small' ? 150 : 
                     template.style.imageSize === 'medium' ? 300 : 500,
              height: template.style.imageSize === 'small' ? 150 : 
                      template.style.imageSize === 'medium' ? 300 : 500,
            },
          });

          const caption = img.getAttribute('alt') || '';
          sections.push(
            new Paragraph({
              children: [imageRun],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: caption,
              alignment: AlignmentType.CENTER,
              style: "Caption",
            })
          );
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  }

  if (customSettings.includeSignature) {
    sections.push(
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "______________________",
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: "Nombre y Firma del Inspector",
        alignment: AlignmentType.CENTER,
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `informe_${fecha.replace(/\//g, '-')}.docx`);
  } catch (error) {
    console.error('Error exporting document:', error);
    throw error;
  }
};

export default exportarDOCX;
