import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';

import { Options } from "@angular-slider/ngx-slider";


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  sal_value = 150000;
  sal_highValue = 900000;
  sal_options: Options = {
    floor: 100000,
    ceil: 900000,
    step: 50000,
    showSelectionBarEnd: true
  };

  tenth_mival = 10;
  tenth_maval = 100;
  tenth_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  twelth_mival = 10;
  twelth_maval = 100;
  twelth_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  ug_mival = 10;
  ug_maval = 100;
  ug_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  pg_mival = 10;
  pg_maval = 100;
  pg_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  dip_mival = 10;
  dip_maval = 100;
  dip_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  selopenb: boolean = false;
  selopen_mon: boolean = false;
  selopen_yr: boolean = false;

  percent_disable: boolean = false;

  filter_header: number;

  salselected: String;
  s_mon_selected: String;
  s_yr_selected: String;

  sv_1: string;
  sv_2: string;

  d_no: number = 0;
  filter_expmin: boolean;
  filter_res_expmin: boolean;
  filter_expminup: boolean= true;

  sel_date: SelDate[];
  sel_month: SelMonth[];
  sel_year: SelYear[];
    h: number = 0;
    g: number;
    i: number = 1;
    a: any;

  placement_date: string = '';

  slider_val_1: string = "1k";
  slider_val_2: string = "6k";

  constructor(private filterService: FilterServ) {


  }


  ngOnInit() {

  this.selDateNo();

  this.selMonthNo();
  this.selYearNo();



    this.salselected = "1";
    this.s_mon_selected = "1";
    this.s_yr_selected = "2000";

    this.filterService.rfilterExpMin().subscribe( (f) => {
      this.filter_expmin = f;

    } );

     this.filterService.rfilterResExpmin().subscribe( (g) => {
      this.filter_res_expmin = g;

    } );
    


  }

    placementDate(placement_date_val: string){
      this.placement_date = placement_date_val;
    console.log(this.placement_date);
      
    }

  filterClose(){
     this.filterService.filterExpMin(this.filter_expmin);
  }  

  // selectbox

  selopen() {
    if (this.selopenb == false) {
      this.selopenb = true;
    } else {
      this.selopenb = false;
    }
  }

  selopenMon() {
    if (this.selopen_mon == false) {
      this.selopen_mon = true;
    } else {
      this.selopen_mon = false;
    }
  }

   selopenYr() {
    if (this.selopen_yr == false) {
      this.selopen_yr = true;
    } else {
      this.selopen_yr = false;
    }
  }


  selectedOption(event: Event) {
    this.salselected = (event.target as HTMLElement).innerText;
  }

  selectedOptionMonth(event: Event) {
    this.s_mon_selected = (event.target as HTMLElement).innerText;
  }

  selectedOptionYear(event: Event) {
    this.s_yr_selected = (event.target as HTMLElement).innerText;
  }  


  getSliderValue1(event: Event){
      this.sv_1 = (event.target as HTMLInputElement).value;


      this.slider_val_1 = ( parseInt(this.sv_1) / 100000 ) + "k";

  }

   getSliderValue2(event: Event){
      this.sv_2 = (event.target as HTMLInputElement).value;

      this.slider_val_2 = ( parseInt(this.sv_2) / 100000 ) + "k";


  }

   selDateNo(){

    this.sel_date = [

          { id: "sd1", sd_no: 1 },
          { id: "sd2", sd_no: 2 },
          { id: "sd3", sd_no: 3 },
          { id: "sd4", sd_no: 4 },
          { id: "sd5", sd_no: 5 },
          { id: "sd6", sd_no: 6 },
          { id: "sd7", sd_no: 7 },
          { id: "sd8", sd_no: 8 },
          { id: "sd9", sd_no: 9 },
          { id: "sd10", sd_no: 10 },
          { id: "sd11", sd_no: 11 },
          { id: "sd12", sd_no: 12 },
          { id: "sd13", sd_no: 13 },
          { id: "sd14", sd_no: 14 },
          { id: "sd15", sd_no: 15 },
          { id: "sd16", sd_no: 16 },
          { id: "sd17", sd_no: 17 },
          { id: "sd18", sd_no: 18 },
          { id: "sd19", sd_no: 19 },
          { id: "sd20", sd_no: 20 },
          { id: "sd21", sd_no: 21 },
          { id: "sd22", sd_no: 22 },
          { id: "sd23", sd_no: 23 },
          { id: "sd24", sd_no: 24 },
          { id: "sd25", sd_no: 25 },
          { id: "sd26", sd_no: 26 },
          { id: "sd27", sd_no: 27 },
          { id: "sd28", sd_no: 28 },
          { id: "sd29", sd_no: 29 },
          { id: "sd30", sd_no: 30 },
          { id: "sd31", sd_no: 31 },


    ];
  }


     selMonthNo(){

    this.sel_month = [

          { id: "sm1", sm_no: 1 },
          { id: "sm2", sm_no: 2 },
          { id: "sm3", sm_no: 3 },
          { id: "sm4", sm_no: 4 },
          { id: "sm5", sm_no: 5 },
          { id: "sm6", sm_no: 6 },
          { id: "sm7", sm_no: 7 },
          { id: "sm8", sm_no: 8 },
          { id: "sm9", sm_no: 9 },
          { id: "sm10", sm_no: 10 },
          { id: "sm11", sm_no: 11 },
          { id: "sm12", sm_no: 12 },

    ];



   // for(this.d_no = 0; this.d_no<32; this.d_no++){

   //  this.sel_date[] = {

   //      id: "sd" + this.d_no,
   //      sd_no: this.d_no

   //   };

   //  }

   //  return this.sel_date;

  }

   selYearNo(){

    for(this.h=1; this.h<2; this.h++){

    this.a = [
    {
        id: "sy0",
        sy_no: 2000 
      }
      ];


    for(this.g=2001; this.g<=2200; this.g++){

      this.a.push({id: "sy" + this.i++, sy_no: this.g});

  }

    };

      this.sel_year = this.a;

};
 
  filterResExpmin(filter_res_expmin: boolean) {
     if (this.filter_res_expmin == false || this.filter_expminup == false) {

      this.filter_res_expmin = true;

      this.filter_expminup = true;

      // return this.filter_expmin;

    } else {

      this.filter_res_expmin = false;
      this.filter_expminup = false;

      // return this.filter_expmin;
    }

    this.filterService.filterResExpmin(this.filter_res_expmin);

  }
      
  // ngAfterViewInit(){
  
  //   this.filterhead.nativeElement.classList.remove("filter-expmin");

  //   this.filter_header = this.filterhead.nativeElement.offsetHeight;
  //   console.log(this.filterhead.nativeElement.offsetHeight);
  //   this.filterService.filterHeadExpmin(this.filter_header);

  //   console.log(this.filterhead.nativeElement.className);
  // }

  percentDisable(){
    if(this.percent_disable == false){
      this.percent_disable = true;
    }
    else {
      this.percent_disable = false;
    }
  }

  // slider1 = document.querySelector("#slider1") !as HTMLInputElement;
  // slider2 = document.querySelector("#slider2") !as HTMLInputElement;



  //  slider1_inpval = parseInt(this.slider1.value)!;

  //  slider2_inpval = parseInt(this.slider2.value)!;





  // slider_val1 = document.getElementById("range_val1") !;
  // slider_val2 = document.getElementById("range_val2") !;

  // min_gap = 0;

  // slideOne() {

  //   if (parseInt(this.slider2.value) - parseInt(this.slider1.value) <= this.min_gap) {

  //     this.slider1_inpval = parseInt(this.slider2.value) - this.min_gap;

  //   }
  //   this.slider_val1.textContent = this.slider1.value;
  // }

  // slideTwo() {

  //   if (parseInt(this.slider2.value) - parseInt(this.slider1.value) <= this.min_gap) {

  //     this.slider2_inpval = parseInt(this.slider1.value) + this.min_gap;

  //   }
  //   this.slider_val2.textContent = this.slider2.value;

  // }

  //  this.slideOne();
  // this.slideTwo();



}



class SelDate{

  id: string;
  sd_no: number;

}


class SelMonth{

  id: string;
  sm_no: number;

}


class SelYear{

  id: string;
  sy_no: number;

}
