
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

const apiUrl = "http://111.93.169.90/team4/gypsy/webservice";
//const apiUrl = "http://192.168.1.118/team4/gypsy/webservice";
const mediaUrl ="http://111.93.169.90/team4/gypsy/";
const url ="http://111.93.169.90";
const baseurl="http://111.93.169.90/team4/gypsy/api";


@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
  }



  post(link,data){

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'my-auth-token'
    //   })
    // };
    console.log(data);

  	return this.http.post(apiUrl+'/'+link, data).map(response => {

    
      	return response;
    });

  }

  likelist(link,data){
  console.log(data);
	return this.http.post(baseurl+'/'+link, data).map(response => {
   
      	return response;
    });

  }

  // searchlist(link,data){
  //   console.log(data);
  //   return this.http.post(apiUrl+'/'+link, data).map(response => {
     
  //         return response;
  //     });
  
  //   }

  
}

