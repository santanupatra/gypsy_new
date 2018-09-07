import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
  ) {
    
  }

  ionViewDidLoad() {
    this.events.publish('hideFooter', { isHidden: false});
  }

  openPage(page){
    this.navCtrl.push(page);
  }

  logout(){
    localStorage.removeItem("authID");
    localStorage.setItem("authID", "");
    localStorage.removeItem("authTYPE");
    this.navCtrl.push('LoginPage');
  }
  

}
