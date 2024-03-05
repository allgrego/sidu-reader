import { PDFExtractPage, PDFExtractText } from 'pdf.js-extract';
import { OperationsRecord } from '../types/operation.types';
import { References } from '../types/references.types';
import { getPageOperationsInitialData } from './operations';
import { getPageRefs } from './references';

/**
 * Get the content that is inside the table area (vertically)
 *
 * @param {PDFExtractText[]} content
 * @param {References} refs
 *
 * @return {PDFExtractText[]}
 */
export function getContentOnTable(
  content: PDFExtractText[],
  refs: References,
): PDFExtractText[] {
  return content.filter(({ y, str }) => {
    const { totalSubHeader, printedOnText } = refs;

    // Table content required references
    if (!totalSubHeader.y || !printedOnText.y) {
      console.error('No required references set');
      return true;
    }

    return (
      !!str.trim() && // There is a value
      y > totalSubHeader.y && // Below headers (total)
      y < printedOnText.y // Above printed on (text below table)
    );
  });
}

export function getContentValidCoordinates(content: PDFExtractText[]): {
  x: number[];
  y: number[];
} {
  const validXCoordsRaw: number[] = [];
  const validYCoordsRaw: number[] = [];

  content.forEach(({ x, y }) => {
    validXCoordsRaw.push(x);
    validYCoordsRaw.push(y);
  });

  // Remove repeated X coords and sort them
  const validXCoords = Array.from(new Set(validXCoordsRaw));
  validXCoords.sort((a, b) => a - b);

  // Remove repeated Y coords and sort them
  const validYCoords = Array.from(new Set(validYCoordsRaw));
  validYCoords.sort((a, b) => a - b);

  return { x: validXCoords, y: validYCoords };
}

/**
 * Process a page and set the operations data
 *
 * @param {PDFExtractPage} page
 * @param {OperationsRecord} operations all operations record reference
 *
 * @return {void}
 */
export function processPage(
  page: PDFExtractPage,
  operations: OperationsRecord,
): void {
  const refs = getPageRefs(page);

  const { content, pageInfo } = page;

  console.log('Page', pageInfo.num);

  const contentOnTable = getContentOnTable(content, refs);

  const { x: validXCoords, y: validYCoords } =
    getContentValidCoordinates(contentOnTable);

  const linesOperationsRecord = getPageOperationsInitialData(
    contentOnTable,
    validXCoords,
    validYCoords,
    refs,
  );

  // Move on Y axis
  validYCoords.forEach((y) => {
    // Move on X axis
    validXCoords.forEach((x) => {
      const extract = contentOnTable.find((c) => c.x === x && c.y === y);

      if (!extract) return;

      console.log(
        `(${x.toFixed(2).padStart(7, ' ')}, ${y.toFixed(2).padStart(7, ' ')}) => "${extract.str}"`,
      );
    });
  });

  // Update all operations
  // TODO: Update after getting all data
  Object.entries(linesOperationsRecord).forEach(([line, data]) => {
    operations[line] = data;
  });

  return;
}
