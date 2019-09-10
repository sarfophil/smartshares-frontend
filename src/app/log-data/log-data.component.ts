import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from 'src/service/provider/provider.service';
import * as moment from 'moment';

@Component({
  selector: 'app-log-data',
  templateUrl: './log-data.component.html',
  styleUrls: ['./log-data.component.css']
})
export class LogDataComponent implements OnInit {


  @Input()
  searchParams:any;

  pageable:any;
  isLoading:Boolean = false;
  dataset:any;
  totalData:any;
  constructor(private provider:ProviderService) { }

  ngOnInit() {
    this.pageable = {
      size: 10,
      page: 0,
      totalPages: this.processTotalPages(0),
      currentPage: 0,
      totalPagesSize: 0
    };
    this.filter();
   
  }

  filter(){
     let data = this.searchParams.value;
     this.isLoading = true;
     let params = "size="+this.pageable.size+"&page="+this.pageable.page+"&from="+this.formatDate(data.startDate)+"&to="+this.formatDateTime(data.endDate);
     this.provider.getData(this.filterLink(data.target)+params,"")
     .then(res=>{
        this.isLoading = false;
        let response:any = res;
        
        this.dataset = response.content;
        this.totalData = response.totalElements;
        this.pageable.totalPages = this.processTotalPages(response.totalPages);
        this.pageable.totalPagesSize = this.processTotalPages(response.totalPages).length;
     })
    
  }

  filterLink(link){
    if(link === "All"){
      return "reports/shareholders?show_all=false&";
    }else if(link === "Active"){
      return "reports/shareholders/status?status=true&show_all=false&";
    }else{
      return "reports/shareholder/status?status=false&show_all=false&";
    }
  }


  formatDate(paramDate:any){
     let date = moment(paramDate).format();
     return date;
  }

  formatDateTime(paramDate:any){
     let date = moment(paramDate).format("YYYY-MM-DD");
     return date+'T23:00:00';
  }

  processTotalPages(total:any){
    let pages = [];
    for(let i = 0; i < total; i++){
      pages.push(i+1);
    }
    return pages;
  }

  previous(){
    if(this.pageable.currentPage > 0){
       this.pageable.page = this.pageable.currentPage-1;
       this.filter();
    }
  }


  next(){
    if(this.pageable.currentPage < this.pageable.totalPagesSize){
      this.pageable.page = this.pageable.currentPage+1;
      this.filter();
    }
  }

  paginate(page){
    this.pageable.page = page - 1;
    this.filter();
  }

}


