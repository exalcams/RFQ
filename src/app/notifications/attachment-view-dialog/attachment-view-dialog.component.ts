import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { DashboardService } from 'app/services/dashboard.service';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { RFxService } from 'app/services/rfx.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'attachment-view-dialog',
  templateUrl: './attachment-view-dialog.component.html',
  styleUrls: ['./attachment-view-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AttachmentViewDialogComponent implements OnInit {
  isProgressBarVisibile: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  ofAttachments: string[] = [];
  isResponse:boolean;

  constructor(
    private dialog: MatDialog,
    public _dashboardService: DashboardService,
    public snackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<AttachmentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public ofAttachmentData: any,
    private _RFxService: RFxService
  ) {
    this.isProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.ofAttachments = this.ofAttachmentData.Documents;
    this.isResponse=this.ofAttachmentData.isResponse;
  }

  ngOnInit(): void {
    console.log(this.ofAttachmentData);
  }

  attachmentClicked(attachment: string): void {
      console.log(attachment);
      if(this.isResponse){
        this.DownloadResAttachment(attachment);
      }
      else{
        this.DownloadRFxAttachment(this.ofAttachmentData.RFxID, attachment);
      }
  }

  DownloadRFxAttachment(RFxID: string,fileName: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.DowloandAttachment(RFxID, fileName).subscribe(
      data => {
        if (data) {
          let fileType = 'image/jpg';
          fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
            fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
              fileName.toLowerCase().includes('.png') ? 'image/png' :
                fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                  fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
          const blob = new Blob([data], { type: fileType });
          if(fileType=='image/jpg' || fileType=='image/jpeg' || fileType=='image/png' || fileType=='image/gif' || fileType=='application/pdf'){
            this.openAttachmentDialog(fileName, blob);
          }
          else{
            saveAs(blob,fileName);
          }
        }
        this.isProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.isProgressBarVisibile = false;
      }
    );
  }
  DownloadResAttachment(fileName: string): void {
    this.isProgressBarVisibile = true;
    this._RFxService.DowloandResAttachment(fileName).subscribe(
      data => {
        if (data) {
          let fileType = 'image/jpg';
          fileType = fileName.toLowerCase().includes('.jpg') ? 'image/jpg' :
            fileName.toLowerCase().includes('.jpeg') ? 'image/jpeg' :
              fileName.toLowerCase().includes('.png') ? 'image/png' :
                fileName.toLowerCase().includes('.gif') ? 'image/gif' :
                  fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
          const blob = new Blob([data], { type: fileType });
          if(fileType=='image/jpg' || fileType=='image/jpeg' || fileType=='image/png' || fileType=='image/gif' || fileType=='application/pdf'){
            this.openAttachmentDialog(fileName, blob);
          }
          else{
            saveAs(blob,fileName);
          }
        }
        this.isProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.isProgressBarVisibile = false;
      }
    );
  }
  openAttachmentDialog(FileName: string, blob: Blob): void {
    const attachmentDetails: any = {
      FileName: FileName,
      blob: blob
    };
    const dialogConfig: MatDialogConfig = {
      data: attachmentDetails,
      panelClass: 'attachment-dialog'
    };
    const dialogRef = this.dialog.open(AttachmentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
