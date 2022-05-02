import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  @Input('appTooltip') tooltip = "";
  @Input() delay? = 100;

  tooltipPop: any;
  timer: any;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.timer = setTimeout(() => {
      let x = this.el.nativeElement.getBoundingClientRect().left + this.el.nativeElement.offsetWidth / 1.9;
      let y = this.el.nativeElement.getBoundingClientRect().top + this.el.nativeElement.offsetHeight - 45;
      this.createTooltipPopup(x, y);
    }, this.delay) 
  }

  @HostListener('mouseleave') onMouseLeave() {
    if(this.timer) {
      clearTimeout(this.timer);
    }
    if(this.tooltipPop) {
      this.tooltipPop.remove();
    }
  }

  private createTooltipPopup(x: number, y: number) {
    let gen_pop = document.createElement('div');
    gen_pop.innerHTML = this.tooltip;
    gen_pop.setAttribute("class", "ico-tooltip");
    gen_pop.style.top = y.toString() + "px";
    gen_pop.style.left = x.toString() + "px";
    document.body.appendChild(gen_pop);
    this.tooltipPop = gen_pop;
    setTimeout(() => {
      if(this.tooltipPop){
          this.tooltipPop.remove();
      }
    }, 5000)
  }

}
