import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Validators, FormBuilder } from '@angular/forms';
import { ProviderService } from 'src/service/provider/provider.service';
import { EventsService } from 'angular4-events';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
   account: any;
   searchByClientCodeForm: any;
   searchByClientCodeFullnameForm: any;
   currentEntity: any;
   isLoading: boolean = false;
   currentEntityForm: any;
   response: any;
  constructor(private oauthService: OAuthService , private fb: FormBuilder,private provider: ProviderService,private event: EventsService) {

  }

  ngOnInit() {
     this.currentAccount();

     this.searchByClientCodeForm = this.fb.group({
       clientCode: ['', Validators.required]
     });

     this.searchByClientCodeFullnameForm = this.fb.group({
       firstname: ['', Validators.required],
       middlename: [''],
       lastname: ['', Validators.required]
     });

     this.currentEntityForm = {
       fullname: '',
       code: '',
       status: '',
       numberType: '',
       numberTypeValue: '',
       entryDate:'',
       createdBy:''
     }

     this.subscribeToNewEntity();
     this.componentBeforeDestroyListener();
     this.lastEntrySearchedListener();
     
  }

  currentAccount() {
    const claims = this.oauthService.getIdentityClaims();
    if (claims != null) {
      this.account = claims;
    }
  }

  clearCurrentEntityForm(){
    this.currentEntityForm = {
      fullname: '',
      code: '',
      status: '',
      numberType: '',
      numberTypeValue: '',
      entryDate:'',
      createdBy:''
    }
  }

  clearEntitySearchForms(){
      this.searchByClientCodeForm = this.fb.group({
        clientCode: ['', Validators.required]
      });

      this.searchByClientCodeFullnameForm = this.fb.group({
        firstname: ['', Validators.required],
        middlename: [''],
        lastname: ['', Validators.required]
      });
  }

  searchByClientCode(form: any){
    this.isLoading = true;
    
    this.provider.getData('shareholder/client/' + form.clientCode, '')
    .then(res => {
          let response:any = res;
          this.isLoading = false;
          if(response.status === 404){
              this.provider.showSnackBar("Client not found");

              this.clearCurrentEntityForm();
          }else{
            //  this.provider.showSnackBar("Client found!");
              this.currentEntityForm = {
                fullname: response.firstname+' '+response.middlename+' '+response.lastname,
                code: 'CLIENT CODE: '+response.clientId,
                status: response.isActive?'Active':'Inactive',
                numberType: response.ssn?1:0,
                numberTypeValue: response.ssn?'SSNIT: '+response.ssnNumber:'TIN: '+response.tinNumber,
                entryDate:response.createdDate,
                createdBy:response.user
              }
              //Last Entry Searched
              this.provider.setStorage('lastEntrySearched',form.clientCode);

              //Publish Event: Search Results Found Client
              this.event.publish('searchFoundClient',response);
          }
                 
    });
  }


  searchByClientFullname(form: any){
    this.isLoading = true;

    this.provider.getData('shareholder/name?firstname='+form.firstname+'&middlename='+form.middlename+'&lastname='+form.lastname,'')
    .then(res=>{
       let response:any = res;
       this.isLoading = false;
       if(response.status === 404){
         this.provider.showSnackBar('Client not found');
         this.clearCurrentEntityForm();
       }else{
         // this.provider.showSnackBar('Client Found!');
          this.currentEntityForm = {
            fullname: response.body.firstname+' '+response.body.middlename+' '+response.body.lastname,
            code: 'CLIENT CODE: '+response.body.clientId,
            status: response.body.isActive?'Active':'Inactive',
            numberType: response.body.ssn?1:0,
            numberTypeValue: response.body.ssn?'SSNIT: '+response.body.ssnNumber:'TIN: '+response.body.tinNumber,
            entryDate:response.body.createdDate,
            createdBy:response.body.user
          }

          //Last Entry Searched
          this.provider.setStorage('lastEntrySearched',response.body.clientId);

          //Publish Event: Search Results Found Client
          this.event.publish('searchFoundClient',response.body);
       }
    })
  }


  subscribeToNewEntity(){
    this.event.subscribe('newEntity',()=>{
      this.clearCurrentEntityForm();
      this.clearEntitySearchForms();
    });
  }

  componentBeforeDestroyListener(){
    this.event.subscribe('componentBeforeDestroy',()=>{
     if(this.searchByClientCodeForm.status == "VALID" || this.searchByClientCodeFullnameForm.status == 'VALID'){
        if(this.searchByClientCodeForm.status == "VALID"){
          this.searchByClientCode(this.searchByClientCodeForm.value);
        }else{
          this.searchByClientFullname(this.searchByClientCodeFullnameForm.value);
        }
     }
    })
  }

  lastEntrySearchedListener(){
    this.event.subscribe('lastClientSearched',(data)=>{
       let form = {
         clientCode:data
       };

       this.searchByClientCode(form);
       this.searchByClientCodeForm = this.fb.group({
        clientCode: [data, Validators.required]
      });
    })
  }

}
