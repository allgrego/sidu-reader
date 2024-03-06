import { OperationBuilder } from '../types/operation.types';

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
