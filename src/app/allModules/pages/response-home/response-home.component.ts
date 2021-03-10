import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { RFxService } from 'app/services/rfx.service';

@Component({
  selector: 'app-response-home',
  templateUrl: './response-home.component.html',
  styleUrls: ['./response-home.component.scss']
})
export class ResponseHomeComponent implements OnInit {
  isProgressBarVisibile:boolean;
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  RFxTableAttachments:string[]=[];
  HeaderDetails: any[] = [];
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
    private _RFxService: RFxService,
    private _route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.GetRFxs();
  }

  Gotoheader(rfqid) {
    this.route.navigate(['pages/response'], { queryParams: { id: rfqid } });
  }
  GetRFxs(): void {
    // window.location.reload()
    this._RFxService.GetAllRFxHDocumets().subscribe(
      (data) => {
        if (data) {
          this.HeaderDetails =data;
          this.HeaderDetailsDataSource = new MatTableDataSource(
            this.HeaderDetails
          );
          this.HeaderDetailsDataSource.paginator=this.RFQPaginator;
          this.HeaderDetailsDataSource.sort=this.RFQSort;
        }
      }
    )
  }
  openAttachmentViewDialog(RFxID:string,Ataachments:string[]): void {
    const dialogConfig: MatDialogConfig = {
        data: {Documents:Ataachments,RFxID:RFxID},
        panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
        AttachmentViewDialogComponent,
        dialogConfig
    );
}
}
