import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'

import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import { FilterServ } from './services/filter.service';
import { PlacementListObj } from './services/placements-list.service';
import { CompanyListsObj } from './services/company-list.service';
import {DepartmentList} from './services/department-list.service';
import { StudentsListObj } from './services/students-list.service';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { PlacementListingComponent } from './placement-listing/placement-listing.component';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { DepartmentComponent } from './department/department.component';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { StudentsComponent } from './students/students.component';


import { PlSidebarComponent } from './pl-sidebar/pl-sidebar.component';
import { FilterSearchPipe } from './filter-search.pipe';
import { PlacementSearchPipe } from './placement-search.pipe';


import { MaterialModule } from './material.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFormatDirective } from './format-datepicker.directive';
import { TooltipDirective } from './directives/tooltip/tooltip.directive';



const routes: Routes = [
{
  path: '',
  redirectTo: 'placement-listing',
  pathMatch: 'full'
},
{
  path: 'placement-listing',
  component: PlacementListingComponent
},
{
  path: 'company-listing',
  component: CompanyListingComponent
},
{
  path: 'department-listing',
  component: DepartmentComponent
},
{
  path: 'students-listing',
  component: StudentsComponent
}

];

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: ['yyyy-MM-DD'],
  },
  display: {
    dateInput: 'yyyy-MM-DD',
    monthYearLabel: 'MMMM DD yyyy',
    dateA11yLabel: 'yyyy-MM-DD',
    monthYearA11yLabel: 'yyyy-MM-DD', 
  }
};

// export const YEAR_FORMATS = {
//   parse: {
//     dateInput: 'YYYY'
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     monthYearA11yLabel: 'YYYY'
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    PlacementListingComponent,
    HeaderComponent,
    FilterComponent,
    SelectBoxComponent,
    CompanyListingComponent,
    StudentsComponent,
    PlSidebarComponent,
    FilterSearchPipe,
    PlacementSearchPipe,
    DateFormatDirective,
    DepartmentComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    NgxSliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    TooltipDirective
  ],
  providers: [
    FilterServ,
    PlacementListObj,
    CompanyListsObj,
    DepartmentList,
    StudentsListObj,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [
        MAT_DATE_LOCALE,
        MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]},
    {provide: MAT_DATE_FORMATS, useValue: 
         APP_DATE_FORMATS 
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
