import { animate, animateChild, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { RFxHeader } from 'app/models/RFx';
import { AttachmentViewDialogComponent } from 'app/notifications/attachment-view-dialog/attachment-view-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { RFxService } from 'app/services/rfx.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-award-report',
  templateUrl: './award-report.component.html',
  styleUrls: ['./award-report.component.scss'],
  animations: [trigger('blub', [
    transition(':leave', [
      style({ background: 'pink' }),
      query('*', stagger(-150, [animateChild()]), { optional: true })
    ]),
  ]),

  trigger('fadeOut', [
    state('void', style({ background: 'pink', borderBottomColor: 'pink', opacity: 0, transform: 'translateX(-550px)', 'box-shadow': 'none' })),
    transition('void => *', sequence([
      animate(".2s ease")
    ])),
    transition('* => void', [animate("2s ease")])
  ]),

  ],
})
export class AwardReportComponent implements OnInit {
  @ViewChild(MatPaginator) RFQPaginator: MatPaginator;
  @ViewChild(MatSort) RFQSort: MatSort;
  HeaderDetailsDisplayedColumns: string[] = ['RFxID','Title', 'RFxType', 'RFxGroup','ValidityStartDate', 'ValidityEndDate', 'Fulfilment', 'Attachment','AwardedTo', 'Action'];
  HeaderDetailsDataSource: MatTableDataSource<any>;
  AllHeaderDetails:any[]=[];
  isProgressBarVisibile: boolean;
  authenticationDetails: AuthenticationDetails;
  currentUserID: Guid;
  currentUserName:string;
  currentUserRole: string;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
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
      this.currentUserName=this.authenticationDetails.UserName;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // if (this.MenuItems.indexOf('RFQ_RFQ') < 0) {
      //   this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //   );
      //   this.route.navigate(['/auth/login']);
      // }
    } else {
      this.route.navigate(['/auth/login']);
    }
    this.GetAllRFxs();
  }
  GotoAwardDetails(rfqid,vendor) {
    localStorage.setItem('ARFXID', rfqid);
    localStorage.setItem('AwardedTo', vendor);
    this.route.navigate(['pages/award-detail']);
  }

  GetAllRFxs(): void {
    this.isProgressBarVisibile = true;
    this._RFxService.GetAllAwardedWithAttachments().subscribe(
      (data) => {
        if (data) {
          this.AllHeaderDetails = data;
          this.isProgressBarVisibile = false;
          this.LoadTableSource(this.AllHeaderDetails);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.HeaderDetailsDataSource.filter = filterValue.trim().toLowerCase();
  }
}
