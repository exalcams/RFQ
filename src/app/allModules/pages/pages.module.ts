import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { RfqHomeComponent } from './rfq-home/rfq-home.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { RatingModule } from 'ng-starrating';

import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
} from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
    FuseCountdownModule,
    FuseHighlightModule,
    FuseMaterialColorPickerModule,
    FuseWidgetModule
} from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DecimalPipe } from '@angular/common';
import { RfqComponent } from './rfq/rfq.component';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { DialogContentExampleDialogComponent } from './rfq/rfq-dialogs/Criteria-Dialog/dialog-content-example-dialog.component';
import { DialogContentExampleDialog1Component } from './rfq/rfq-dialogs/Rateing-Dialog/dialog-content-example-dialog1.component';
import { DialogContentExampleDialog2Component } from './rfq/rfq-dialogs/Item-Dialog/dialog-content-example-dialog2.component';
import { DialogContentExampleDialog3Component } from './rfq/rfq-dialogs/Partner-Dialo/dialog-content-example-dialog3.component';
import { DialogContentExampleDialog4Component } from './rfq/rfq-dialogs/Vendor-Dialog/dialog-content-example-dialog4.component';
import { DialogContentExampleDialog5Component } from './rfq/rfq-dialogs/Question-Dialog/dialog-content-example-dialog5.component';
import { DialogContentExampleDialog7Component } from './rfq/rfq-dialogs/Attachment-Dialog/dialog-content-example-dialog7.component';
import { ResponseHomeComponent } from './response-home/response-home.component';
import { ResponseComponent } from './response/response.component';
import { ResItemDialogComponent } from './response/response-dialogs/res-item-dialog/res-item-dialog.component';
import { ResAnsDialogComponent } from './response/response-dialogs/res-ans-dialog/res-ans-dialog.component';
import { ResAttachDialogComponent } from './response/response-dialogs/res-attach-dialog/res-attach-dialog.component';
import { SelectVendorDialogComponent } from './rfq/rfq-dialogs/select-vendor-dialog/select-vendor-dialog.component';
import { RemoveLeadingZeroPipe } from 'app/shared/remove-leading-zero';
import { EvaluationHomeComponent } from './evaluation-home/evaluation-home.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { EvaluationResponseComponent } from './evaluation-response/evaluation-response.component';
import { EvaItemDialogComponent } from './eva-item-dialog/eva-item-dialog.component';
import { AwardHomeComponent } from './award-home/award-home.component';
import { AwardResponseComponent } from './award-response/award-response.component';
import { AwardComponent } from './award/award.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AwardReportComponent } from './award-report/award-report.component';


const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'home',
        component: RfqHomeComponent
    },
    {
        path: 'rfq',
        component: RfqComponent
    },
    {
        path: 'responsehome',
        component: ResponseHomeComponent
    },
    {
        path: 'response',
        component: ResponseComponent
    },
    {
        path: 'evaluationhome',
        component: EvaluationHomeComponent
    },
    {
        path: 'evaluation',
        component: EvaluationComponent
    },
    {
        path: 'evaluationresponse',
        component: EvaluationResponseComponent
    },
    {
        path:'awardhome',
        component: AwardHomeComponent
    },
    {
        path:'awardresponse',
        component:AwardResponseComponent
    },
    {
        path:'award',
        component:AwardComponent
    },
    {
        path:'awardreport',
        component:AwardReportComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // HttpClientModule,
        // TranslateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        NgxDropzoneModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseSidebarModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,

        FormsModule,
        RatingModule,
        NgxMaterialTimepickerModule
    ],
    declarations: [
        DashboardComponent,
        RfqHomeComponent,
        RfqComponent,
        DialogContentExampleDialogComponent,
        DialogContentExampleDialog2Component,
        DialogContentExampleDialog1Component,
        DialogContentExampleDialog3Component,
        DialogContentExampleDialog4Component,
        DialogContentExampleDialog5Component,
        DialogContentExampleDialog7Component,
        ResponseHomeComponent,
        ResponseComponent,
        ResItemDialogComponent,
        ResAnsDialogComponent,
        ResAttachDialogComponent,
        SelectVendorDialogComponent,
        RemoveLeadingZeroPipe,
        EvaluationHomeComponent,
        EvaluationComponent,
        EvaluationResponseComponent,
        EvaItemDialogComponent,
        AwardHomeComponent,
        AwardResponseComponent,
        AwardComponent,
        AwardReportComponent

    ],
    providers: [
        DecimalPipe,
        EventEmitterService,
    ],
    entryComponents: [
        DialogContentExampleDialogComponent,
        DialogContentExampleDialog2Component,
        DialogContentExampleDialog1Component,
        DialogContentExampleDialog3Component,
        DialogContentExampleDialog4Component,
        DialogContentExampleDialog5Component,
        DialogContentExampleDialog7Component,
        ResItemDialogComponent,
        ResAnsDialogComponent,
        ResAttachDialogComponent,
        SelectVendorDialogComponent,
        EvaItemDialogComponent
    ]
})
export class PagesModule { }
