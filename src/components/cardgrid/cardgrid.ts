import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DealsProvider } from "../../providers/deals/deals";
import { take, tap, map } from "rxjs/operators";
import { SharedProvider } from "../../providers/shared/shared";

/**
 * Generated class for the CardgridComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "cardgrid",
  templateUrl: "cardgrid.html"
})
export class CardgridComponent {
  text: string;
  items: any = [];

  constructor(private dealsProvider: DealsProvider, private sharedProvider: SharedProvider) {
    // this.dealsProvider
    //   .getStoreCategory()
    //   .pipe(take(1))
    //   .subscribe((res: any) => {
    //     this.items = res;
    //     console.log(this.items);
    //   });
    this.dealsProvider
      .getTopStores()
        .subscribe((res: any) => {
        this.items = res;
        console.log(this.items);})
  }

  goToStore(data){
  this.sharedProvider.openBrowser(data);
  }
}
