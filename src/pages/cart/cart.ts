import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';


/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
	user_id: any;
	productList: any;
	message: any;
	url:any;
	imageurl:any;


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
		public api: ApiProvider,
		public alertCtrl: AlertController,
		private AuthService: AuthProvider,
		private service: ServiceProvider,
		private theInAppBrowser: InAppBrowser, ) {

		this.user_id = AuthService.getuserid();
		this.url = "http://111.93.169.90/";
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CartPage');
		this.fetchProduct();
	}


	strip(html: string) {
		return html.replace(/<(?:.|\n)*?>/gm, '');
	}

	br2nl(html: string) {
		return html.replace(/<br( \/|\/|)>/gm, '\r\n');
	}


	fetchProduct() {
		this.api.post('viewcart', { user_id: this.user_id}).subscribe((response : any) => {
			console.log(response);
			if(response.Ack === 1) {
				this.productList = response.cart_details;
				console.log(this.productList);
				this.imageurl=response.imagepath;

			} else {
				this.productList = null;
				this.message = response.msg;
			}
			
		}, err => {
			this.service.popup('Alert', 'Something went wrong');
		});
	}


	removeItem(id) {
		let alert = this.alertCtrl.create({
			title: 'Confirm Remove',
			message: 'Do you want remove the item from your Cart?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						// return false;
					}
				},
				{
					text: 'Remove',
					handler: () => {
						this.api.post('deletecart', { cart_id: id}).subscribe((response : any) => {
							
					//	this.api.post('removecart/' + id, { }).subscribe((response: any) => {
							console.log(response);
							if (response.Ack === 1) {
								//  this.productList = response.wishlist_details;
								//  this.is_exist = 1;
							//	this.productList = null;
								this.fetchProduct();

							} else {
								//this.message = response.msg;
								//this.is_exist = 0;
							}
						}, () => {
								this.service.popup('Alert', 'Something went Wrong');
							});
					}
				}
			]
		});
		alert.present();
	}


	
	public openWithInAppBrowser(url : string){
		let target = "_blank";
		this.theInAppBrowser.create(url,target,this.options);
	}
	


}
