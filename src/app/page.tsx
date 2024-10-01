import { Field } from "@/components/react-pdf-3";
import { NextPage } from "next";

import dynamic from "next/dynamic";

// const MyApp = dynamic(() => import("@/components/pdf-viewer"), { ssr: false });
const PDFViewer3 = dynamic(() => import("@/components/react-pdf-3"), {
  ssr: false,
});
// const MyDocument = dynamic(() => import("@/components/react-pdf-render"), { ssr: false });
// const ReactPDF2 = dynamic(() => import("@/components/react-pdf-2"), { ssr: false });

const HomePage: NextPage = () => {
  // const textToHighlights = [
  //   "063010",
  //   "231 Swanston St, Melbourne, VIC 3000, Australia",
  //   "30 days after invoice date",
  // ];

  const fieldsToHighlights: Array<Field> = [
    {
      text: "30 days after invoice date",
      x: 227.7324,
      y: 534.9592,
      width: 123.69500000000006,
      height: 11,
      page: 1
    },
    {
      text: "063010",
      x: 227.7324,
      y: 370.4967,
      width: 37.224,
      height: 11,
      page: 1
    },
    // {
    //   text: "063010",
    //   x: 227.7324,
    //   y: 357.2967,
    //   width: 37.224,
    //   height: 11,
    //   page: 1
    // },
    {
      text: "231 Swanston St, Melbourne, VIC 3000, Australia",
      x: 227.7324,
      y: 304.4967,
      width: 241.428,
      height: 11,
      page: 1
    },
  ];
  // const textToHighlights = [
  //   "May 2001",
  //   "Primary bookmarks in a PDF file.",
  //   "This sample package contains:",
  //   "Window > Show Bookmarks"
  // ];
  return (
    // <MyApp pdfUrl='/index.pdf'/>
    // <MyApp pdfUrl="/multiPage.pdf" textsToHighlight={textToHighlights} />
    // <MyApp pdfUrl="/index.pdf" textsToHighlight={textToHighlights} />
    // <ReactPDF2 pdfUrl="/index.pdf" />
    <PDFViewer3 pdfUrl="/index.pdf" fieldsToHighlights={fieldsToHighlights} />
    // <MyDocument />
  );
};

export default HomePage;
