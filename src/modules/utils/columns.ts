import { HeaderInfo, HeadersColumnsIds } from '../types/columns.types';
import { removeAccents } from './misc';

export function getPageColumnsIndexes(
  data: unknown[][],
  rowLimit: number, // row index where the headers finish and data starts
): Record<HeadersColumnsIds, number> {
  const headersColumnsIndexes: Record<HeadersColumnsIds, number> = {
    location: -1,
    line: -1,
    blNumber: -1,
    shipperConsignee: -1,
    containerInfo: -1,
    cargoAmountType: -1,
    cargoDescription: -1,
  };

  // Iterate on rows above data (headers)
  data.slice(0, rowLimit).forEach((row) => {
    const headersInfo: HeaderInfo[] = [
      {
        id: 'location',
        keyword: 'lugar de carga',
      },
      {
        id: 'line',
        keyword: 'linea',
      },
      {
        id: 'blNumber',
        keyword: 'numero d/t',
      },
      {
        id: 'shipperConsignee',
        keyword: 'consignatario',
      },
      {
        id: 'containerInfo',
        keyword: 'numero precinto',
      },
      {
        id: 'cargoAmountType',
        keyword: 'bulto',
      },
      {
        id: 'cargoDescription',
        keyword: 'Marcas transporte',
      },
    ];

    headersInfo.forEach(({ id, keyword }) => {
      const locationColIndex = row.findIndex((val) =>
        removeAccents(String(val).toLowerCase()).startsWith(
          keyword.toLowerCase(),
        ),
      );

      if (locationColIndex < 0) return;

      headersColumnsIndexes[id] = locationColIndex;
    });
  });

  return headersColumnsIndexes;
}
