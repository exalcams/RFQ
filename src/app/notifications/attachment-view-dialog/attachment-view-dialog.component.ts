import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AttachmentDialogComponent } from '../attachment-dialog/attachment-dialog.component';
import { DashboardService } from 'app/services/dashboard.service';
import { Guid } from 'guid-typescript';
import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { RFxService } from 'app/services/rfx.service';


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
  }

  ngOnInit(): void {
    console.log(this.ofAttachments);
  }

  attachmentClicked(attachment: string): void {
      console.log(attachment);
      this.DownloadOfAttachment(this.ofAttachmentData.RFxID, attachment);
  }

  DownloadOfAttachment(RFxID: string,fileName: string): void {
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
          this.openAttachmentDialog(fileName, blob);
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
