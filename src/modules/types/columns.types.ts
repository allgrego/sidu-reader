export type HeadersColumnsIds =
  | 'location'
  | 'line'
  | 'blNumber'
  | 'shipperConsignee'
  | 'containerInfo'
  | 'cargoAmountType'
  | 'cargoDescription';

export type HeaderInfo = {
  id: HeadersColumnsIds;
  keyword: string;
};
