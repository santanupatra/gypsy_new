import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,MenuController } from 'ionic-angular';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  data: any = {};
  deviceinfo : any;
  isValidEmail = true;  
  submitted = false;
  loginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events: Events,
    private fb: FormBuilder
  ) {
    //events.publish('hideFooter', { isHidden: true});
    this.loginForm = fb.group({           
      'email_address':[null, Validators.required],
      'password': [null, Validators.required]
    });
   }


   
public checkEmail(values: Object): void {
  if (values != '' ) {
    this.isValidEmail = this.validateEmail(values);      
   } 
}
validateEmail(email_address) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email_address);
}

  login(data){
    this.api.post('loginuser',data).subscribe((response : any)  => {
      console.log(response);
    //  console.log(response.user_details.User.id);
     // console.log(response.user_details.UserImage[0].originalpath);
      
      if(response.Ack == 1){
          this.afloginsuccess(response);
         console.log("Successfully Login");
      }else{
        this.service.popup('Alert', 'Wrong EmailId & Password');
      }
    }, err => {
      this.service.popup('Alert', 'Login Failed');
    });

  }

  afloginsuccess(response){
    console.log(response);
    localStorage.setItem("authID", response.user_details.User.id);
    localStorage.setItem("authTYPE", response.user_details.User.email_address);
   // localStorage.setItem("user_image",'');
    this.navCtrl.setRoot('HomePage');
    this.AuthService.initializeUserData({id: response.user_details.User.id, first_name: response.user_details.User.first_name, last_name: response.user_details.User.last_name, user_image: response.user_image});
    this.service.popup('Success', 'Successfully Login');
  }

  
  ionViewWillEnter(){
    this.events.publish('hideFooter', { isHidden: true});
  }
  onSignup() {
   this.navCtrl.push("SignupPage");
  }

  gotoHome() {
    //alert(11);
    this.navCtrl.push('HomePage');
  }
  goForgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }

}
