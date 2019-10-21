import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingController, ToastController, Events } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from "@ionic-native/network";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Subject } from "rxjs";
import { of } from "rxjs/observable/of";

let options: NativeTransitionOptions = {
  direction: "up",
  duration: 500,
  slowdownfactor: 3,
  slidePixels: 20,
  iosdelay: 100,
  androiddelay: 150,
  fixedPixelsTop: 0,
  fixedPixelsBottom: 60
};

declare var window: { KochavaTracker };

@Injectable()
export class SharedProvider {
  loading;

  browserOpenSubject = new Subject<boolean>();

  constructor(
    private loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private network: Network,
    private events: Events,
    private nativeTrasnitions: NativePageTransitions,
    private file: File,
    private transfer: FileTransfer,
    private inappBrowser: InAppBrowser
  ) {
    this.checkNetworkStatusOnPage();
  }

  createToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  createLoader() {
    this.loading = this.loadingCtrl.create({
      spinner: "hide",
      content: `<img src="../../assets/loader_icon.svg"/>
      `,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  dismissLoader() {
    this.loading.dismiss();
    this.loading.onDidDismiss(() => {
      console.log("Dismissed loading");
    });
  }

  saveUser(user) {
    localStorage.setItem("User", JSON.stringify(user));
  }

  saveToken(token) {
    localStorage.setItem("Token", token);
  }

  getUser() {
    return localStorage.getItem("User");
  }

  checkToken() {
    return localStorage.getItem("Token");
  }

  shareapplication(data) {
    this.socialSharing
      .share(data.message, data.subject, data.image, data.link)
      .then(() => {
        console.log("share succesfull");
      });
  }

  isConnected() {
    let conntype = this.network.type;
    return conntype;
  }

  checkNetworkStatus() {
    let conntype = this.network.type;

    if (conntype === "NONE" || conntype === "none") {
      return of(false);
    } else {
      return of(true);
    }
  }

  intializeTracker() {
    var configMapObject = {};
    configMapObject[window.KochavaTracker.PARAM_ANDROID_APP_GUID_STRING_KEY] =
      "kodeals-locker-lite-lnfe1m8y";
    window.KochavaTracker.configure(configMapObject);
  }

  registerEventTrack() {
    var eventMapObject = {};
    eventMapObject["name"] = "Registration";
    eventMapObject["user_id"] = "Prateek";
    window.KochavaTracker.sendEventMapObject(
      window.KochavaTracker.EVENT_TYPE_REGISTRATION_COMPLETE_STRING_KEY,
      eventMapObject
    );
  }

  addToFavEventTrack(data) {
    var eventMapObject = {};
    eventMapObject["name"] = "addToWishList";
    eventMapObject["id"] = data.id;
    eventMapObject["title"] = data.title;
    window.KochavaTracker.sendEventMapObject(
      window.KochavaTracker.EVENT_TYPE_ADD_TO_WISHLIST_STRING_KEY,
      eventMapObject
    );
  }

  nativeSlide() {
    this.nativeTrasnitions
      .slide(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  nativeFlip() {
    this.nativeTrasnitions.flip(options).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  nativeFade() {
    this.nativeTrasnitions.fade(options).then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  handleError(error) {
    console.log(error);
    this.createToast(error.statusText);
  }

  // createBrowserLink

  openBrowser(data) {
    var url;
    if (data.Url.length <= 1 && data.Url.length !==0) {
      url = data.Url[0].Url;
      console.log(url);
      const browser = this.inappBrowser.create(url, "_system");
    }
    else if(data.Url.length ==0){
      this.createToast("Error");
    }
    

    // browser.on("loadstart").subscribe(event => {
    //   console.log(event);
    //   this.browserOpenSubject.next(true);
    // });
  }

  downloadOnMemory(data) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = encodeURI(data.Logo);
    const targetPath =
      this.file.externalDataDirectory + "images/" + data.Name + ".png";
    return fileTransfer.download(url, targetPath, true);
  }

  checkDownloadedImage(data): Promise<string> {
    return this.file
      .checkFile(
        this.file.externalDataDirectory + "images/",
        data.Name + ".png"
      )
      .then(
        resolve => {
          if (resolve == true) {
            console.log("file found");
            return this.file.checkFile(
              this.file.externalDataDirectory + "images/",
              data.Name + ".png"
            );
          } else {
            console.log("file not found");
            return false;
          }
        },
        reject => {
          console.log("file not found");
          return null;
        }
      );
  }

  checkNetworkStatusOnPage(){
        this.network.onConnect().subscribe(res => {
          this.events.publish("nstatus", true);
        });

        this.network.onDisconnect().subscribe(res => {
          this.events.publish("nstatus", false);
        });
  }
}
