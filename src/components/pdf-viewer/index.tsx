"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

interface PDFViewerProps {
  pdfUrl: string;
  textsToHighlight: string[];
}


const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, textsToHighlight }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  // Ensure PDF.js worker is set
  // https://mozilla.github.io/pdf.js/
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const onDocumentLoadSuccess = (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  };

  // Custom text renderer to highlight specified texts
  const customTextRenderer = ({ str }: { str: string; itemIndex: number }) => {
    const isHighlighted = textsToHighlight.some(
      (text) => text.trim().toLowerCase() === str.trim().toLowerCase()
    );
    return isHighlighted ? `<mark>${str}</mark>` : str; // Return as string
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
