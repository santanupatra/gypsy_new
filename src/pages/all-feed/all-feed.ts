import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';

import { Content } from 'ionic-angular/components/content/content';
import { concat } from 'rxjs/observable/concat';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the AllFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-feed',
  templateUrl: 'all-feed.html',
})
export class AllFeedPage {
  
  image_url:any;
  list:any;
  categoryList:any;

  page = 0;
  maximumPages = 1;
  users=[];

  feedlist = [];
  feedlist1:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient,
    public api:ApiProvider,
    private service: ServiceProvider,
  public loadingctrl:LoadingController,) {

    
    this.allfeed();
    this.maximumPages=this.feedlist.length;
  }



  allfeed(infiniteScroll?) {

    // let loading = this.loadingctrl.create({
    //   // spinner: 'show',
    //   content: 'Loading...',
     
    // });
    // loading.present();

    this.api.post('allcompanyfeedlist',{array_pocket:this.page})
    .subscribe(res => {
      // loading.dismiss();
      this.feedlist = this.feedlist.concat(res['feed_list']);
      console.log('allfeed')
      console.log(this.feedlist)
      
      console.log('blank index',this.feedlist[""])
      this.page
   
      console.log(res);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }
 
  doInfinite(infiniteScroll) {
    this.page++;
    this.allfeed(infiniteScroll);
    console.log('doinfinite')
 console.log(this.feedlist)
    if (this.page === this.maximumPages) {
      infiniteScroll.complete();
    }
  }


/*allfeed(infiniteScroll?)
{
  console.log('allfeed');
  this.api.post('categoryList',this.page).subscribe((response : any)  => {
    this.categoryList = response.categories;  
    console.log('response');
    console.log(response);
    this.categoryList = this.feedlist.concat(response['categories']);
    if (infiniteScroll) {
      infiniteScroll.complete();
    }

   });
         
  
}

doInfinite(infiniteScroll) {
  this.page++;
    this.allfeed(infiniteScroll);
 
    if (this.page === this.maximumPages) {
      infiniteScroll.enable(false);
    }

}*/


  ionViewDidLoad() {
    console.log('ionViewDidLoad AllFeedPage');
  }

}
