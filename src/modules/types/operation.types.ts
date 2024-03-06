export type OperationBuilder = {
  blNumber: string | null;
  line: string | null;
  cargoLocation: string[];
  exporterConsignerNotifierContainers: string[];
  containerNameTypeSealNumber: string[];
  cargoAmountType: string[];
  cargoDescription: string[];
  pages: string[];
};

export type OperationsRecord = Record<string, OperationBuilder>;
