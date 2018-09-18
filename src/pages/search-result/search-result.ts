import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';
import { concat } from 'rxjs/observable/concat';
/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  
  searchkeyword:any;
productlist:any;
user_id:any;
imageurl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private service: ServiceProvider,
    private AuthService: AuthProvider,
    public loadingCtrl:LoadingController, ) {
    this.searchkeyword=navParams.get('param');
    console.log(this.searchkeyword);
    this.searchresult();
    this.user_id = AuthService.getuserid();

  }

searchresult()
{
  let loading = this.loadingCtrl.create({
    spinner: 'show',
    content: 'Loading...',
    // duration: 3000
  });
  loading.present();
  console.log('parameter',this.searchkeyword)
  this.api.post('search',{keywords:this.searchkeyword}).subscribe((response : any)  => {
    console.log(response);

    if(response.ACK == 1){
      loading.dismiss();
      this.productlist = response.products;
      this.imageurl=response.image_url;
    
      console.log(this.productlist)

    }else{
      loading.dismiss();
      this.productlist='';
    
    }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
  });
}


gotoDetails(productId)
{
  this.navCtrl.push('DetailPage', {id:productId});
}

addToCart(productId)
{
  console.log(productId);
  this.api.post('addcart',{id:this.user_id,product_id:productId}).subscribe((response : any)  => {
    console.log(response);

    if(response.Ack == 1){
     
      this.service.popup('success',response.msg);

    }
    else{
      this.service.popup('Sorry','Please try again later');
    
    }
    }, err => {
      this.service.popup('Alert', 'Something went wrong');
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
  }

}
