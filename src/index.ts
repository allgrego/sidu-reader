import path from 'node:path';
import { PDFExtract, PDFExtractOptions } from 'pdf.js-extract';
import { OperationsRecord } from './modules/types/operation.types';
import { processPage } from './modules/utils/page';

const pdfExtract = new PDFExtract();
const options: PDFExtractOptions = {}; /* see below */

/**
 * Main function. App entry point
 */
async function main(): Promise<void> {
  try {
    const operations: OperationsRecord = {};

    const filePath = path.resolve('files/CMAI-0ER9SN1MA.pdf');

    console.log('filePath', filePath);

    const extraction = await pdfExtract.extract(filePath, options);

    const pages = extraction.pages.slice(0, 10);

    const totalPages = pages.length;

    console.log('totalPages', totalPages);

    /**
     * - - - - - - Pages Processing - - - - -
     */
    // Iterate on each page and process them
    pages.forEach((page) => processPage(page, operations));

    console.log('allOperations', operations);

    console.log('total operations', Object.keys(operations).length);
  } catch (error) {
    console.error('Failure', error);
    throw error;
  }
}

main();
