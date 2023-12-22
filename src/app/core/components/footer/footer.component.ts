import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/features/sharedServices/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{
  public images:string[] = []
  constructor(private sharedService:SharedService){
  }
  ngOnInit(): void {
    this.images = this.sharedService.topBarFooterImg
  }

}
