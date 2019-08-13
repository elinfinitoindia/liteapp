import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, ModalController, Content, Slides } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { ScrollHideConfig } from '../../directives/scroll/scroll';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links';
import { DealsProvider } from '../../providers/deals/deals';
import { HttpClient } from '@angular/common/http';

const animationsOptions = {
  animation: 'ios-transition',
  duration: 1000
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  headerScrollConfig: ScrollHideConfig = {
    cssProperty: 'margin-top',
    maxValue: 44
  };
  
  @ViewChild(Slides) slides1: Slides;
 @ViewChild(Content) content: Content;
  slides;
  isLoggedIn: boolean = false;
  lnotification: any = [];
  isConnected : boolean;
  showToolbar : boolean;
  visibility  : boolean = true;
  secondpage  : boolean = false;
  thirdpage   : boolean = false;
  counter: any = 0;
  storelinks;
  defaultImage = '../../assets/images/logo.png';
  page: number=1;
  catego: any = [];
  adsData: any = [];
  mainslide:any = [];
  brands:any = [];
  
  constructor(

    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private platform: Platform,
    private sharedService: SharedProvider,
    private modalController: ModalController,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    private dealService: DealsProvider,
    private http:HttpClient

  ) {

    platform.ready().then(() => {
      this.isConnected = this.sharedService.checkNetworkStatus();
    })

    platform.resume.subscribe(() => {
      this.isConnected = this.sharedService.checkNetworkStatus();
    });

    this.showToolbar = false;
    this.firebaseDynamicLinks.onDynamicLink()
      .subscribe((res: any) => console.log(res), (error: any) => console.log(error));
  }



  ionViewDidLoad() {
    this.slides = [
      { 'image': 'http://elinfinitoindia.in/images/logo.png' },
      { 'image': 'http://elinfinitoindia.in/images/logo.png' },
    ];
  }

  nav11() {
    this.navCtrl.push('ProductlistPage');
  }

  ionViewWillEnter() {

    
    
    // this.dealService.getStoreCategory().subscribe(res => {
    //   this.catego = res;
    //   console.log(res);
    // })

    this.http.get('https://reqres.in/api/users?page='+this.page).subscribe(res=> {
      this.catego = res.data;
      this.brands = res.data;
    })

    this.events.subscribe('nstatus', (res) => {
      if (res == true) {
        this.isConnected = true;
      }
      else {
        this.isConnected = false;
      }
    });

    // this.dealService.getStoreLinks().subscribe(res => {
    //   this.storelinks = res;
    //   this.Fashion = this.storelinks.filter(x => x.category == "Fashion") || [];
    //   this.Grocery = this.storelinks.filter(x => x.category == "Grocery") || [];
    //   this.Entertainment =this.storelinks.filter(x => x.category == "Entertainment") || [];
                      
    // },
    //   err => {
    //     console.log(err)
    //   });
    
    this.dealService.getAdsData().subscribe(res => {
      this.adsData = res || [];
      if (this.adsData.length > 0) {
   this.mainslide = this.adsData.filter(x => x.category == "scroll");
      }
    }, err => {
        console.log(err)
    })
  }

  goToNotification() {
    this.navCtrl.push('NotificationPage' , {} , animationsOptions);
  }

  goToFav() {
    this.navCtrl.push('FavouritesPage', {}, animationsOptions);
  }

  toggle() {
    this.isConnected = !this.isConnected;
  }

ionViewWillLeave(){
  
}
  
  doInfinite(event) {

    // if(this.counter == 0) {
    //   this.secondpage = true;
    //   // this.grocery = this.storelinks.filter(x => x.category == "Grocery");
    //   this.counter++
    // }
    // else if (this.counter == 1) {
    //   this.thirdpage = true;
    //   this.counter++;
    // }
    this.page++;
    this.http.get('https://reqres.in/api/users?page=' + this.page).subscribe(res => {
      
      res.data.forEach(element => {
        this.catego.push(element)
      });
      
    })
    
    setTimeout(() => {
      event.complete(); 
    }, 1000);    
  }
}
