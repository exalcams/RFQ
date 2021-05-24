import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatInputModule } from '@angular/material';
import { MatSelectSearchComponent } from './mat-select-search.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: [
    MatSelectSearchComponent
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatSelectSearchComponent
  ]
})
export class MatSelectSearchModule { }
