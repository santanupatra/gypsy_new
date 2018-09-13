import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private service: ServiceProvider,
    private AuthService: AuthProvider,) {
    this.searchkeyword=navParams.get('param');
    console.log(this.searchkeyword);
    this.searchresult();
    this.user_id = AuthService.getuserid();

  }

searchresult()
{
  this.api.post('search',{keywords:this.searchkeyword}).subscribe((response : any)  => {
    console.log(response);

    if(response.ACK == 1){
      this.productlist = response.products;
    
      console.log(this.productlist)

    }else{
      this.productlist='';
    
    }
    }, err => {
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
