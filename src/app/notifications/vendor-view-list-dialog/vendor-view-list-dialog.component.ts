import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'app/services/dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { RFxService } from 'app/services/rfx.service';
import { NotificationSnackBarComponent } from '../notification-snack-bar/notification-snack-bar.component';

@Component({
  selector: 'app-vendor-view-list-dialog',
  templateUrl: './vendor-view-list-dialog.component.html',
  styleUrls: ['./vendor-view-list-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VendorViewListDialogComponent implements OnInit {
  isProgressBarVisibile: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  ofVendors: string[] = [];
  isResponse:boolean;
  
  constructor(
    private dialog: MatDialog,
    public _dashboardService: DashboardService,
    public snackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<VendorViewListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public ofVendorData: any,
    private _RFxService: RFxService
  ) {
    this.isProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.ofVendors = this.ofVendorData.PartnerID;
    this.isResponse=this.ofVendorData.isResponse;
   }

  ngOnInit() {
    console.log(this.ofVendorData);
    
  }

}
