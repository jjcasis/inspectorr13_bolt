// src/components/exportadorPDF.ts
import html2pdf from 'html2pdf.js';

const exportadorPDF = (elemento: HTMLElement) => {
  const fecha = new Date();
  const fechaStr = fecha.toISOString().split('T')[0];

  const modulo = document.querySelector('#vista-previa strong')?.textContent?.split(':')[1]?.trim().split(' ')[0] || 'modulo';
  const nivel = document.querySelector('#vista-previa strong:nth-child(2)')?.textContent?.split(':')[1]?.trim() || 'nivel';

  const nombreArchivo = `informe_${modulo}_${nivel}_${fechaStr}.pdf`;

  const opciones: html2pdf.Options = {
    margin:       [0.5, 0.5], // pulgadas
    filename:     nombreArchivo,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait'
    },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf()
    .from(elemento)
    .set(opciones)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Página ${i} de ${pageCount}`, 7.5, 10.5); // Posición inferior derecha
      }
    })
    .save();
};

export default exportadorPDF;
