import { Component, OnInit } from '@angular/core';
import { EventsService } from 'angular4-events';
import { ProviderService } from 'src/service/provider/provider.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  clientData:any;
  paymentForm:any;
  isLoading:Boolean = false;
  constructor(private event:EventsService,private provider:ProviderService,private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.subscribeToSearch();
    this.paymentForm = this.formBuilder.group({
      amount: ['',Validators.required]
    });


  }

  subscribeToSearch(){
    this.event.subscribe('searchFoundClient',(data) =>{
      this.clientData = data;
      this.paymentForm = this.formBuilder.group({
        amount: [this.clientData.amount,Validators.required,Validators.min(10)]
      });
    })
  }


  processPayment(amountForm){
    this.clientData.amount = amountForm.amount;
    if(amountForm.amount > 10){
      this.isLoading = true;
      this.provider.putData('shareholder',this.clientData)
      .then(res=>{
        this.isLoading = false;
        this.provider.showSnackBar("Payment recorded");
      })
    }else{
       this.provider.showSnackBar("Amount is very low");
    }
    
  }

  ngOnDestroy(){
    this.event.publish('componentBeforeDestroy');
  }

}
