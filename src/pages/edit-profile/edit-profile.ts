import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController,ToastController,ActionSheetController,LoadingController,Platform } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import {Storage} from '@ionic/storage'

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  user_id:any;
  userList:any;

  first_name:any;
  last_name:any;
  address:any;
  email:any;
  phone:any;
  //data:any;
  data : any = {};
  lastImage:any;
  userImg:any;
  uploadsuccess:any;
  userimage:any;
  uploadresponse:any={};
  successres:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,

    private camera: Camera,
    private filePath: FilePath,
    private file: File,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    public toastCtrl:ToastController,
    public storage: Storage,
  ) {
    this.user_id = AuthService.getuserid();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
    this.myProfile();
  }


  myProfile(){
    
  this.api.post('viewuser',{id:this.user_id}).subscribe((response : any)  => {
    console.log(response);
    if(response.Ack === 1){

      
      this.userList = response.user_details;
      this.data = {email : response.user_details.User.email_address,first_name : response.user_details.User.first_name, last_name : response.user_details.User.last_name, phoneno : response.user_details.User.phoneno, address: response.user_details.User.address};
      console.log(this.data);

    }else{
     
    }
  }, err => {
    this.service.popup('Alert', 'Already Registered');
  });
  
    }


  editProfile(data){
    
    data.id = this.user_id;
    this.api.post('editprofile',data).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
       
          this.afloginsuccess(response);
         this.AuthService.initializeUserData({id: this.user_id, first_name: response.user_details.User.first_name, last_name: response.user_details.User.last_name});
         //this.myProfile(); 
      }else{
        this.service.popup('Alert', "Profile not Update");
      }
    }, err => {
      this.service.popup('Alert', 'Something wrong');
    });
     
    
  }

  afloginsuccess(response){
    
     // this.navCtrl.setRoot('Success');
      this.service.popup('Success', 'Profile update successfully');
  }

  editProfilePic()
  {
    console.log('edit profile picture')
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => {
            this.uploadFromCamera(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'From gallery',
          icon: 'images',
          handler: () => {
            this.uploadFromCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    actionSheet.present();
  }


  uploadFromCamera(sourceType){

    
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
          
            
          });

           
         
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });

  }

  private createFileName(currentName) {
    var d = new Date(),
    n = d.getTime(),
   // newFileName=n+".jpg";
    newFileName=currentName;

    return newFileName;
    
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {

   
   console.log("CURRENTFILENAME",currentName);
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log("NEWFILENAMEEEEEE",this.lastImage);
      
      this.uploadImage(this.lastImage); 
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public pathForImage(img) {
    // this.uploadImage();
    console.log("IMAGGGEGGEGGEGE",img);
    
    if (img === undefined) {

     
      return '';
     
    } 
    else {

      
      return cordova.file.dataDirectory + img;
    }
    
  }

  public uploadImage(lastimage) {

    
    console.log('uploadImage')
    // if(JSON.parse(localStorage.getItem('userDetails')))
    // {
    //   this.loginuser = JSON.parse(localStorage.getItem('userDetails')); 
    //   this.userId=this.loginuser.id
    //        console.log ( this.userId)
    // }
    // Destination URL
    var url = "http://111.93.169.90/team4/gypsy/Webservice/upload_image";
    
    // File for Upload
    var targetPath = this.pathForImage(lastimage);
   
    // File name only
    var filename = this.lastImage;
   
    var options = {
      fileKey: "photo",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
      'photo':filename,
      'user_id':this.user_id
       }
     // params : {'fileName': filename}
    };
    console.log("OPTIONS",options);
    console.log('targetPath',targetPath)
    const fileTransfer:FileTransferObject = this.transfer.create();
   
   
   let loading = this.loadingCtrl.create({
      content: 'Uploading Please Wait...'
    });
    loading.present();
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(userdata => {
      this.uploadresponse=userdata.response;
      this.successres=this.uploadresponse.msg;
      console.log('UPLOADDDD',this.uploadresponse);
      console.log('UPLOADDDD',this.uploadresponse.msg);
      console.log('span',this.successres);
      if(this.uploadresponse.Ack == 1){
        
         loading.dismiss();
        this.presentToast('Image succesful uploaded.');
// console.log('image url',this.uploadsuccess.image_url+this.uploadsuccess.image_name)
// console.log(this.uploadsuccess.image_name)



// this.userimage=this.uploadsuccess.image_url+this.uploadsuccess.image_name



        // this.storage.ready().then(() => {
        // localStorage.setItem ('userimage',JSON.stringify(this.userimage))
        // });
       
      }else{

         loading.dismiss();
        this.presentToast('Time out. Try again.');

      }

    }, err => {
      console.log("Error",err);
       loading.dismiss();
      this.presentToast('Error while uploading file.');
    });
  }


}
