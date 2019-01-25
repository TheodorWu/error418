import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgbComponent } from './agb/agb.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [AgbComponent, LoadingComponent],
  imports: [
    CommonModule
  ],
  exports:
  [AgbComponent],
})
export class LevelModule { }
