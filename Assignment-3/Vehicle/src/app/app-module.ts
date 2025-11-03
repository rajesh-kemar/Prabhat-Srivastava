// app.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VehicleList } from './vehicle-list/vehicle-list';
import { VehicleDetail } from './vehicle-detail/vehicle-detail';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppComponent,
    VehicleList,
    VehicleDetail
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

