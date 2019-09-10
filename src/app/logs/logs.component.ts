import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  searchInput:any;
  searchData:any;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.searchInput = this.formBuilder.group({
      startDate: ['',Validators.required],
      endDate:   ['',Validators.required]
    })
  }

  filter(searchInput){
     this.searchData = this.searchInput();
  }

}
