import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { RFxService } from 'app/services/rfx.service';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-mutedialog',
  templateUrl: './mutedialog.component.html',
  styleUrls: ['./mutedialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MutedialogComponent implements OnInit {
  MuteFormGroup: FormGroup;
  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<MutedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private _RFxService: RFxService,
    private _formBuilder: FormBuilder
  ) {

   }

  ngOnInit() {
    this.InitializeRFxFormGroup();
  }
  InitializeRFxFormGroup(): void {
    this.MuteFormGroup = this._formBuilder.group({
      Reason: ['', [Validators.required]],
    });
  }
  Save(){
    
  }
}
