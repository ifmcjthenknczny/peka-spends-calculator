interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}
interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface FellowNormal {
  quantity: number;
  price: number;
}

interface PassengerNormal {
  quantity: number;
  price: number;
}

interface Journey {
  day: string;
  time: string;
  stopsNumber: number;
  passengerNormal: PassengerNormal;
  fellowNormal?: FellowNormal;
}

interface Content {
  ordinal: number;
  transactionId: string;
  transactionDate: string;
  transactionPlace: string;
  transactionType: 'Przejazd' | 'Doładowanie punktów';
  price: number;
  transactionStatus: string;
  transferredToCard?: boolean;
  journey?: Journey;
}

interface TransitData {
  content: Content[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface PekaResponse {
  code: number;
  data: TransitData;
}
