import { NextPage } from 'next';

import dynamic from 'next/dynamic';

const MyApp = dynamic(() => import('@/components/pdf-viewer'), { ssr: false });

const HomePage: NextPage = () => {
  const textToHighlights = ['063010', '231 Swanston St, Melbourne, VIC 3000, Australia', '30 days after invoice date']
  return (
    <div>
      <h1>My PDF Viewer</h1>
      {/* Assuming you have placed the PDF file in the public directory */}
      {/* <MyApp pdfUrl='/index.pdf'/> */}
      <MyApp pdfUrl='/index.pdf' textsToHighlight={textToHighlights}/>
    </div>
  );
};

export default HomePage;
