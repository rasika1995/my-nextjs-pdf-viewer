"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Update Field interface to remove 'pageHeight'
export interface Field {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number; // page number to know which page the field belongs to
}

const PDFViewer3: React.FC<{ pdfUrl: string; fieldsToHighlights: Field[] }> = ({
  pdfUrl,
  fieldsToHighlights = [], // Default to empty array
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scales, setScales] = useState<number[]>([]); // Store scaling factors for each page
  const [pageHeights, setPageHeights] = useState<number[]>([]); // Store viewport heights for each page

  // Ensure PDF.js worker is set
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const onDocumentLoadSuccess = (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  };

  const handleRenderSuccess = (page: pdfjs.PDFPageProxy, pageNumber: number, scale: number) => {
    const viewport = page.getViewport({ scale: 1 });

    setScales((prevScales) => {
      const newScales = [...prevScales];
      newScales[pageNumber - 1] = scale; // Save the scale for the page
      return newScales;
    });

    setPageHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[pageNumber - 1] = viewport.height; // Save the viewport height for the page
      return newHeights;
    });
  };

  const renderHighlights = (pageNumber: number, scale: number) => {
    const fieldsOnPage = fieldsToHighlights.filter((field) => field.page === pageNumber);

    if (!fieldsOnPage.length) return null;

    return fieldsOnPage.map((field, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          backgroundColor: "yellow",
          opacity: 0.4,
          left: `${field.x * scale}px`,
          // Adjust the y-coordinate by using the dynamically calculated page height
          top: `${(pageHeights[pageNumber - 1] - field.y - field.height) * scale}px`,
          width: `${field.width * scale}px`,
          height: `${field.height * scale}px`,
        }}
      />
    ));
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} style={{ position: "relative" }}>
            <Page
              pageNumber={index + 1}
              onRenderSuccess={(page) => {
                const viewport = page.getViewport({ scale: 1 });
                handleRenderSuccess(page, index + 1, viewport.scale);
              }}
            />
            {scales[index] && pageHeights[index] && renderHighlights(index + 1, scales[index])}
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer3;
