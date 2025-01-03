export interface RangeValue {
  min: string | number;
  max: string | number;
}

export interface Filter {
  id: string;
  field: string;
  value: string | number | RangeValue;
  display: string;
  type: 'text' | 'number' | 'range';
}

export interface FilterState {
  mark: string;
  bar: string;
  length: RangeValue;
  weight: RangeValue;
}