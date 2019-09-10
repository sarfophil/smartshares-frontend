import { Component, OnInit } from '@angular/core';
import { EventsService } from 'angular4-events';
import { FormBuilder, Validators } from '@angular/forms';
import { ProviderService } from 'src/service/provider/provider.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  state:any;
  entityForm:any;
  currentEntityData:any;
  maxDate:any;
  minDate:any;
  constructor(private event : EventsService,private formBuilder: FormBuilder,private provider: ProviderService) { 
    this.state = {
      newEntity: true
    }
    this.maxDate = new Date();
    this.minDate = new Date(1909,1,1);
  }

  ngOnInit() {
    this.subscribeToNewEntity();
    this.entityFields();
    this.subscribeToSearches();
  }

  entityFields(){
    this.entityForm = this.formBuilder.group({
      firstname: ['',Validators.required],
      middlename:[''],
      lastname:  ['',Validators.required],
      dob:       ['',Validators.required],
      ssn:       ['',Validators.required],
      tin:       [''],
      ssnNumber: ['',Validators.required],
      tinNumber: [''],
      gender:    ['',Validators.required],
      emailType: ['',Validators.required],
      email:     ['',Validators.email],
      address1:  ['',Validators.required],
      address2:  [''],
      address3:  [''],
      address4:  [''],
      homeContactNumber: [''],
      workContactNumber: [''],
      cellContact:['',Validators.maxLength(10)],
      statusCode: ['001'],
      isActive:   ['true'],
      zipCode:    ['',Validators.required],
      city:       ['',Validators.required],
      country:    ['',Validators.required],
      amount:     ['0.0'],
      
    })
  }


  subscribeToNewEntity(){
    this.event.subscribe('newEntity',()=>{
      this.state.newEntity = true;
      this.entityFields();
    });
  }

  subscribeToSearches(){
     this.event.subscribe('searchFoundClient',(data) =>{
       this.state.newEntity = false;
      this.currentEntityData = data; 
      this.entityForm = this.formBuilder.group({
        firstname: [data.firstname,Validators.required],
        middlename:[data.middlename],
        lastname:  [data.lastname,Validators.required],
        dob:       [data.dob,Validators.required],
        ssn:       [data.ssn == true?'true':'false',Validators.required],
        tin:       [''],
        ssnNumber: [data.ssn?data.ssnNumber:'',Validators.required],
        tinNumber: [data.ssn?'':data.tinNumber],
        gender:    [data.gender,Validators.required],
        emailType: [data.emailType,Validators.required],
        email:     [data.email,Validators.email],
        address1:  [data.address1,Validators.required],
        address2:  [data.address2],
        address3:  [data.address3],
        address4:  [data.address4],
        homeContactNumber: [data.homeContactNumber],
        workContactNumber: [data.workContactNumber],
        cellContact:[data.cellContact,Validators.maxLength(10)],
        statusCode: [data.statusCode,Validators.required],
        isActive:   [data.isActive],
        zipCode:    [data.zipCode,Validators.required],
        city:       [data.city,Validators.required],
        country:    [data.country,Validators.required],
        amount:     [data.amount,Validators.required]
      });
     })
  }

  edit(entityForm:any){
    let ssn = entityForm.ssn;
    entityForm.uuid = this.currentEntityData.uuid;
    entityForm.clientId = this.currentEntityData.clientId;
    entityForm.user = this.currentEntityData.user;
    entityForm.createdDate = this.currentEntityData.createdDate;
    entityForm.modifiedBy = this.currentEntityData.modifiedBy;
    entityForm.lastModifiedDate = this.currentEntityData.lastModifiedDate;
    entityForm.tin = ssn == 'false'?true:null;
    entityForm.ssn = ssn == 'true'?true:null;
    entityForm.tinNumber = ssn == 'false'?entityForm.ssnNumber:null;
    entityForm.ssnNumber = ssn == 'true'?entityForm.ssnNumber:null;
    this.provider.putData('shareholder',entityForm)
    .then(res=>{
       this.provider.showSnackBar('Data Submitted');
      
    });

  }

  process(entity:any){
     let action = document.getElementById('action').value;
     if(action == 'edit'){
        this.edit(entity);
     }else if(action === 'save'){
        this.addEntity(entity);
     }else if(action === 'deactivate'){
       this.deactivate();
     }

  }

  addEntity(entity:any){
    let ssn = entity.ssn;
    entity.ssn = ssn == 'true'?true:null;
    entity.tin = ssn == 'false'?true:null;
    entity.tinNumber = ssn == 'false'?entity.ssnNumber:'';
    entity.ssnNumber = ssn == 'true'?entity.ssnNumber:'';
    
    this.provider.postData('shareholder',entity)
    .then(res => {
      let response:any = res;
      this.provider.showSnackBar('Data Submitted');
      this.entityFields();
    })
  }


  deactivate(){
    this.provider.deleteData("shareholder/"+this.currentEntityData.uuid,'')
    .then(res=>{
       this.provider.showSnackBar('Entity deactivated');
    })
  }

  ngOnDestroy(){
    this.event.publish('componentBeforeDestroy');
  }

  

}
