import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private oauthService: OAuthService, private router: Router ) { }

  ngOnInit() {
    this.login();
  }

  login() {
    setTimeout(() => {
       if (this.oauthService.hasValidAccessToken()) {
          //  this.router.navigate(['./dashboard']);
           window.location.href = '/dashboard';
       } else {
           this.oauthService.initImplicitFlow();
       }
    }, 2000);
  }

}
