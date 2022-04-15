import { Component, OnInit } from '@angular/core';

import { FilterServ } from './services/filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'placement-management';

  side_nav_expmin: boolean;

  constructor(private filterService: FilterServ){
 
  }

  ngOnInit(){
      this.filterService.rsidenavExpmin().subscribe( (e) => {
      this.side_nav_expmin = e;
    } );
  }


}
