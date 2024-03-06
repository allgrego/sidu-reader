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

export type Operation = {
  consignee: string;
  blNumber: string;
  originCountry: string;
  originPort: string;
  destinationPort: string;
  destinationCountry: string;
  location: string;
  totalContainers: string;
  cargoDescription: string;
  cargoAmount: string;
  cargoType: string;
  pages: string;
  opType: string;
};
