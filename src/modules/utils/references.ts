import { PDFExtractPage } from 'pdf.js-extract';
import {
  ReferenceCoord,
  References,
  ReferencesIds,
  ReferencesNames,
} from '../types/references.types';
import { removeAccents } from './misc';

export const initialRefsCoords = (): ReferenceCoord => ({
  x: null,
  y: null,
  width: null,
});

export function setRef(
  refs: References,
  key: ReferencesIds,
  keyword: string,
  text: string,
  x: number,
  y: number,
  width: number,
): void {
  try {
    const processedText = removeAccents(text.trim()).toLowerCase();

    if (!text || !processedText) {
      return;
    }

    if (!processedText.startsWith(keyword.toLowerCase())) {
      return;
    }

    refs[key].x = x;
    refs[key].y = y;
    refs[key].width = width;
  } catch (error) {
    console.error('Failure', error);
  }
}

export function getInitialRefs(): References {
  const refs: References = {
    [ReferencesNames.CARGO_LOCATION_HEADER]: initialRefsCoords(),
    [ReferencesNames.LINE_HEADER]: initialRefsCoords(),
    [ReferencesNames.TOTAL_SUBHEADER]: initialRefsCoords(),
    [ReferencesNames.PRINTED_ON_TEXT]: initialRefsCoords(),
    [ReferencesNames.DT_NUMBER_HEADER]: initialRefsCoords(),
  };

  return refs;
}

export function getPageRefs(page: PDFExtractPage): References {
  const refs = getInitialRefs();

  const { content } = page;

  // Set every reference
  content.forEach(({ x, y, str, width }) => {
    setRef(
      refs,
      ReferencesNames.CARGO_LOCATION_HEADER,
      'lugar de carga',
      str,
      x,
      y,
      width,
    );
    setRef(refs, ReferencesNames.LINE_HEADER, 'linea', str, x, y, width);
    setRef(refs, ReferencesNames.TOTAL_SUBHEADER, 'total', str, x, y, width);
    setRef(
      refs,
      ReferencesNames.PRINTED_ON_TEXT,
      'impreso el',
      str,
      x,
      y,
      width,
    );
    setRef(
      refs,
      ReferencesNames.DT_NUMBER_HEADER,
      'numero d/t',
      str,
      x,
      y,
      width,
    );
  });

  return refs;
}

export function isOnLineColumn(x: number, refs: References): boolean {
  if (
    !refs[ReferencesNames.LINE_HEADER].x ||
    !refs[ReferencesNames.LINE_HEADER].width
  ) {
    console.error('References not found');
    return false;
  }

  return (
    x > refs[ReferencesNames.LINE_HEADER].x &&
    x <
      refs[ReferencesNames.LINE_HEADER].x +
        refs[ReferencesNames.LINE_HEADER].width
  );
}
