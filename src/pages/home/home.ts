import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController,Events, LoadingController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { concat } from 'rxjs/observable/concat';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  newarraivalList:any;
  image_url:any;
  bestseller:any;
  heart=false;
  like=false;
  user_id:any;
  follow_products:any;
  myInput:any;
  noofcart:any;
  showSearchbar:boolean=false;
  

  options : InAppBrowserOptions = {
		location : 'yes',//Or 'no' 
		hidden : 'no', //Or  'yes'
		clearcache : 'yes',
		clearsessioncache : 'yes',
		zoom : 'yes',//Android only ,shows browser zoom controls 
		hardwareback : 'yes',
		mediaPlaybackRequiresUserAction : 'no',
		shouldPauseOnSuspend : 'no', //Android only 
		closebuttoncaption : 'Close', //iOS only
		disallowoverscroll : 'no', //iOS only 
		toolbar : 'yes', //iOS only 
		enableViewportScale : 'no', //iOS only 
		allowInlineMediaPlayback : 'no',//iOS only 
		presentationstyle : 'pagesheet',//iOS only 
		fullscreen : 'yes',//Windows only    
	};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private events: Events,
    private loadingCtrl: LoadingController,
    private theInAppBrowser: InAppBrowser,
  ) {
    this.user_id = AuthService.getuserid();
    this.events.publish('hideFooter', { isHidden: false});
    this.newArraival();
    this.bestSeller();
    this.recommendation();
    this.cartcount();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
   
  }

  gotoDetails(id) {
  
   
    this.navCtrl.push('DetailPage', {id:id});
  }

  newArraival(){
    console.log(this.user_id);
    this.api.post('newarraival',{user_id:this.user_id}).subscribe((response : any)  => {
    //console.log(response);
   // console.log(response.products);
    if(response.ACK === 1){      
      this.newarraivalList = response.products;
      this.image_url = response.image_url;     

    }else{
      //this.message = response.msg;
      //this.is_exist = 0;
    }
    }, err => {
    this.service.popup('Alert', 'Already Registered');
    });

  }

  bestSeller(){
    
        this.api.post('bestseller',{user_id:""}).subscribe((response : any)  => {
        console.log(response);
          if(response.Ack === 1){
          
          this.bestseller = response.best_seller;          
          //this.is_exist = 1;
    
          console.log(this.bestseller);
    
        }else{
          //this.message = response.msg;
          //this.is_exist = 0;
        }
        }, err => {
        this.service.popup('Alert', 'Already Registered');
        });
    
      }
  recommendation(){
    this.api.post('category_follow_list',{user_id:this.user_id}).subscribe((response : any)  => {
      
        if(response.Ack === 1){        
          this.follow_products = response.products;          
        }else{
        
      }
      }, err => {
      this.service.popup('Alert', 'Already Registered');
      });
  }

  gotoviewCart() {
   // alert(111);
    this.navCtrl.push("CartPage");
  }

  addWishList(id, index){
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Loading...',
      duration: 3000
    });
    loading.present();
    this.api.post('addwishlist',{product_id:id,id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        this.newarraivalList[index].wishlist = 1;
        this.newarraivalList[index].total_wishlist = this.newarraivalList[index].total_wishlist+1;        
      }
      else{
        loading.dismiss();
        this.newarraivalList[index].wishlist = 0;
        this.newarraivalList[index].total_wishlist = this.newarraivalList[index].total_wishlist-1; 
      }     
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });
  }

  addLikelLst(id, index){    
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Loading...',
      duration: 3000
    });
    loading.present();
    this.api.post('addlike',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        this.newarraivalList[index].like = 1; 
        this.newarraivalList[index].total_like = this.newarraivalList[index].total_like+1;      
      }
      else{
        loading.dismiss();
        this.newarraivalList[index].like = 0;
        this.newarraivalList[index].total_like = this.newarraivalList[index].total_like-1;  
      }
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });
  }

  search(data)
  {
    this.navCtrl.push('SearchResultPage',{param:this.myInput})
    console.log(this.myInput)
    this.myInput='';
    this.showSearchbar = !this.showSearchbar;
    
  }

  toggleSearchbar()
  {
    this.showSearchbar=!this.showSearchbar;
  }

  onCancel(ionchange)
  {
    this.showSearchbar = !this.showSearchbar;
    
        console.log('cancel');

  }

  public openWithInAppBrowser(url : string){
		let target = "_blank";
		this.theInAppBrowser.create(url,target,this.options);
	}

  cartcount()
  {
    this.api.post('noOfCart',{user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){
    
        this.noofcart=response.no_cart;
        
      }else{
       
        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }


}
