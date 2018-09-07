import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changeForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events: Events,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
  ) {
    this.changeForm = fb.group({           
      'old_password':[null, Validators.required],
      'new_password': [null, Validators.required],
      'conf_password': [null, Validators.required]
    });
  }

  changePassword(data){
    this.api.post('changepassword',data).subscribe((response : any)  => {      
     let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Loading Please Wait...',
      duration: 3000
    });
    loading.present();
      if(response.Ack == 1){
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Success!',
          subTitle: 'Password change successfully.',
           buttons: ['OK']
         });
       alert.present();
      }else{
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Password not change.',
           buttons: ['OK']
         });
       alert.present();
      }
    }, err => {
      this.service.popup('Error', 'Login Failed');
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  ionViewWillEnter(){
    this.events.publish('hideFooter', { isHidden: true});
  }

}
