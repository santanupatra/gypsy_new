import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';


/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchresult:any;
  typeinput:any;
  myInput:any;

  showSearchbar:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    private service: ServiceProvider,) {
  }

  toggleSearchbar()
  {
    this.showSearchbar=!this.showSearchbar;
    this.searchresult='';
  }

  onCancel(ionchange)
  {
    this.showSearchbar = !this.showSearchbar;
    
        console.log('cancel');
        this.searchresult='';
        this.typeinput='';

  }



  checkFocus()
  {
    this.typeinput='';
    console.log('focus')
    this.api.post('search_keyword',{}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){
    
        this.searchresult=response.results
        
      }else{
        this.searchresult='';
        
      }
      }, 
      err => {
        this.service.popup('Alert', 'Something went wrong');
    }
  );

  }

  getItems(data)
  {
    this.searchresult='';


    console.log(this.myInput)
    this.api.post('search_keyword_after_type',{keywords:this.myInput}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.ACK == 1){
    
        this.typeinput=response.products;
        
      }else{
        this.typeinput='';
        
      }
      }, 
      err => {
        this.service.popup('Alert', 'Something went wrong');
    }
  );
  }

  selected(data)
  {
    console.log(data)
    this.myInput=data;
    this.searchresult='';
    this.typeinput='';
    this.navCtrl.push('SearchResultPage',{param:this.myInput})
    this.showSearchbar = !this.showSearchbar;
    this.myInput='';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
