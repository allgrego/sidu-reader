import fs from 'fs/promises';
import countries from 'i18n-iso-countries';
import xlsx from 'node-xlsx';
import path from 'node:path';

import { getPageColumnsIndexes } from './modules/utils/columns';
import { getEmptyOperationBuilder } from './modules/utils/operation';

import { Operation, OperationsRecord } from './modules/types/operation.types';

/**
 * Excel generated from PDF from https://www.zamzar.com/
 */

const OP_TYPE = 'import';
const PORT = 'VEPBL'; // Origin or destination port
const XLSX_FILE_PATH = 'files/CMAI-0ER9SN1MA.xlsx';

/**
 * Main function. App entry point
 */
async function main(): Promise<void> {
  try {
    console.log(
      '- - - - - - - - - - - - - - - - - - - -  SIDU-READER - - - - - - - - - - - - - - - - - - - - ',
      '\n',
    );

    const filePath = path.resolve(XLSX_FILE_PATH);

    console.log('* Data obtained from:'.padEnd(30, ' '), filePath, '\n');

    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);

    const sheets = workSheetsFromFile;

    const operationsRecord: OperationsRecord = {};

    // ID of 'current' operation
    let opIdIndex: string | null = null;

    // Iterate on sheets
    sheets.forEach(({ data, name }) => {
      const initialDataRowIndex =
        data.findIndex((row) => row.find((r) => r === 'Total')) + 1;

      const finalDataRowIndex =
        data.findIndex((row) =>
          row.find((r) => String(r).toLowerCase().startsWith('impreso el')),
        ) - 1;

      // Backup for initial opIdIndex
      const initialOpIdIndex = opIdIndex;

      const headersColumnsIndexes = getPageColumnsIndexes(
        data,
        initialDataRowIndex,
      );

      // Iterate on data rows once to set IDs
      data.slice(initialDataRowIndex, finalDataRowIndex).forEach((row) => {
        const blNumber: string | undefined = row?.[2];

        // Set the page where it belongs if not already
        if (opIdIndex && !operationsRecord[opIdIndex].pages.includes(name)) {
          operationsRecord[opIdIndex].pages.push(name);
        }

        if (blNumber) {
          // Update "current" op
          opIdIndex = blNumber;
          // Create empty data for current op
          operationsRecord[opIdIndex] = getEmptyOperationBuilder();
        }
      });

      // Restore the initial opIndex if has a valid value
      if (initialOpIdIndex) {
        opIdIndex = initialOpIdIndex;
      }

      // iterate on data rows once again to set the data
      data.slice(initialDataRowIndex, finalDataRowIndex).forEach((row) => {
        if (!opIdIndex) {
          console.error('No ID index found. Unable to continue');
          return;
        }

        /**
         * - - - - BL number - - - -
         */

        const blNumber: string | undefined =
          row?.[headersColumnsIndexes['blNumber']];

        if (blNumber) {
          opIdIndex = blNumber;
          operationsRecord[opIdIndex]['blNumber'] = blNumber;
        }

        /**
         * - - - - Cargo Location - - - -
         */

        const cargoLocation = row?.[headersColumnsIndexes['location']];

        if (cargoLocation) {
          operationsRecord[opIdIndex]['cargoLocation'].push(cargoLocation);
        }

        /**
         * - - - - Line - - - -
         */

        const line = row?.[headersColumnsIndexes['line']];

        if (line) {
          operationsRecord[opIdIndex]['line'] = line;
        }

        /**
         * Container Info - Seal Number
         */
        const containerInfoColIndex = headersColumnsIndexes['containerInfo'];

        const containerInfo = row?.[containerInfoColIndex];

        if (containerInfo) {
          const moreInfoColIndex = containerInfoColIndex + 1;

          const moreInfo = row?.[moreInfoColIndex];

          const completeContainerInfo =
            moreInfo &&
            moreInfoColIndex !== headersColumnsIndexes['cargoAmountType']
              ? [containerInfo, moreInfo].join(' ')
              : containerInfo;

          operationsRecord[opIdIndex]['containerNameTypeSealNumber'].push(
            completeContainerInfo,
          );
        }

        /**
         * Cargo description
         */
        const cargoDescription =
          row?.[headersColumnsIndexes['cargoDescription']];

        if (cargoDescription) {
          operationsRecord[opIdIndex]['cargoDescription'].push(
            cargoDescription,
          );
        }

        /**
         * Cargo type
         */
        const cargoAmountType = row?.[headersColumnsIndexes['cargoAmountType']];

        if (cargoAmountType) {
          operationsRecord[opIdIndex]['cargoAmountType'].push(cargoAmountType);
        }

        /**
         * Shipper/Consignee/Notifier/Total Containers
         */
        const shipperConsignee =
          row?.[headersColumnsIndexes['shipperConsignee']];

        if (shipperConsignee) {
          const moreInfoColIndex =
            headersColumnsIndexes['shipperConsignee'] + 1;

          const moreInfo = row?.[moreInfoColIndex];

          const completeShipperConsigneeInfo =
            moreInfo &&
            moreInfoColIndex !== headersColumnsIndexes['containerInfo']
              ? [shipperConsignee, moreInfo].join(' ')
              : shipperConsignee;

          operationsRecord[opIdIndex][
            'exporterConsignerNotifierContainers'
          ].push(completeShipperConsigneeInfo);
        }
      });
    });

    /**
     * - - - - - Process operations
     */

    const rawOperationsList = Object.values(operationsRecord);

    const cleanOperations: Operation[] = rawOperationsList.map(
      ({
        blNumber,
        cargoDescription,
        cargoAmountType,
        exporterConsignerNotifierContainers,
        pages,
        cargoLocation,
      }) => {
        const description = cargoDescription
          .join(' ')
          .replace('S/M', '')
          .replace('s/m', '')
          .replace('PAQUETE', '')
          .trim();

        const amount = String(cargoAmountType?.[0]).replace(',', '');

        const pack = !isNaN(Number(cargoAmountType?.[1]))
          ? ''
          : cargoAmountType?.[1];

        const allExporterData = exporterConsignerNotifierContainers.join(' ');

        // TODO: Do this with regexes

        // const shIndex = allExporterData.toLowerCase().indexOf('sh:');
        const cnIndex = allExporterData.toLowerCase().indexOf('cn:');
        const ntIndex = allExporterData.toLowerCase().indexOf('ny:');
        const ctIndex = allExporterData.toLowerCase().indexOf('ct:');

        // const shipper =
        //   allExporterData.slice(shIndex, cnIndex).split(':')?.[1]?.trim() || '';
        const consignee =
          allExporterData.slice(cnIndex, ntIndex).split(':')?.[1]?.trim() || '';
        const notify =
          allExporterData
            .slice(ntIndex, ctIndex < 0 ? undefined : ctIndex)
            .split(':')?.[1]
            ?.trim() || '';
        const containers =
          allExporterData.slice(ctIndex).split(':')?.[1]?.trim() || '';

        return {
          consignee: consignee || notify,
          totalContainers: containers,
          location: cargoLocation
            .filter((x) => x)
            .slice(1)
            .join(', ')
            .replace(',,', ','),
          originPort: cargoLocation?.[0] || '',
          originCountry:
            countries.getName(
              String(cargoLocation?.[0] || '').slice(0, 2),
              'es',
            ) || String(cargoLocation?.[0] || '').slice(0, 2),
          destinationPort: PORT,
          destinationCountry:
            countries.getName(String(PORT).slice(0, 2), 'es') || '',
          cargoAmount: Number(amount).toString(10),
          cargoType: pack,
          cargoDescription: description,
          blNumber: blNumber || '',
          pages: pages.join(', '),
          file: path.basename(filePath),
          opType: OP_TYPE,
        };
      },
    );

    const consignees: string[] = [];

    const repeatedConsignees: string[] = [];

    // Remove the operations of repeated consignees
    const operations = cleanOperations.filter(({ consignee }) => {
      if (consignees.includes(consignee)) {
        repeatedConsignees.push(consignee);
        return false;
      }

      consignees.push(consignee);
      return true;
    });

    const headers: string[] = [
      'consignee',
      'totalContainers',
      'location',
      'originPort',
      'originCountry',
      'destinationPort',
      'destinationCountry',
      'cargoAmount',
      'cargoType',
      'cargoDescription',
      'blNumber',
      'pages',
      'opType',
    ];

    const data: string[][] = [
      headers,
      ...operations.map(
        ({
          consignee,
          totalContainers,
          location,
          originPort,
          originCountry,
          destinationPort,
          destinationCountry,
          cargoAmount,
          cargoType,
          cargoDescription,
          blNumber,
          pages,
          opType,
        }) => {
          return [
            consignee,
            totalContainers,
            location,
            originPort,
            originCountry,
            destinationPort,
            destinationCountry,
            cargoAmount,
            cargoType,
            cargoDescription,
            blNumber,
            pages,
            opType,
          ];
        },
      ),
    ];

    const buffer = xlsx.build([{ name: 'data', data: data, options: {} }]);

    const newFilePath = path.resolve('files/new.xlsx');

    await fs.writeFile(newFilePath, buffer);

    // console.log('operations', operations);
    // console.log('Included consignees', Array.from(new Set(consignees)));
    // console.log('Repeated consignees', Array.from(new Set(repeatedConsignees)));

    console.log(
      '- - - - - - - - - - - - - - - - - - - -  STATS - - - - - - - - - - - - - - - - - - - - ',
      '\n',
    );

    console.log('* Total operations:'.padEnd(32, ' '), cleanOperations.length);
    console.log(
      '* Valid operations included'.padEnd(32, ' '),
      operations.length,
      '/',
      cleanOperations.length,
    );
    console.log(
      '* Repeated operations removed:'.padEnd(32, ' '),
      repeatedConsignees.length,
      '/',
      cleanOperations.length,
    );
    console.log('* New File created at'.padEnd(32, ' '), newFilePath);
  } catch (error) {
    console.error('Failure', error);
    throw error;
  }
}

main();
