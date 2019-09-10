import { Component, OnInit } from '@angular/core';
import { EventsService } from 'angular4-events';
import { Router } from '@angular/router';
import { ProviderService } from 'src/service/provider/provider.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public event: EventsService,private router:Router,private provider:ProviderService) { }

  ngOnInit() {
  }


  newEntity(){
      this.event.publish('newEntity');
      this.router.navigate(['./dashboard']);
  }

  searchLastEntry(){
    let lastClientId = this.provider.getStorage('lastEntrySearched');
    if(lastClientId != undefined){
      this.event.publish('lastClientSearched',lastClientId);
      this.router.navigate(['./dashboard']);
    }
  }

  goToLogs(){
    this.router.navigate(['/logs']);
  }

  goToReport(){
    this.router.navigate(['./report']);
  }

}
