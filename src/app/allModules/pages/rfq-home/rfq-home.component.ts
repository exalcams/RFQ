import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RFxHeader } from 'app/models/RFx';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-rfq-home',
  templateUrl: './rfq-home.component.html',
  styleUrls: ['./rfq-home.component.css']
})
export class RfqHomeComponent implements OnInit {
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  HeaderDetails: RFxHeader[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['position', 'RFxID', 'RFxType', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Attachment', 'Action'];
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

  ngOnInit(): void {
    this.GetRFxs();
  }
  Gotoheader(rfqid) {
    this.route.navigate(['pages/rfq'], { queryParams: { id: rfqid } });
  }
  GetRFxs(): void {
    // window.location.reload()
    this._RFxService.GetAllRFxs().subscribe(
      (data) => {
        if (data) {
          this.HeaderDetails = <RFxHeader[]>data;
          this.HeaderDetailsDataSource = new MatTableDataSource(this.HeaderDetails);
          this.HeaderDetailsDataSource.paginator=this.RFQPaginator;
          this.HeaderDetailsDataSource.sort=this.RFQSort;
        }
      }
    );
  }

}
