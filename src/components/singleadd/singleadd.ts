import { Component, Input, OnInit } from "@angular/core";
import { DealsProvider } from "../../providers/deals/deals";
import { ModalController } from "ionic-angular";

@Component({
  selector: "singleadd",
  templateUrl: "singleadd.html"
})
export class SingleaddComponent implements OnInit {
  text: string;
  slide: any = [];
  singleLength;
  show = 5;
  item: any;
  @Input() in: number;
  constructor(private dealService: DealsProvider , private modalController: ModalController) {}

  ngOnInit() {
    console.log("Basic Value " + this.in);
    if (this.in != 0) {
      this.in = this.in / 3;
    }
    if (this.slide.length <= 0) {
      this.getAdds();
    } else {
      this.item = this.slide[this.in];
    }
    console.log(this.in);
  }

  getAdds() {
    this.dealService.getTopStores().subscribe((res: any) => {
      this.slide = res;
      this.item = this.slide[this.in];
      this.singleLength = this.slide.length;
    });
  }

  addClicked(data){
    console.log(data);
    let modal = this.modalController.create(
      "DealdetailPage",
      {
        data: data
      },
      {
        // cssClass: 'mymodal',
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );
    modal.present();
  }
}
