import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  startMaxDate:any = new Date();
  startMinDate:any = new Date(1909,1,1);
  endMaxDate:any   = new Date();
  endMinDate:any   = new Date(1909,1,1);
  searchInput:any;
  searchData: any;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.searchInput = this.formBuilder.group({
       target:    ['',Validators.required],
       startDate: ['',Validators.required],
       endDate:   ['',Validators.required]
    })
  }

  filter(searchInput){
    this.searchData = this.searchInput;
  }

  reset(){
    this.searchData = null;
  }


}
