import { ValidatorFn } from "@angular/forms";

export enum TableModelElementType {
  Checkbox = 'checkbox',
  Text = 'text',
  Select = 'select',
  Digit = 'digit'
}

export interface ITableModelElementOption {
  readonly label: string;
  readonly value: string;
}

export interface ITableModelElementOther {
  readonly options?: ITableModelElementOption[];
}

export interface ITableModelElement {
  readonly key: string;
  readonly label: string;
  readonly type: TableModelElementType;
  readonly validators?: ValidatorFn[];
  readonly other?: ITableModelElementOther;
}

export enum TableKeyDownKeys {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Enter = 'Enter',
  Escape = 'Escape'
}

export type TableDataValue = boolean | number | string | null;

