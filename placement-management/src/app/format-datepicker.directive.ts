import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
	selector: '[setOutputDateFormat]'
})

export class DateFormatDirective {
	@Input('setOutputDateFormat') inputFormat = '';

	@Output() dateChangeWithFormat = new EventEmitter<string>();

	constructor(){}

	@HostListener('dateChange', ['$event'])
	onDateChange(event: any) {
		if(event.value === null){
			const dateFormattedEmpty = "";
			this.dateChangeWithFormat.emit(dateFormattedEmpty);

			console.log("1" +event.value);
		}
		else {
			console.log("2" +event.value);

		const dateFormatted = event.value.format(this.inputFormat);
		this.dateChangeWithFormat.emit(dateFormatted);
			console.log("3"+dateFormatted);

		}


	}
}