// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  sid:any;
  company_id:any;
  feedList:any;
  feedListPinterest:any;
  feedListTwitter:any;
  feedListFacebook:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider
  
  ) {
this.sid = this.navParams.get('sid');
this.company_id =this.navParams.get('company_id');
  //  alert(this.navParams.get('sid'));
   // alert(this.navParams.get('company_id'));
//alert(this.sid);
   //if(this.sid ==1) {
    this.facbookFeed(this.company_id);
   //}
   //else if(this.sid ==2) {
    //this.twitterFeed(this.company_id);
  // }
   //else {
    this.pinterestFeed(this.company_id);
   //}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
  }


 facbookFeed(company_id) {
      this.api.post('feedlistfb',{company_id:company_id}).subscribe((response : any)  => {
        console.log(response);
        if(response.Ack === 1){
          this.feedListFacebook = response.feed_list;
        }
      }, err => {
        this.service.popup('Alert', 'Already Registered');
      });
      
    }


    twitterFeed(company_id) {
      this.api.post('companylist',{company_id:company_id}).subscribe((response : any)  => {
        console.log(response);
        if(response.Ack === 1){
          this.feedListTwitter = response.feed_list;
        }
      }, err => {
        this.service.popup('Alert', 'Already Registered');
      });
    
    }

    pinterestFeed(company_id) {
      this.api.post('feedlistpinterest',{company_id:company_id}).subscribe((response : any)  => {
        console.log(response);
        if(response.Ack === 1){
          this.feedListPinterest = response.feed_list;
          console.log(this.feedListPinterest);
        }
      }, err => {
        this.service.popup('Alert', 'Already Registered');
      });
  
    }

    // gotofeedDetails() {
    //   this.navCtrl.push("CartPage");
    // }

}
