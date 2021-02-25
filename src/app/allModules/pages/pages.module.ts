import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { RfqHomeComponent } from './rfq-home/rfq-home.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

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
import { DialogContentExampleDialogComponent } from './rfq/rfq-dialogs/dialog-content-example-dialog/dialog-content-example-dialog.component';
import { DialogContentExampleDialog1Component } from './rfq/rfq-dialogs/dialog-content-example-dialog1/dialog-content-example-dialog1.component';
import { DialogContentExampleDialog2Component } from './rfq/rfq-dialogs/dialog-content-example-dialog2/dialog-content-example-dialog2.component';
import { DialogContentExampleDialog3Component } from './rfq/rfq-dialogs/dialog-content-example-dialog3/dialog-content-example-dialog3.component';
import { DialogContentExampleDialog4Component } from './rfq/rfq-dialogs/dialog-content-example-dialog4/dialog-content-example-dialog4.component';
import { DialogContentExampleDialog5Component } from './rfq/rfq-dialogs/dialog-content-example-dialog5/dialog-content-example-dialog5.component';
import { DialogContentExampleDialog7Component } from './rfq/rfq-dialogs/dialog-content-example-dialog7/dialog-content-example-dialog7.component';

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

        FormsModule
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
        DialogContentExampleDialog7Component
    ],
    providers: [
        DecimalPipe,
        EventEmitterService
    ],
    entryComponents: [
        DialogContentExampleDialogComponent,
        DialogContentExampleDialog2Component,
        DialogContentExampleDialog1Component,
        DialogContentExampleDialog3Component,
        DialogContentExampleDialog4Component,
        DialogContentExampleDialog5Component,
        DialogContentExampleDialog7Component
    ]
})
export class PagesModule { }
