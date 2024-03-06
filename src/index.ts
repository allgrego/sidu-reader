import xlsx from 'node-xlsx';
import path from 'node:path';
import { OperationsRecord } from './modules/types/operation.types';
import { getPageColumnsIndexes } from './modules/utils/columns';
import { getEmptyOperationBuilder } from './modules/utils/operation';

/**
 * Excel generated from PDF from https://www.zamzar.com/
 */

/**
 * Main function. App entry point
 */
async function main(): Promise<void> {
  try {
    const filePath = path.resolve('files/CMAI-0ER9SN1MA.xlsx');

    console.log('filePath', filePath);

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

    console.log('operationsRecord', operationsRecord);
  } catch (error) {
    console.error('Failure', error);
    throw error;
  }
}

main();
