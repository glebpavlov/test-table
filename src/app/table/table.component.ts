import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
} from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { ITableModelElement, TableDataValue, TableKeyDownKeys, TableModelElementType } from "./shared/models";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'tb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    JsonPipe,
    NgSwitch,
    NgSwitchCase,
    ReactiveFormsModule,
    NgClass,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit, OnInit, DoCheck {
  @HostListener('dblclick')
  handleDblClick() {
    this.startEditing();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const eventFromTable = event.code as TableKeyDownKeys;
    switch (eventFromTable) {
      case TableKeyDownKeys.ArrowDown: {
        event.preventDefault();
        const nextIndex = this.currentTabIndex + this.model.length;
        this.focusIndex(nextIndex);
        break;
      }
      case TableKeyDownKeys.ArrowUp: {
        event.preventDefault();
        const nextIndex = this.currentTabIndex - this.model.length;
        this.focusIndex(nextIndex);
        break;
      }
      case TableKeyDownKeys.ArrowRight: {
        event.preventDefault();
        const nextIndex = this.currentTabIndex + 1;
        this.focusIndex(nextIndex);
        break;
      }
      case TableKeyDownKeys.ArrowLeft: {
        event.preventDefault();
        const nextIndex = this.currentTabIndex - 1;
        this.focusIndex(nextIndex);
        break;
      }
      case TableKeyDownKeys.Enter: {
        event.preventDefault();
        if (this.editingPosition) {
          this.stopEditing();
          break;
        }
        this.startEditing();
        break;
      }
      case TableKeyDownKeys.Escape: {
        event.preventDefault();
        this.stopEditing();
        break;
      }
    }
  }


  private nativeElement: HTMLElement;

  private _itemsIterator = 0;

  private modelDiffer: IterableDiffer<ITableModelElement>;

  public enumType = TableModelElementType;

  public editingPosition: { row: number, col: number } = null;

  @Input()
  public model: ITableModelElement[];

  @Input()
  public data: TableDataValue[][];

  public viewData: TableDataValue[][] = [];

  public formGroups: FormGroup[];

  constructor(private iterableDiffers: IterableDiffers,
              private elRef: ElementRef,
              private formBuilder: FormBuilder,
              private cb: ChangeDetectorRef) {
  }

  private get focusedNativeElement(): HTMLElement {
    return this.elRef?.nativeElement?.ownerDocument?.activeElement as HTMLElement;
  }

  private get currentTabIndex(): number {
    return +this.focusedNativeElement?.getAttribute('tabindex');
  }

  private adaptDataSize() {
    this.viewData = this.data.map((rowElement: TableDataValue[]) => {
      return this.model.map((modelElement: ITableModelElement, modelIndex: number): TableDataValue => {
        return rowElement[modelIndex] === undefined ? null : rowElement[modelIndex];
      });
    });
  }

  private focusIndex(nextIndex) {
    const nextFocusedElement = this.nativeElement.querySelector(`table td[tabindex="${nextIndex}"]`) as HTMLElement;
    nextFocusedElement?.focus?.();
  }

  private calculateEditingPosition() {
    const viewDataFlatLength = this.viewData.flat().length;
    const col: number = (this.currentTabIndex - 1) % (viewDataFlatLength / this.viewData.length);
    const row: number = parseInt(String((this.currentTabIndex - 1) / (viewDataFlatLength / this.viewData.length)));
    return {row, col}
  }

  private initForms() {
    this.formGroups = this.viewData.map((rowElement, rowIndex) => {
        const controlsData = this.model.reduce((accum, modelElement, colIndex) => {
          accum[modelElement.key] = [this.viewData?.[rowIndex]?.[colIndex] || null, modelElement.validators];
          return accum;
        }, {});
        return this.formBuilder.group(controlsData)
      }
    );
  }

  public startEditing() {
    if (!!this.editingPosition) {
      this.stopEditing();
    }
    this.editingPosition = this.calculateEditingPosition();

  }

  public stopEditing() {
    this.viewData = this.formGroups.map((group) => Object.values(group.value));
    this.editingPosition = null;

  }


  public get itemIterator() {
    return ++this._itemsIterator;
  }

  public addRow() {
    this.viewData.push(new Array(this.model.length));
    this.initForms();
    this.cb.detectChanges();

  }

  public getViewValue(value: TableDataValue, modelIndex?: number) {
    const type = this.model[modelIndex].type;
    switch (type) {
      case TableModelElementType.Checkbox: {
        const valueAsBoolean: boolean = value as boolean;
        switch (valueAsBoolean) {
          case true: {
            return '✅'
          }
          case false: {
            return '❌';
          }
          default: {
            return '❓';
          }
        }
      }
      case TableModelElementType.Select: {
        const foundOption = this.model[modelIndex]?.other?.options?.find((option) => option.value === value);
        return foundOption?.label || (value?.toString?.() || '') + ' ❓';
      }
      case TableModelElementType.Text:
      case TableModelElementType.Digit:
      default: {
        const valueTryString = value?.toString?.() || null;
        return valueTryString === null ? '❓' : valueTryString;
      }
    }
  }

  public ngAfterViewInit(): void {
    this.nativeElement = this.elRef.nativeElement as HTMLElement;
    // this.cb.detach();
  }

  public ngOnInit() {
    this.adaptDataSize();
    this.initForms();
  }

  public ngDoCheck(): void {
    this._itemsIterator = 0;
  }
}
