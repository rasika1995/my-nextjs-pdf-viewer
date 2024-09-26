"use client";
import React from "react";
import { Document, Page, Text, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333",
    backgroundColor: "#ffffff",
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5,
  },
});

// Create Document Component
const MySingleParagraphDocument = () => (
  <PDFViewer style={{ width: "100%", height: "100vh" }}>
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.paragraph}>
          This is a sample paragraph in a PDF document created using
          @react-pdf/renderer. The library allows you to create PDF files
          directly from your React components, making it easy to generate
          dynamic documents based on your applications data.
        </Text>
      </Page>
    </Document>
  </PDFViewer>
);

export default MySingleParagraphDocument;
