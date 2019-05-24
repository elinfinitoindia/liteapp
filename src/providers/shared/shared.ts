import { HttpClient } from '@angular/common/http'; import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
  
export class SharedProvider {

  loading;

  constructor(

    private loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private network: Network,
    private events: Events

  ) {


    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      
      this.events.publish('nstatus', true);
    });

    this.network.onDisconnect().subscribe(() => {
      console.log('network disconnected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.


      this.events.publish('nstatus', false);
    });



    console.log('Hello SharedProvider Provider');
  }


  createToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  createLoader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="../../assets/loader_icon.svg"/>
      `,
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  dismissLoader() {
    this.loading.dismiss();
    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

  }


  saveUser(user) {
    localStorage.setItem('User', JSON.stringify(user));
  }


  saveToken(token) {
    localStorage.setItem('Token', token);
  }


  getUser() {
    return localStorage.getItem('User');
  }

  checkToken() {
    return localStorage.getItem('Token');
  }


  shareApp(data) {
    this.socialSharing.share(data.message, data.subject, data.image, data.link).then(() => {
      console.log('share succesfull')
    });
  }

  isConnected() {
    let conntype = this.network.type;
    return conntype;
  }

  checkNetworkStatus() {
    let conntype = this.network.type;
    
    if ( conntype === "NONE" || conntype === "none")
    {
      return false;
    }
    else {
      return true;
    }
    
  }


}
