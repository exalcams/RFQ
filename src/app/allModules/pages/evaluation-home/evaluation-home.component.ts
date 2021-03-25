import { Component,OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader } from 'app/models/RFx';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';


@Component({
  selector: 'app-evaluation-home',
  templateUrl: './evaluation-home.component.html',
  styleUrls: ['./evaluation-home.component.scss']
})
export class EvaluationHomeComponent implements OnInit {
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  AllHeaderDetails: any[] = [];
  HeaderStatus: any[];
  HeaderDetailsDisplayedColumns: string[] = ['position', 'RFxID', 'RFxType', 'ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<RFxHeader>;
  isProgressBarVisibile:boolean;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(private route: Router,
    private _RFxService: RFxService,
    private dialog: MatDialog,public snackBar: MatSnackBar) { 
      this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

  ngOnInit() {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQ_EvaluationHome') < 0) {
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
    this.route.navigate(['pages/evaluationresponse']);
    // { queryParams: { id: rfqid } }
    localStorage.setItem('E_RFXID', rfqid);
  }
  GetAllRFxs(): void {
    this.isProgressBarVisibile=true;
    this._RFxService.GetAllRFxHDocumets('3').subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails =data;
          this.isProgressBarVisibile=false;
          this.LoadTableSource(this.AllHeaderDetails);
        }
      }
    );
  }
  LoadTableSource(DataArray:any[]){
    this.HeaderDetailsDataSource = new MatTableDataSource(DataArray);
    this.HeaderDetailsDataSource.paginator=this.RFQPaginator;
    this.HeaderDetailsDataSource.sort=this.RFQSort;
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

}
