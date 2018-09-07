import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  user_id:any;
  userList:any;

  first_name:any;
  last_name:any;
  address:any;
  email:any;
  phone:any;
  //data:any;
  data : any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider
  ) {
    this.user_id = AuthService.getuserid();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
    this.myProfile();
  }


  myProfile(){
    
  this.api.post('viewuser',{id:this.user_id}).subscribe((response : any)  => {
    console.log(response);
    if(response.Ack === 1){

      
      this.userList = response.user_details;
      this.data = {email : response.user_details.User.email_address,first_name : response.user_details.User.first_name, last_name : response.user_details.User.last_name, phoneno : response.user_details.User.phoneno, address: response.user_details.User.address};
      console.log(this.data);

    }else{
     
    }
  }, err => {
    this.service.popup('Alert', 'Already Registered');
  });
  
    }


  editProfile(data){
    
    data.id = this.user_id;
    this.api.post('editprofile',data).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
       
          this.afloginsuccess(response);
         this.AuthService.initializeUserData({id: this.user_id, first_name: response.user_details.User.first_name, last_name: response.user_details.User.last_name});
         //this.myProfile(); 
      }else{
        this.service.popup('Alert', "Profile not Update");
      }
    }, err => {
      this.service.popup('Alert', 'Something wrong');
    });
     
    
  }

  afloginsuccess(response){
    
     // this.navCtrl.setRoot('Success');
      this.service.popup('Success', 'Profile update successfully');
  }

}
