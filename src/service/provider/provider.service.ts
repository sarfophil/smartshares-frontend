import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  headers: any;
  api: string = environment.api;
  constructor(private http: HttpClient, private oauthService: OAuthService,private snackBar:MatSnackBar) {
    
  }

  postData(path: string, data: any) {
    let headers = {
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
      'Content-Type': 'application/json'
    };
   
    return new Promise((resolve) => {
      this.http.post(this.api + path, data, { headers: headers})
      .subscribe(res => {
            resolve(res);
      }, err => {
        this.responseMiddleware(err) == true?resolve(err):'';
      });
    });
  }

  deleteData(path: string, data: any) {
    this.headers = new Headers({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
      'Content-Type': 'application/json'
    });
    return new Promise((resolve) => {
        this.http.put(this.api + path, data, { headers: this.headers})
        .subscribe(res => {
          resolve(res);
        }, err => {
          this.responseMiddleware(err) == true?resolve(err):'';
        });
    });
  }

  putData(path: string, data: any) {
    let headers = {
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
      'Content-Type': 'application/json'
    };
    return new Promise((resolve) => {
      this.http.put(this.api + path, data, { headers: headers})
      .subscribe(res => {
        resolve(res);
      }, err => {
        this.responseMiddleware(err) == true?resolve(err):'';
      });
    });
  }

  getData(path: string, data: any) {
    return new Promise((resolve) => {
      this.http.get(this.api + path, data)
      .subscribe(res => {
        resolve(res);
      }, err => {
        this.responseMiddleware(err) == true?resolve(err):'';
      });
    });
  }

  setStorage(key, value) {
    localStorage.setItem(key, value);
  }

  getStorage(key) {
    return localStorage.getItem(key);
  }

  showSnackBar(message:string){
    this.snackBar.open(message,'ok',{verticalPosition:"top"});
  }

  responseMiddleware = (res:any) =>{
    if(res.status === 401 || res.status === 403){
      window.location.href="/login";
      return false;
    }
    return true; 
  }


}
