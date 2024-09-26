'use client';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface Field {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageHeight: number;
}

interface PDFViewerProps {
  pdfUrl: string;
  textsToHighlight: string[];
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, textsToHighlight }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fieldsToHighlight, setFieldsToHighlight] = useState<Field[][]>([]);

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
            const viewport = page.getViewport({ scale: 1 });
            const textContent = await page.getTextContent();

            return textContent.items
              .filter((item): item is TextItem => 'str' in item) // Type guard to filter only TextItems
              .filter((item) => textsToHighlight.some(text => item.str.includes(text)))
              .map((item) => ({
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
                height: item.height,
                pageHeight: viewport.height,
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

  // Custom text renderer to highlight specified texts
  const customTextRenderer = ({ str }: { str: string; itemIndex: number }) => {
    // Check if the current text should be highlighted
    const isHighlighted = fieldsToHighlight.flat().some(f => f.text === str);
    
    return isHighlighted ? `<mark>${str}</mark>` : str;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1} 
            customTextRenderer={customTextRenderer} 
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;