import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { VendorViewListDialogComponent } from 'app/notifications/vendor-view-list-dialog/vendor-view-list-dialog.component';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-rfq-home',
  templateUrl: './rfq-home.component.html',
  styleUrls: ['./rfq-home.component.css']
})
export class RfqHomeComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  RFxTableAttachments: string[] = [];
  AllHeaderDetails: any[] = [];
  InitiatedHeaderDetails: any[] = [];
  RespondedHeaderDetails: any[] = [];
  EvaluatedHeaderDetails: any[] = [];
  ClosedHeaderDetails: any[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['RFxID','Title', 'RFxType', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Attachment','Vendor', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  isProgressBarVisibile: boolean;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsNewHeader:boolean=true;
  
  constructor(private route: Router,
    private _RFxService: RFxService,
    private dialog: MatDialog, public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    //console.log(retrievedObject);   
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_RFQ') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
        );
        this.route.navigate(['/auth/login']);
      }
    } else {
      this.route.navigate(['/auth/login']);
    }
    this.GetAllRFxs();
  }
  Gotoheader(rfqid) {
    this.IsNewHeader=false;
    this.route.navigate(['pages/rfq']);
    // { queryParams: { id: rfqid } }
    localStorage.setItem('RFXID', rfqid);
  }

  GetAllRFxs(): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetAllRFxHDocumets().subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllHeaderDetails);
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('1').subscribe(
      (data) => {
        if (data) {
          this.InitiatedHeaderDetails = data;
          this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('2').subscribe(
      (data) => {
        if (data) {
          this.RespondedHeaderDetails = data;
          this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('3').subscribe(
      (data) => {
        if (data) {
          this.EvaluatedHeaderDetails = data;
          this.isProgressBarVisibile = false;
        }
      }
    );
    this._RFxService.GetAllRFxHDocumets('5').subscribe(
      (data) => {
        if (data) {
          this.ClosedHeaderDetails = data;
          this.isProgressBarVisibile = false;
        }
      }
    );
  }
  LoadTableSource(DataArray: any[]) {
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator = this.RFQPaginator;
    this.HeaderDetailsDataSource.sort = this.RFQSort;
  }
  openAttachmentViewDialog(RFxID: string, Ataachments: string[]): void {
    const dialogConfig: MatDialogConfig = {
      data: { Documents: Ataachments, RFxID: RFxID, isResponse: false },
      panelClass: "attachment-view-dialog",
    };
    const dialogRef = this.dialog.open(
      AttachmentViewDialogComponent,
      dialogConfig
    );
  }
  openVendorViewList(RFxID: string, Vendor: string[]):void{
    const dialogConfig: MatDialogConfig = {
      data: { PartnerID: Vendor, RFxID: RFxID, isResponse: false },
      panelClass: "vendor-view-list-dialog",
    };
    const dialogRef = this.dialog.open(
      VendorViewListDialogComponent,
      dialogConfig
    );
  }

  //fulfilment Status
  getStatusColor(element: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return element.Status === "1"
          ? "gray"
          : element.Status === "2"
            ? "gray"
            : element.Status === "3"
              ? "#efb577" : "#34ad65";
      case "Evaluated":
        return element.Status === "1"
          ? "gray"
          : element.Status === "2"
            ? "gray"
            : element.Status === "3"
              ? "gray"
              : element.Status === "4"
                ? "gray"
                : "#34ad65";
      case "Closed":
        return element.Status === "1"
          ? "gray"
          : element.Status === "2"
            ? "gray"
            : element.Status === "3"
              ? "gray"
              : element.Status === "4"
                ? "gray"
                : element.Status === "5"
                  ? "gray"
                  : "#34ad65";
      default:
        return "";
    }
  }

  getTimeline(element: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "orange-timeline" : "green-timeline";
      case "Evaluated":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "white-timeline"
              : element.Status === "4"
                ? "white-timeline"
                : "green-timeline";
      case "Closed":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "white-timeline"
              : element.Status === "4"
                ? "white-timeline"
                : element.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      default:
        return "";
    }
  }

  getRestTimeline(element: RFxHeader, StatusFor: string): string {
    switch (StatusFor) {
      case "Responded":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "white-timeline"
              : element.Status === "4"
                ? "white-timeline"
                : "green-timeline";
      case "Evaluated":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "white-timeline"
              : element.Status === "4"
                ? "white-timeline"
                : element.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      case "Closed":
        return element.Status === "1"
          ? "white-timeline"
          : element.Status === "2"
            ? "white-timeline"
            : element.Status === "3"
              ? "white-timeline"
              : element.Status === "4"
                ? "white-timeline"
                : element.Status === "5"
                  ? "white-timeline"
                  : "green-timeline";
      default:
        return "";
    }
  }
ngOnDestroy(){
  if(this.IsNewHeader){
    localStorage.setItem('RFXID',"-1");
  }
}
}
