import { PDFExtractText } from 'pdf.js-extract';
import { OperationsRecord } from '../types/operation.types';
import { References } from '../types/references.types';
import { isOnLineColumn } from './references';

export function getPageOperationsInitialData(
  contentOnTable: PDFExtractText[],
  xCoords: number[],
  yCoords: number[],
  refs: References,
): OperationsRecord {
  const operationsRecord: OperationsRecord = {};

  // Move on Y axis
  yCoords.forEach((y) => {
    // Move on X axis
    xCoords.forEach((x) => {
      const extract = contentOnTable.find((c) => c.x === x && c.y === y);

      if (
        !extract ||
        !refs.dtNumberHeader.x ||
        !refs.lineHeader.x ||
        !refs.lineHeader.width
      )
        return;

      // Ignore non "Line" columns
      if (!isOnLineColumn(x, refs)) return;

      const line = extract.str;

      //   refs[''].x = x;
      //   refs[key].y = y;
      //   refs[key].width = width;

      operationsRecord[line] = { line };
    });
  });
  return operationsRecord;
}
