import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
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
    private _RFxService: RFxService,
    private dialog: MatDialog) { }

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
  DocsClicked(){
    this.openAttachmentViewDialog();
  }
  openAttachmentViewDialog(): void {
    const dialogConfig: MatDialogConfig = {
        data: {Documents:["Discount (1).png"],RFxID:"0000000010"},
        panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
        AttachmentViewDialogComponent,
        dialogConfig
    );
}
}
