import { Injectable } from '@angular/core';
import {AuthConfig} from 'angular-oauth2-oidc';

export const Oauth2ConfigService: AuthConfig = {
    issuer:  'http://localhost:8080/auth/realms/phil-softs',
    redirectUri: window.location.origin + '/login',
    clientId: 'smartshares',
    scope: 'openid profile email'
};
