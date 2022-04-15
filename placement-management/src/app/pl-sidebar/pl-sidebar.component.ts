import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';


@Component({
  selector: 'app-pl-sidebar',
  templateUrl: './pl-sidebar.component.html',
  styleUrls: ['./pl-sidebar.component.scss']
})
export class PlSidebarComponent implements OnInit {

  side_nav_expmin: boolean = false;

  constructor(private filterService: FilterServ) { }

  ngOnInit() {
  }

  sidenavExpmin(side_nav_expmin: boolean){
    if(this.side_nav_expmin == false){
        this.side_nav_expmin = true;
    }
    else {
      this.side_nav_expmin = false;
    }
    this.filterService.sidenavExpmin(this.side_nav_expmin);
  }

}
