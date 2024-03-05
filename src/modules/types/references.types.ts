export type ReferenceCoord = {
  x: number | null;
  y: number | null;
  width: number | null;
};

export type ReferencesIds =
  | 'cargoLocationHeader'
  | 'lineHeader'
  | 'totalSubHeader'
  | 'printedOnText'
  | 'dtNumberHeader';

export enum ReferencesNames {
  CARGO_LOCATION_HEADER = 'cargoLocationHeader',
  LINE_HEADER = 'lineHeader',
  TOTAL_SUBHEADER = 'totalSubHeader',
  PRINTED_ON_TEXT = 'printedOnText',
  DT_NUMBER_HEADER = 'dtNumberHeader',
}

export type References = Record<ReferencesIds, ReferenceCoord>;
