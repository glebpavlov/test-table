import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TableComponent } from "./table/table.component";
import { ITableModelElement, TableDataValue, TableModelElementType } from "./table/shared/models";
import { Validators } from "@angular/forms";

@Component({
  selector: 'tb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
  ]

})
export class AppComponent {
  public tableModel: ITableModelElement[] = [

    {
      key: 'size',
      type: TableModelElementType.Digit,
      label: 'Размер картины',
      validators: [Validators.required, Validators.min(0)]
    },

    {
      key: 'objectType',
      type: TableModelElementType.Select,
      label: 'Тип объекта',
      validators: [Validators.required],
      other: {
        options: [
          {
            label: 'Кошка',
            value: 'cat'
          },
          {
            label: 'Мышка',
            value: 'mouse'
          },
          {
            label: 'Плюмбус',
            value: 'plumbus'
          }
        ]
      }
    },

    {
      key: 'name',
      label: 'Название',
      type: TableModelElementType.Text,
      validators: [Validators.required]
    },

    {
      key: 'isMeaning',
      type: TableModelElementType.Checkbox,
      label: 'Есть смысл?'
    }

  ];

  public tableData: TableDataValue[][] = [
    [12, 'plumbus', 'Какой-то жпг', false],
    [22, 'cat', 'Рисунок кошки', true],
    [18, 'mouse', 'Мышь с неуказанным смыслом'],
    [18, 'notIncludedInTheOptionsList', 'Не входит в список опций селекта', false],
    [null, null, 'Нет ничего, только одно название...', null],
  ];

}
