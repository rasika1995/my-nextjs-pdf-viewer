'use client';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface Field {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageHeight: number;
}

const PDFViewer: React.FC<{ pdfUrl: string; textsToHighlight: string[] }> = ({ pdfUrl, textsToHighlight }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fieldsToHighlight, setFieldsToHighlight] = useState<Field[][]>([]);
  const [scales, setScales] = useState<number[]>([]); // Store scaling factors for each page

  // Ensure PDF.js worker is set
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const onDocumentLoadSuccess = (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  };

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const pdf = await pdfjs.getDocument(pdfUrl).promise;

        const fields = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, i) => {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 1 }); // Use scale 1 for raw coordinates
            const textContent = await page.getTextContent();

            return textContent.items
              .filter((item: any) => textsToHighlight.some(text => item.str.includes(text)))
              .map((item: any) => ({
                text: item.str,
                x: item.transform[4], // raw x
                y: item.transform[5], // raw y (adjusted later)
                width: item.width, // text width
                height: item.height, // text height
                pageHeight: viewport.height, // page height for y-axis correction
              }));
          })
        );

        setFieldsToHighlight(fields);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPDF();
  }, [pdfUrl, textsToHighlight]);

  const renderHighlights = (page: number, scale: number) => {
    const fieldsOnPage = fieldsToHighlight[page - 1];
    if (!fieldsOnPage) return null;

    return fieldsOnPage.map((field, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          backgroundColor: 'yellow',
          opacity: 0.4,
          left: `${field.x * scale}px`,
          // Adjust the y-coordinate by subtracting field.height for alignment correction
          top: `${(field.pageHeight - field.y - field.height) * scale}px`,
          width: `${field.width * scale}px`,
          height: `${field.height * scale}px`,
        }}
      />
    ));
  };

  const handleRenderSuccess = (pageNumber: number, scale: number) => {
    setScales((prevScales) => {
      const newScales = [...prevScales];
      newScales[pageNumber - 1] = scale; // Save the scale for the page
      return newScales;
    });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} style={{ position: 'relative' }}>
            <Page
              pageNumber={index + 1}
              onRenderSuccess={(page) => {
                const viewport = page.getViewport({ scale: 1 });
                handleRenderSuccess(index + 1, viewport.scale);
              }}
            />
            {scales[index] && renderHighlights(index + 1, scales[index])}
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
