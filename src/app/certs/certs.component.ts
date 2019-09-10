import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-certs',
  templateUrl: './certs.component.html',
  styleUrls: ['./certs.component.css']
})
export class CertsComponent implements OnInit {

  @Input()
  public clientData:any;

  constructor() { }

  ngOnInit() {
    console.log(this.clientData);
  }

}
