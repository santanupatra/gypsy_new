import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the ProductFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-feed',
  templateUrl: 'product-feed.html',
})
export class ProductFeedPage {
  parameter:any;
  feedlist:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private service: ServiceProvider,
  public loadingCtrl:LoadingController,) 
    {
this.parameter=this.navParams.get ('param');
console.log(this.parameter);
this.productfeed();


  }

  productfeed()
  {

    let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Loading...',
   
    });
    loading.present();

    this.api.post('productfeedlist',{product_id:this.parameter}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        
       this.feedlist=response.feed_list;
  
      }else{
        loading.dismiss();
        this.feedlist='';
        this.service.popup('Sorry','Please try again later');
      }
      }, err => {
        loading.dismiss();
      	this.service.popup('Alert', 'Something is Wrong');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductFeedPage');
  }

}
