import { Component,ViewChild } from '@angular/core';
import { Platform,Nav,MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { ServiceProvider } from '../providers/service/service';

import { HomePage } from '../pages/home/home';

import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any;
  @ViewChild(Nav) nav: Nav;

  public footerIsHidden: boolean = false;

  username:any;
  user_image:any;
  categoryList:any;
  image_url:any;
  user_id:any;
  constructor(
    platform: Platform,

    public events: Events, 
    public api: ApiProvider,
    private service: ServiceProvider,
    public menuCtrl: MenuController,
    public loadingCtrl:LoadingController, 
    statusBar: StatusBar,
    splashScreen: SplashScreen, 
    private AuthService: AuthProvider) {
      this.user_id = AuthService.getuserid();
      platform.ready().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.


          events.subscribe('hideFooter', (data) => {
            this.footerIsHidden = data.isHidden;
          })

          console.log(AuthService.getuserid());      
          if( AuthService.getuserid() ){
            this.rootPage = 'HomePage';
          }else{
            events.publish('hideFooter', {isHidden: true});
            this.rootPage = 'LoginPage';
          }
          statusBar.styleDefault();
          splashScreen.hide();
          this.getCategorylist();
      });



 // this.usertype = localStorage.getItem('authTYPE');
  AuthService.user$.subscribe( (response :any ) => {

   console.log(response);
   
      if(response.first_name){
        
          this.username = response.first_name+' '+response.last_name;
          this.user_image = response.user_image;

          //alert(this.username);
  
          localStorage.setItem('login_user_image',this.user_image );
        //  console.log(this.user_image);
        //this.menuCtrl.open();
         
      }else{
          this.username = '';
      }  
  })








  }

  // menuOpened() {
  //   let userid = localStorage.getItem('authID');

  // }
  getCategorylist(){    
    this.api.post('categoryList',{}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){     
          this.categoryList = response.categories;  
          this.image_url = response.image_url;
      }
    }, err => {
      this.service.popup('Alert', 'No Category');
    });
    
      }

logout(){
  localStorage.removeItem("authID");
  localStorage.setItem("authID", "");
  localStorage.removeItem("authTYPE");
  this.nav.setRoot('LoginPage');
}


openPage(page){
  this.nav.push(page);
}
productList(id){
  this.nav.push("ProductListPage", {id:id});
}

goFollow(id, index){
  let loading = this.loadingCtrl.create({
    spinner: 'show',
    content: 'Loading...',
    duration: 3000
  });
  loading.present();
  this.api.post('category_follow',{'user_id':this.user_id, "category_id":id}).subscribe((response : any)  => {
    console.log(response);
    if(response.Ack === 1){   
      loading.dismiss();  
      this.categoryList[index].Follow = response.follow; 
    }
    else{
      loading.dismiss();
      this.categoryList[index].Follow = response.follow; 
    }
  }, err => {
    this.service.popup('Alert', 'Error');
  });
}





}


