import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanylistPage } from './companylist';

@NgModule({
  declarations: [
    CompanylistPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanylistPage),
  ],
})
export class CompanylistPageModule {}
