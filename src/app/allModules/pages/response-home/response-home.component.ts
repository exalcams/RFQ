import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-response-home',
  templateUrl: './response-home.component.html',
  styleUrls: ['./response-home.component.scss']
})
export class ResponseHomeComponent implements OnInit {
  HeaderDetails: RFxHeader[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['position', 'RfqId', 'Type', 'Date', 'Exp', 'Fulfilment', 'Attachment', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  imgArray: any[] = [
    {
      url: '../assets/images/1.png'
    },
    {
      url: '../assets/images/2.png'
    },
    {
      url: '../assets/images/3.png'
    },
    {
      url: '../assets/images/4.png'
    },
    {
      url: '../assets/images/5.png'
    }
  ] 

  constructor(private route: Router,
    private _RFxService: RFxService) { }

  ngOnInit() {
    this.GetRFxs();
  }

  Gotoheader() {
    this.route.navigate(['pages/response']);
  }
  GetRFxs(): void {
    // window.location.reload()
    this._RFxService.GetAllRFxs().subscribe(
      (data) => {
        if (data) {
          this.HeaderDetails = <RFxHeader[]>data;
          this.HeaderDetailsDataSource = new MatTableDataSource(
            this.HeaderDetails
          );
        }
      }
    )
  }
}
