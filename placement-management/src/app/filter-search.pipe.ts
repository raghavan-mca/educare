import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSearch'
})
export class FilterSearchPipe implements PipeTransform {


   transform(company_name_list: any[] , comp_search_txt: string): any[]{
    if(!company_name_list){
      return [];

    }
    if(!comp_search_txt){
      return company_name_list;

    }
    comp_search_txt = comp_search_txt.toLocaleLowerCase();

    return company_name_list.filter( (filter_data) => {

      return (filter_data.company_name).toLocaleLowerCase().includes(comp_search_txt);

    })
  }

}
