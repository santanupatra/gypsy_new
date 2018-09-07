import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the CompanylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-companylist',
  templateUrl: 'companylist.html',
})
export class CompanylistPage {

  companyList:any;
  image_url:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider
  
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanylistPage');
    this.getCompanylist();
  }

  getCompanylist(){
    
  this.api.post('companylist',{user_id:''}).subscribe((response : any)  => {
    console.log(response);
    if(response.Ack === 1){
      //  this.afloginsuccess(response);

      this.companyList = response.full_list;

      this.image_url = response.image_url;
    }else{
      this.service.popup('Alert', 'Wrong EmailId & Password');
    }
  }, err => {
    this.service.popup('Alert', 'Already Registered');
  });
  
    }

    gotoFeed(company_id,id) {
      this.navCtrl.push('FeedPage', {company_id: company_id,sid:id});
    //  this.facbookFeed(company_id);
    //  this.twitterFeed(company_id);
    //  this.pinterestFeed(company_id);
    }

    // facbookFeed(company_id) {
    //   this.api.post('feedlistfb',{company_id:company_id}).subscribe((response : any)  => {
    //     console.log(response);
    //     if(response.Ack === 1){
    //     }
    //   }, err => {
    //     this.service.popup('Alert', 'Already Registered');
    //   });
      
    // }


    // twitterFeed(company_id) {
    //   this.api.post('companylist',{company_id:company_id}).subscribe((response : any)  => {
    //     console.log(response);
    //     if(response.Ack === 1){
    //     }
    //   }, err => {
    //     this.service.popup('Alert', 'Already Registered');
    //   });
    
    // }

    // pinterestFeed(company_id) {
    //   this.api.post('feedlistpinterest',{company_id:company_id}).subscribe((response : any)  => {
    //     console.log(response);
    //     if(response.Ack === 1){
    //     }
    //   }, err => {
    //     this.service.popup('Alert', 'Already Registered');
    //   });
  
    // }

  

}
