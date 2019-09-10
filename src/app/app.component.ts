import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { Oauth2ConfigService } from '../app/oauth2.config';
import { EventsService } from 'angular4-events';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smartshares';
  pathname: string = window.location.pathname;
  constructor(private oauthService: OAuthService, private event: EventsService) {
     this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi() {
    this.oauthService.configure(Oauth2ConfigService);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin({
        onTokenReceived: context => {
          // Perform Action

      }
      });
    });
  }

  

}
