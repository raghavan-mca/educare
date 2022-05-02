import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placementSearch'
})
export class PlacementSearchPipe implements PipeTransform {

  
   transform(placement_search_data: any[] , placement_search: string): any[]{
    if(!placement_search_data){
      return [];

    }
    if(!placement_search){
      return placement_search_data;

    }
    placement_search = placement_search.toLocaleLowerCase();

    return placement_search_data.filter( (filter_data) => {

      return (filter_data.company_name).toLocaleLowerCase()
        .includes(placement_search);

    })
  }
}
