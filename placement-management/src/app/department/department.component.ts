import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import {StudentsListObj} from '../services/students-list.service';

import {NgForm} from '@angular/forms';

import {DepartmentLists} from '../shared/listing.model';
import {Batches} from '../shared/listing.model';

import {Subscription} from 'rxjs';

import {DepartmentList} from '../services/department-list.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss',
              '../placement-listing/placement-listing.component.scss'
              ]
})
export class DepartmentComponent implements OnInit {

  dep_lists: DepartmentLists[] = [];

  selected_dep: any;

  dep_id: string = "";

  department_name: string = "";
  category: string = "";
  duration: string = "";
  department_head: string = "";
  incharge: string = "";
  incharge_phone: string = "";
  incharge_mail: string = "";

  dep_lists_Obj: Subscription;

  isAddRecordBtn: boolean = true;

  sh_popup: boolean = false;
  sh_confirm_pop: boolean = false;
  dep_sett: boolean = false;

  dep_category: any = ["UG", "PG", "Diploma"];
  dep_selected: string;
  dep_sel: boolean = true; 

  batches: Batches[];
  batches_subj: Subscription;


  constructor(private filterService: FilterServ,
              private depService: DepartmentList,
              private studentService: StudentsListObj,
              private route: Router
    ) { }

  ngOnInit() {   

    // this.studentService.getBatches();
    this.batches_subj = this.studentService.getUpdateBatches()
      .subscribe((a) => {
        this.batches = a;
        console.log(this.batches);

      })
    

    this.selected_dep = {
        "department_name": "",
        "department_head": "",
        "category": "",
        "duration": "",
        "incharge": "",
        "incharge_phone": "",
        "incharge_mail": ""
    }

     this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;
      this.isAddRecordBtn = true;
    });

    this.depService.getDepartments();
    this.dep_lists_Obj = this.depService.getUpdateDepartments()
      .subscribe((dep_data: DepartmentLists[]) => {

        this.dep_lists = dep_data;
      })
  }

   closePop(){
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

  addDepartment(dep_form: NgForm){

      this.depService.addDepartmentServ(
        dep_form.value.department_name,
        dep_form.value.department_head,
        this.dep_selected,
        dep_form.value.duration,
        dep_form.value.incharge,
        dep_form.value.incharge_phone,
        dep_form.value.incharge_mail
        );


  }

  editExistDepartment(event: Event){

    this.isAddRecordBtn = false;
    this.dep_id = (event.currentTarget as HTMLElement).id;
    console.log(this.dep_id);


    for(let i=0; i< this.dep_lists.length; i++) {

      if(this.dep_id == this.dep_lists[i]._id){
        this.selected_dep = this.dep_lists[i];
        console.log(this.selected_dep);

      }
    }
    this.sh_popup = true;
  }

  editDepartment(form: NgForm) {
    let selected_dep = {
        department_name: form.value.department_name,
        department_head: form.value.department_head,
        category: this.dep_selected,
        duration: form.value.duration,
        incharge: form.value.incharge,
        incharge_phone: form.value.incharge_phone,
        incharge_mail: form.value.incharge_mail
    }

    this.depService.updateDepartment(this.dep_id, selected_dep);
    this.sh_popup = false;
  }

  deleteDepartment() {
    this.sh_confirm_pop = true;
  }

  openDepControl(){
    this.dep_sett = true;
  }

  closeDepControl(){
    this.dep_sett = false;
  }

  loadStudents(event: Event) {
    event.stopPropagation();
    this.dep_id = ((event.currentTarget) as HTMLElement).id;

    this.studentService.getBatches(this.dep_id);
    this.route.navigateByUrl('students-listing');
  }

  selDepCategory() {
    if (this.dep_sel == false) {
      this.dep_sel = true;

    } else {
      this.dep_sel = false;
    }
  }

  loadDepCategory(event: Event) {

    let dep_catg = ((event.currentTarget) as HTMLElement).id;
    if(dep_catg == "0") {
    this.dep_selected = "UG";
    }
    else if(dep_catg == "1") {
    this.dep_selected = "PG";
    }
    if(dep_catg == "2") {
    this.dep_selected = "Diploma";
    }

  }

}
