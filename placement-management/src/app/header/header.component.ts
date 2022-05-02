import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  placement_search: string = "";

  filter_expmin: boolean = false;
  filter_res_expmin: boolean = true;

  sh_popup: boolean = false;
  isAddRecordBtn: boolean ;


  msel_all_footer: boolean = false;


  constructor(private filterService: FilterServ) {}

  ngOnInit() {

    this.filterService.rgetAddRecordFn().subscribe((addRecCall) => {
        this.isAddRecordBtn = addRecCall;
    });

    this.filterService.rmselAllFooter().subscribe((msel_all_footer_call) => {
      this.msel_all_footer = msel_all_footer_call;
    });

  }

  sendPlacementSearch() {
    this.filterService.placementSearchGet(this.placement_search);
  }

  filterExpMin(filter_expmin: boolean, filter_res_expmin: boolean) {

    if (this.filter_expmin == false) {

      this.filter_expmin = true;
      this.filter_res_expmin = true;
      // return this.filter_expmin;

    } else {

      this.filter_expmin = false;
      this.filter_res_expmin = false;
      // return this.filter_expmin;
    }

    this.filterService.filterExpMin(this.filter_expmin);
    this.filterService.filterResExpmin(this.filter_res_expmin);
  }

    popupOpenCall(sh_popup: boolean){
      this.filterService.mselAllFooter(this.msel_all_footer);
      if(this.sh_popup == false){
          this.sh_popup = true;
      }
      else {
        this.sh_popup = false;
      }

      this.filterService.popupOpenCall(this.sh_popup);
      this.addRecBtnChange();

  } 

  
   
  addRecBtnChange(){
     
      this.isAddRecordBtn = true;
    this.filterService.getAddRecordFn(this.isAddRecordBtn);
  }

}
