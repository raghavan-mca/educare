import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import { PlacementListObj } from '../services/placements-list.service';
import { CompanyListsObj } from '../services/company-list.service';



import { Subscription } from 'rxjs';

import { PlacementList } from '../shared/listing.model';
import { CompanyLists } from '../shared/listing.model';


import { HttpClient } from '@angular/common/http';

import { NgForm } from '@angular/forms';

import { Salary } from '../shared/listing.model';

import { DateFormatDirective } from '../format-datepicker.directive';

@Component({
  selector: 'app-placement-listing',
  templateUrl: './placement-listing.component.html',
  styleUrls: ['./placement-listing.component.scss']
})
export class PlacementListingComponent implements OnInit {

  placement_list: PlacementList[];


  selected_placement: any;
  sel_placement_id: string;

  comp_search_txt: string = "";
  placement_search:string = "";

  msel_placement_ids: string[] = [];
  msel_placement_id: string = "";
  msel_id_nos: number = 0;

  msel_all_footer: boolean = true;
  mfoot_sel_all: any = 0;

  date = new Date();
  outputDateFormat = 'yyyy-MM-DD';



  place_date: string = "";
  register_date: string = "";

  placementlistObj_sub: Subscription;

  shSelectBox: boolean;
  sh_popup: boolean;
  sh_confirm_pop: boolean;
  confirm_ok: boolean = true;


  filter_expmin: boolean;
  filter_res_expmin: boolean;
  loopel: Number[];
  filter_header: number;

  company_name: string = "";
  company_email: string = "";
  job_role: string = "";
  placement_date: string = "";

  registration_date: string = "";
  registration_link: string = "";
  location: string = "";
  percentage: {
    ten: number;
    twelve: number;
    ug: number;
    pg: number;
    diploma: number;
  };
  open_check: boolean;
  open_to_all: number = 0;

  company_name_list: CompanyLists[];
  c_id: string;
  c_names: string[] = [];
  c_ids: string[] = [];
  cname_sel_oh: boolean;

  pop_openall_fade: boolean = false;

  isAddRecordBtn: boolean;
  isSingleDelBtn: boolean = true;

  date_transformed: string = '';


  constructor(
    private filterService: FilterServ,
    public placementlistObj: PlacementListObj,
    public companylistsObj: CompanyListsObj
  ) {

  }

  ngOnInit() {


    this.filterService.rfilterExpMin().subscribe((f) => {
      this.filter_expmin = f;

    });

    this.filterService.rfilterResExpmin().subscribe((c) => {
      this.filter_res_expmin = c;

    });

    this.filterService.selectboxCloseCall().subscribe((selbox_call) => {
      this.shSelectBox = selbox_call;
    });


    this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;

    });

    this.filterService.rpopupConfirmCall().subscribe((shpopup_confirm_call) => {
      this.sh_confirm_pop = shpopup_confirm_call;

    });

    this.filterService.rmselAllFooter().subscribe((msel_all_footer_call) => {
      this.msel_all_footer = msel_all_footer_call;
    });

    this.filterService.rplacementSearchGet().subscribe((placement_search) => {
      this.placement_search = placement_search;
    });

    this.placementlistObj.getPlacements();
    this.placementlistObj_sub = this.placementlistObj.getUpdatePlacements()
      .subscribe((placement_list: PlacementList[]) => {
        this.placement_list = placement_list;
      });

    this.filterService.rgetAddRecordFn().subscribe((addRecCall) => {
      this.isAddRecordBtn = addRecCall;
    });



    this.selected_placement = {
      "company_name": "",
      "job_role": "",
      "placement_date": "",
      "registration_date": "",
      "salary": {
        "min_salary": null,
        "max_salary": null
      },
      "registration_link": "",
      "company_website": "",
      "location": "",
      "company_email": "",
      "percentage": {
        "ten": null,
        "twelve": null,
        "ug": null,
        "pg": null,
        "diploma": null
      },
      "open_to_all": 0
    }

    this.companylistsObj.getCompanies();
    this.companylistsObj.getUpdatedCompanies()
      .subscribe((company_names) => {
        this.company_name_list = company_names;
        for (let i = 0; i < this.company_name_list.length; i++) {


          this.c_names.push(this.company_name_list[i].company_name);
          this.c_ids.push(this.company_name_list[i].id);
        }
      });

    this.filterService.rgetCnameSelsh().subscribe((cname_sel_oh) => {
      this.cname_sel_oh = cname_sel_oh;
    });

  }

  // customFormReset(createPlacementForm: NgForm){

  //   this.placement_list = [
  //   {

  //   company_name: "",
  //     company_email: "",
  //     company_website: "",
  //     job_role: "",
  //     placement_date: "",
  //     salary: {
  //       min_salary: null,
  //       max_salary: null
  //     },
  //     location: "",
  //     open_to_all: 0,
  //     registration_date: "",
  //     registration_link: "",
  //     percentage: {
  //       ten: null,
  //       twelve: null,
  //       ug: null,
  //       pg:null,
  //       diploma: null
  //     }
  //   }

  //   ]

  // }

  cname_sel_sh() {
    if (this.cname_sel_oh == true) {
      this.cname_sel_oh = false;
    } else {
      this.cname_sel_oh = true;
    }
  }

  cpop_perc_fade() {
    if (this.pop_openall_fade == true) {
      this.pop_openall_fade = false;
    } else {
      this.pop_openall_fade = true;
    }
  }


  cnameInputClick(event: Event) {
    if ((((event.target) as HTMLInputElement).value) != "") {
      this.cname_sel_oh = false;

    }
    if ((((event.target) as HTMLInputElement).value) == "") {
      this.cname_sel_oh = true;

    }

  }

  closePop() {
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }

  }

  closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }

  delConfirm() {

    if (this.confirm_ok == false) {
      this.confirm_ok = true;
    } else {
      this.confirm_ok = false;
    }
    return this.confirm_ok;
  }

  getOpenToAll(event: Event) {

    if ((event.target as HTMLInputElement).checked == true) {
      this.open_to_all = 1;
    } else {
      this.open_to_all = 0;

    }
    this.cpop_perc_fade();
  }

  shMselFooter() {
    

    if (this.msel_all_footer == false) {
      this.msel_all_footer = true;
    } else {
      this.msel_all_footer = false;
    }
     for (let b = 0; b < this.placement_list.length; b++) {
      this.placement_list[b].is_selected = 0;
      this.msel_placement_ids.pop();
      this.msel_id_nos = 0;
    }
  }

  updatePlacementDate(dateObject: any) {
    if(dateObject !== ""){
    this.place_date = dateObject;
    console.log(dateObject);
    }

  }
  updateRegistrationEndDate(dateObject: any) {
    this.register_date = dateObject;
  }


  createNewPlacement(createPlacementForm: NgForm) {


    this.placementlistObj.addPlacements(
      createPlacementForm.value.company_name,
      createPlacementForm.value.company_email,
      createPlacementForm.value.company_website,
      createPlacementForm.value.job_role,
      this.place_date,
      createPlacementForm.value.min_salary,
      createPlacementForm.value.max_salary,
      this.register_date,
      createPlacementForm.value.registration_link,
      createPlacementForm.value.location,
      this.open_to_all,
      createPlacementForm.value.ten,
      createPlacementForm.value.twelve,
      createPlacementForm.value.ug,
      createPlacementForm.value.pg,
      createPlacementForm.value.diploma
    );
    console.log(this.placement_list);
    createPlacementForm.resetForm();
    this.closePop();
  }

  editExistPlacement(event: Event) {
    this.sel_placement_id = ((event.currentTarget) as Element).id;

    this.placement_list.find((sel_id) => {
      if (sel_id.placement_id === this.sel_placement_id) {
        this.selected_placement = sel_id;

        this.filterService.popupOpenCall(this.sh_popup);
        this.comp_search_txt = this.selected_placement.company_name;

      }

    });
    this.isAddRecordBtn = false;
    console.log(this.placement_list);
  };

  getEditedValue(form: NgForm) {


    let selected_placement = {
      company_name: form.value.company_name,
      company_email: form.value.company_email,
      company_website: form.value.company_website,
      job_role: form.value.job_role,
      placement_date: this.place_date,
      salary: {
        min_salary: form.value.min_salary,
        max_salary: form.value.max_salary,
      },
      registration_date: this.register_date,
      registration_link: form.value.registration_link,
      location: form.value.location,
      open_to_all: this.open_to_all,
      percentage: {
        ten: form.value.ten,
        twelve: form.value.twelve,
        ug: form.value.ug,
        pg: form.value.pg,
        diploma: form.value.diploma
      }

    }
    console.log(selected_placement);

    this.placementlistObj.editPlacement(
      this.sel_placement_id,
      selected_placement);

    this.closePop();
        form.resetForm();
  };

  deleteExistPlacement(event: Event) {

    this.filterService.popupConfirmCall(this.sh_confirm_pop);

    this.sel_placement_id = ((event.currentTarget) as Element).id;

  }

  delCallService() {
    this.placementlistObj.deletePlacement(this.sel_placement_id);
    this.closeConfirmPop();

  }

  shMConfirmPop() {
    this.filterService.popupConfirmCall(this.sh_confirm_pop);
    this.isSingleDelBtn = false;
  }

  msel_foot_selectall(event: Event) {

    for (let b = 0; b < this.placement_list.length; b++) {
      this.placement_list[b].is_selected = this.mfoot_sel_all;
    }

    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {

      if (this.msel_placement_ids.length == 0) {
        this.msel_id_nos = 0;
        for (let i = 0; i < (this.placement_list.length); i++) {
          this.msel_placement_ids.push(this.placement_list[i].placement_id!);
          this.placement_list[i].is_selected = 1;

        }
        this.msel_id_nos = this.placement_list.length;
      } else {
        this.msel_id_nos = 0;

        let ids_len = this.msel_placement_ids.length;
        for (let a = 0; a < (ids_len); a++) {
          this.msel_placement_ids.pop();

        }
        for (let i = 0; i < (this.placement_list.length); i++) {
          this.msel_placement_ids.push(this.placement_list[i].placement_id!);

        }
        this.msel_id_nos = this.placement_list.length;

      }

      console.log(this.msel_placement_ids);

    } else {

      let ids_len = this.msel_placement_ids.length;
      for (let a = 0; a < (ids_len); a++) {
        this.msel_placement_ids.pop();
        this.placement_list[a].is_selected = 0;

      }
      this.msel_id_nos = 0;
      console.log(this.msel_placement_ids);


    }


    console.log("1");
  }

  multiDeleteExistPlacement(event: Event) {


    this.msel_all_footer = false;

    this.msel_placement_id = ((event.currentTarget) as HTMLElement).id;

    this.mfoot_sel_all = this.placement_list.every((item: any) => {
      return item.is_selected == 1;
    });
    this.mselGetCheckedList(event, this.msel_placement_id);

  }

  mselGetCheckedList(event: Event, msel_placement_id: string) {


    if (((event.target) as HTMLInputElement).checked) {

      this.msel_placement_ids.push(this.msel_placement_id);
      this.msel_id_nos++;

      for (let sel_all = 0; sel_all < this.placement_list.length; sel_all++) {
        if (this.placement_list[sel_all].is_selected === 1) {
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

    this.placementlistObj.multiDeletePlacement(this.msel_placement_ids);
    this.msel_id_nos = 0;

    if (this.msel_id_nos == 0) {
      this.msel_all_footer = true;
    }
    this.closeConfirmPop();

  }

  getCompanyid(event: Event, form: NgForm) {

    this.c_id = (event.currentTarget as HTMLElement).id;

    for (let i = 0; i < this.company_name_list.length; i++) {


      if (this.c_id == this.company_name_list[i].id) {

        form.value.company_email = this.company_name_list[i].email;
        this.selected_placement.company_email = this.company_name_list[i].email;
        this.selected_placement.company_website = this.company_name_list[i].website;
        this.comp_search_txt = this.company_name_list[i].company_name;
        this.cname_sel_sh();
      }

    }

  }


}

