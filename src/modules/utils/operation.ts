import { OperationBuilder } from '../types/operation.types';

export enum OperationType {
  IMPORT = 'import',
  EXPORT = 'export',
}

export function getEmptyOperationBuilder(): OperationBuilder {
  return {
    blNumber: '',
    line: '',
    cargoAmountType: [],
    cargoDescription: [],
    cargoLocation: [],
    containerNameTypeSealNumber: [],
    exporterConsignerNotifierContainers: [],
    pages: [],
  };
}
