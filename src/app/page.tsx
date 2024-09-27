import { NextPage } from "next";

import dynamic from "next/dynamic";

const MyApp = dynamic(() => import("@/components/pdf-viewer"), { ssr: false });
// const MyDocument = dynamic(() => import("@/components/react-pdf-render"), { ssr: false });
// const ReactPDF2 = dynamic(() => import("@/components/react-pdf-2"), { ssr: false });

const HomePage: NextPage = () => {
  // const textToHighlights = [
  //   "063010",
  //   "231 Swanston St, Melbourne, VIC 3000, Australia",
  //   "30 days after invoice date",
  // ];
  const textToHighlights = [
    "May 2001",
    "Primary bookmarks in a PDF file.",
    "This sample package contains:",
    "Window > Show Bookmarks"
  ];
  return (
    // <MyApp pdfUrl='/index.pdf'/>
    <MyApp pdfUrl="/multiPage.pdf" textsToHighlight={textToHighlights} />
    // <MyApp pdfUrl="/index.pdf" textsToHighlight={textToHighlights} />
    // <ReactPDF2 pdfUrl="/index.pdf" />
    // <MyDocument />
  );
};

export default HomePage;
