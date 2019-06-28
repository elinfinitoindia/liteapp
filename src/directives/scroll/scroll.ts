import { Content } from "ionic-angular";
import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  SimpleChanges
} from "@angular/core";

@Directive({
  selector: "[scrollHide]"
})
export class ScrollDirective {
  @Input("scrollHide") config: ScrollHideConfig;
  @Input("scrollContent") scrollContent: Content;

  contentHeight: number;
  scrollHeight: number;
  lastScrollPosition: number;
  lastValue: number = 0;
  co;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollContent && this.config) {
      this.scrollContent.ionScrollStart.subscribe(ev => {
        this.contentHeight = this.scrollContent.getScrollElement().offsetHeight;
        this.scrollHeight = this.scrollContent.getScrollElement().scrollHeight;
        if (this.config.maxValue === undefined) {
          this.config.maxValue = this.element.nativeElement.offsetHeight;
        }
        this.lastScrollPosition = ev.scrollTop;
      });
      this.scrollContent.ionScroll.subscribe(ev =>
        this.adjustElementOnScroll(ev)
      );
      this.scrollContent.ionScrollEnd.subscribe(ev =>
        this.adjustElementOnScroll(ev)
      );
    }
  }

  private adjustElementOnScroll(ev) {
    if (ev) {
      ev.domWrite(() => {
        let scrollTop: number = ev.scrollTop > 0 ? ev.scrollTop : 0;
        let scrolldiff: number = scrollTop - this.lastScrollPosition;
        this.lastScrollPosition = scrollTop;
        // let newValue = this.lastValue + scrolldiff;
        // newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
        // this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
        // console.log(this.element.nativeElement.children[0].children[0], "background", "white");
        // this.lastValue = newValue;
        if (scrollTop !== 0) {
          if (scrolldiff < 0) {
            this.co = "orange";
        
            this.renderer.removeClass(
              this.element.nativeElement.children[0].children[2].children[0],
              "notitle"
            );
            this.renderer.addClass(
              this.element.nativeElement.children[0].children[0],
              "addBackground"
            );
            this.renderer.addClass(
              this.element.nativeElement.children[0].children[2].children[0]
                .children[0].children[0]
             ,
              "addcolortitle"
            );
          }
          if (scrolldiff > 0) {
  
            this.renderer.removeClass(
              this.element.nativeElement.children[0].children[0],
              "addBackground"
            );
            this.renderer.removeClass(
              this.element.nativeElement.children[0].children[2].children[0]
                .children[0].children[0],
              "addcolortitle"
            );
            this.renderer.addClass(
              this.element.nativeElement.children[0].children[2].children[0],
              "notitle"
            );
            // this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
          }
        } else {
          this.renderer.removeClass(
            this.element.nativeElement.children[0].children[0],
            "addBackground"
          );
            this.renderer.removeClass(
              this.element.nativeElement.children[0].children[2].children[0]
                .children[0].children[0],
              "addcolortitle"
            );
        }
      });
    }
  }
}
export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}
