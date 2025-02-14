declare module 'html2pdf.js' {
  export interface Html2PdfWorker {
    set: (options: any) => Html2PdfWorker;
    from: (element: HTMLElement) => Html2PdfWorker;
    save: () => Promise<void>;
  }

  const html2pdf: () => Html2PdfWorker;
  export default html2pdf;
} 