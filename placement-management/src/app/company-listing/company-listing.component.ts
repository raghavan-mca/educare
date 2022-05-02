import { Component, OnInit } from '@angular/core';

import { PlacementListObj } from '../services/placements-list.service';
import { CompanyListsObj } from '../services/company-list.service';


import { PlacementList } from '../shared/listing.model';
import {CompanyLists} from '../shared/listing.model';

import { FilterServ } from '../services/filter.service';

import { Subscription } from 'rxjs';

import { FormControl, NgForm } from '@angular/forms';


@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit {

  sh_popup: boolean = false;
  sh_confirm_pop: boolean = false;

  placement_search: string = "";

  msel_placement_ids: string[] = [];
  msel_placement_id: string = "";
  msel_id_nos: number = 0;

  msel_all_footer: boolean = true;
  mfoot_sel_all: any = 0;

  company_lists: CompanyLists[];
  company_lists_selected: any;

  company_name: string;
  email: string;
  website: string;

  companylistObj_sub: Subscription;

  edit_id: string = '';
  delete_id: string = '';

  isAddRecord: boolean = true;

  isSingleDelBtn: boolean = false;

  constructor(private companylistsObj: CompanyListsObj,
    private filterService: FilterServ
    ) { }

  ngOnInit() {


    this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;
    });

    
    this.filterService.rpopupConfirmCall().subscribe((b) => {
      this.sh_confirm_pop = b;
    });

    this.filterService.rmselAllFooter().subscribe((c) => {
      this.msel_all_footer = c;
    })

    this.companylistsObj.getCompanies();
    this.companylistObj_sub = this.companylistsObj.getUpdatedCompanies()
      .subscribe((company_lists: CompanyLists[]) => {
        this.company_lists = company_lists;
    })

      this.filterService.rplacementSearchGet().subscribe((placement_search) => {
      this.placement_search = placement_search;
    });

      this.company_lists_selected = {
        company_name: "",
        email: "",
        website: ""
      }

  }

  closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }


  closePop(){
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }
  }
  shMselFooter() {

    if (this.msel_all_footer == false) {
      this.msel_all_footer = true;
    } else {
      this.msel_all_footer = false;
    }
      for (let b = 0; b < this.company_lists.length; b++) {
      this.company_lists[b].is_selected = 0;
      this.msel_placement_ids.pop();
      this.msel_id_nos = 0;
    }
  }

 shMConfirmPop() {
    this.filterService.popupConfirmCall(this.sh_confirm_pop);
    this.isSingleDelBtn = false;
  }


  msel_foot_selectall(event: Event) {

    for (let b = 0; b < this.company_lists.length; b++) {
      this.company_lists[b].is_selected = this.mfoot_sel_all;
    }

    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {

      if (this.msel_placement_ids.length == 0) {
        this.msel_id_nos = 0;
        for (let i = 0; i < (this.company_lists.length); i++) {
          this.msel_placement_ids.push(this.company_lists[i].id);
          this.company_lists[i].is_selected = 1;

        }
        this.msel_id_nos = this.company_lists.length;
      } else {
        this.msel_id_nos = 0;

        let ids_len = this.msel_placement_ids.length;
        for (let a = 0; a < (ids_len); a++) {
          this.msel_placement_ids.pop();

        }
        for (let i = 0; i < (this.company_lists.length); i++) {
          this.msel_placement_ids.push(this.company_lists[i].id);

        }
        this.msel_id_nos = this.company_lists.length;

      }

      console.log(this.msel_placement_ids);

    } else {

      let ids_len = this.msel_placement_ids.length;
      for (let a = 0; a < (ids_len); a++) {
        this.msel_placement_ids.pop();
        this.company_lists[a].is_selected = 0;

      }
      this.msel_id_nos = 0;
      console.log(this.msel_placement_ids);


    }


    console.log("1");
  }

  multiDeleteExistPlacement(event: Event) {

    this.msel_all_footer = false;

    this.msel_placement_id = ((event.currentTarget) as HTMLElement).id;

    this.mfoot_sel_all = this.company_lists.every((item: any) => {
      return item.is_selected == 1;
    });
    this.mselGetCheckedList(event, this.msel_placement_id);

  }

  mselGetCheckedList(event: Event, msel_placement_id: string) {


    if (((event.target) as HTMLInputElement).checked) {

      this.msel_placement_ids.push(this.msel_placement_id);
      this.msel_id_nos++;

      for (let sel_all = 0; sel_all < this.company_lists.length; sel_all++) {
        if (this.company_lists[sel_all].is_selected === 1) {
          this.mfoot_sel_all = true;

        }
      }

    } else {
      let msel_arr_ind = this.msel_placement_ids.indexOf(this.msel_placement_id);

      if (msel_arr_ind > -1) {
        this.msel_placement_ids.splice(msel_arr_ind, 1);
        // this.msel_placement_ids.removeAt(msel_arr_ind);
      }
      this.msel_id_nos--;

      if (this.msel_id_nos == 0) {
        this.msel_all_footer = true;
      }

      // this.msel_placement_ids.pop(this.msel_placement_id);
    }
    console.log(this.msel_placement_ids);

  }


  multiDeleteCallService() {

    this.companylistsObj.multiDeletePlacement(this.msel_placement_ids);
    this.msel_id_nos = 0;

    if (this.msel_id_nos == 0) {
      this.msel_all_footer = true;
    }
    this.closeConfirmPop();

  }

  createCompany(form: NgForm){
    this.companylistsObj.createCompany(
          this.company_name = form.value.company_name,
          this.email = form.value.company_email,
          this.website = form.value.company_website
      );
    this.sh_popup = false;
    form.resetForm();
  }

  getEditedCompany(event: Event) {
    this.isAddRecord = false;
    this.edit_id = ((event.currentTarget) as HTMLElement).id;

    this.company_lists.find((c_obj) => {
        if(c_obj.id === this.edit_id){
            this.company_lists_selected = c_obj;
        }
      
    });
    this.sh_popup = true;


  }

  callEditedCompanyService(form: NgForm) {
        let company_lists_selected = {
          company_name: form.value.company_name,
          email: form.value.company_name,
          website: form.value.company_name,

        }

        this.companylistsObj.editCompany( this.edit_id , company_lists_selected);
  }

  deleteCompany(event: Event){
      this.isSingleDelBtn = true;
      this.filterService.popupConfirmCall(this.sh_confirm_pop); 
      this.delete_id = ((event.currentTarget) as HTMLElement).id;
  }

  callDeleteCompany() {
      this.companylistsObj.deleteCompany(this.delete_id);
      this.closeConfirmPop();
  }

  multiDeleteCompany(){
      this.isSingleDelBtn = false;

  }

}
