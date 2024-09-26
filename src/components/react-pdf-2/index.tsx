"use client";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import React, { useCallback, useState, ChangeEvent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// https://github.com/wojtekmaj/react-pdf/wiki/Recipes
function highlightPattern(text: string, pattern: string): string {
  const regex = new RegExp(pattern, "gi");
  return text.replace(regex, (value) => `<mark>${value}</mark>`);
}

const ReactPDF2: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const [searchText, setSearchText] = useState<string>("");
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const textRenderer = useCallback(
    (textItem: TextItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div style={{height: '100vh', padding: '10px'}}>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
      <Document file={pdfUrl}>
        <Page pageNumber={1} customTextRenderer={textRenderer} />
      </Document>
    </div>
  );
};

export default ReactPDF2;
