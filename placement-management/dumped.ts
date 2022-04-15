 multiDeleteExistPlacement(event: Event) {

    this.msel_all_footer = false;

    this.msel_placement_id = (((event.currentTarget) as HTMLInputElement).id) !;
    // console.log(((event.target) as HTMLInputElement).checked);

    // console.log(this.msel_placement_id);
    if (((event.target) as HTMLInputElement).checked) {

      this.msel_placement_ids.push(this.msel_placement_id);
      this.msel_id_nos++;

      console.log(this.msel_placement_ids);


        for(let sel_all=0; sel_all< this.placement_list.length; sel_all++){
            if(this.placement_list[sel_all].is_selected === 1) {
             this.mfoot_sel_all = true;
             console.log(this.mfoot_sel_all);
             console.log(this.placement_list[sel_all].is_selected);

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

      console.log(this.msel_placement_ids);


      // this.msel_placement_ids.pop(this.msel_placement_id);
    }

  }

  msel_foot_selectall(event: Event) {


    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {
  
      if (this.msel_placement_ids.length == 0) {
        this.msel_id_nos = 0;
        for (let i = 0; i < (this.placement_list.length); i++) {
          this.msel_placement_ids.push(this.placement_list[i].placement_id);
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
          this.msel_placement_ids.push(this.placement_list[i].placement_id);

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
}

