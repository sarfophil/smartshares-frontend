import { Component, OnInit } from '@angular/core';
import { EventsService } from 'angular4-events';
import { ProviderService } from 'src/service/provider/provider.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  clientData:any;
  constructor(private event:EventsService,private provider:ProviderService) { }

  ngOnInit() {
    this.subscribeToSearch();
  }

  subscribeToSearch(){
    this.event.subscribe('searchFoundClient',(data) =>{
      if(data.amount == 0){
        this.provider.showSnackBar("Account has not paid yet");
      }
      this.clientData = data;
    })
  }

  ngOnDestroy(){
    this.event.publish('componentBeforeDestroy');
  }

}
