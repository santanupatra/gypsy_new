import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController, LoadingController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  id:any;
  user_id:any;
  prolikeList:any;
  userlikelist:any;
  url:any;
  israting:any;
  likeCount:any;
  userimagepath:any;
  //productDetails:any;
  productDetails: any = {};
  prolikeCount:any;
  heart = false;
  like = false;
  productimages:any;
  imageurl:any;
  currency:any;
  isShow:any;
  showList:any;
  product:any;
  rate:any;
  ratingArray:any;
  noofcart:any;
  starrating:any;
  title:any;
  followed:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    ) {
  
      this.title="Product share";
    this.id = this.navParams.get('id');
   // alert(this.id);
    this.user_id = AuthService.getuserid();
    this.alsolikeList(this.id);
    this.detailsProduct(this.id);
    this.cartcount();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');

   
  }


  alsolikeList(id) {
    this.api.post('alsolikelist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        this.prolikeList = response.like_details;
        this.url = "http://111.93.169.90/";
        console.log(this.prolikeList);
      }
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });
    
  }

  detailsProduct(id) {

    this.api.post('productdetails',{product_id:id, user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        this.likeCount=response.likecount;
       
        this.ratingArray=response.product_details.Rating
        console.log(this.ratingArray)
        if (this.ratingArray.length>0)
        {
          this.israting=1;
          
         
       
         
          console.log(this.ratingArray.length)
          this.starrating=response.product_details.Rating[0].Rating[0].average
        }
        else
        {
          console.log(this.ratingArray.length)
          this.israting=0;
        }
        
        
        this.productDetails = response.product_details.Product;
        this.productimages= response.product_details.ProductImage;
        this.imageurl=response.image_url;
      
        if(response.like >= 1){
          this.like = true;   
        }

        if(response.wishlist >= 1){
          this.heart = true;  
        }

        console.log(this.productDetails);
        console.log('images',this.productimages);
        console.log('imageurl',this.imageurl);
        this.prolikeCount = response.product_details.Like.length;
      //  alert(this.prolikeCount);
        this.url = "http://111.93.169.90/";
       // console.log(this.prolikeList);
      }
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });    
  }

  addWishList(id){
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
        this.heart = true;        
      }
      else{
        this.heart = false;  
      }     
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });
  }

  addLikelLst(id){
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
        this.like = true; 
        this.detailsProduct(id);

      }
      else{
        this.like = false; 
      }
    }, err => {
      this.service.popup('Alert', 'Already Registered');
    });
  }

  goToCartPage()
  {
    this.navCtrl.push('CartPage')
  }

  show(prodId)
  {
    this.isShow =1;
    console.log(prodId);
    this.product=prodId
  }

  showlist(prodId)
  {
    this.showList =1;
    console.log('prodid',prodId);
    this.product=prodId

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    loading.present();


    this.api.post('productlikelist',{product_id:prodId,user_id:this.user_id}).subscribe((response : any)  => {
      console.log('productlikelist',response);
      
  
      if(response.ACK == 1){
    
        this.userimagepath=response.userimagepath;
        loading.dismiss();
       this.userlikelist=response.products;


       if(response.follow_list==0)
       {
         for(var i=0;i<this.userlikelist.length;i++)
         {
        this.userlikelist[i].User.is_follow=0;
         }
       }
      


        
      }else{
        loading.dismiss();
        this.userlikelist='';
  
      }
      }, err => {
        loading.dismiss();
        this.service.popup('Alert', 'Something went wrong');
    });

    
  }


  hide() {
    this.isShow =0;
  }

  hidelist()
  {
    this.showList =0;
  }

  submit()
  
  {

    let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Loading...',
      // duration: 3000
    });
    loading.present();
    console.log(this.rate);
    console.log(this.product)
    this.isShow =0;
    this.api.post('addrating',{user_id:this.user_id, product_id:this.product, rating:this.rate}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){
    
        loading.dismiss();
        this.service.popup('',response.msg);
        this.detailsProduct(this.product)
        
      }else{
        loading.dismiss();
        this.service.popup('',response.msg);
      }
      }, err => {
        loading.dismiss();
        this.service.popup('Alert', 'Something went wrong');
    });
  }

  cartcount()
  {
    this.api.post('noOfCart',{user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){
    
        this.noofcart=response.no_cart;
        
      }else{
        this.service.popup('', 'Something went wrong');
        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }


  feed(id)
  {
    this.navCtrl.push('ProductFeedPage',{param:id})
  }


  addtoCart(proid) {

    this.api.post('addcart',{id:this.user_id,product_id:proid}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        // this.navCtrl.push("CartPage");
        this.service.popup('success',response.msg);
  
      }else{
        this.service.popup('Sorry','Please try again later');
      }
      }, err => {
      	this.service.popup('Alert', 'Something is Wrong');
      });
   }

   facebookShare(link) {
     console.log(link);
    this.socialSharing.shareViaFacebook(this.title,null,link).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }

  twitterShare(link) {
    console.log(link);
    this.socialSharing.shareViaTwitter(this.title,null,link).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }
 

  /*follow(id)
  {
console.log(id);

let loading = this.loadingCtrl.create({
  content: 'Please wait...',
});

loading.present();


this.api.post('followuser',{follower_to:id,followed_by:this.user_id}).subscribe((response : any)  => {
  console.log('followuser',response);
  console.log(response.msg);

  // if(response.ACK == 1){

   
  //   loading.dismiss();
  
    
  // }else{
  //   loading.dismiss();
 

  // }
  }, err => {
    loading.dismiss();
    this.service.popup('Alert', 'Something went wrong');
});

// follower_to
  }*/

  follow(id,index)
  {
    console.log('userid',this.user_id)
    console.log('userid2',id)
    this.api.post('followuser',{followed_by:this.user_id,follower_to:id}).subscribe((response : any)  => {
     console.log('follow')
      console.log(response);
  
      if(response.Ack == 1){
    
        this.service.popup('',response.msg);
this.userlikelist[index].User.is_follow=response.followed;

console.log(this.userlikelist[index].User.is_follow);
    
        
      }
      else{
        this.service.popup('', 'Something went wrong');
        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }








}
