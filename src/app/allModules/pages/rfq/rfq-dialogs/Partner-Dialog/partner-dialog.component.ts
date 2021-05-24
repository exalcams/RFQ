import { Component, OnInit, Optional, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  RFxPartner } from 'app/models/RFx';
import { AuthService } from 'app/services/auth.service';
import { MasterService } from 'app/services/master.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-partner-dialog',
  templateUrl: './partner-dialog.component.html',
  styleUrls: ['./partner-dialog.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class PartnerDialogComponent implements OnInit,OnDestroy {
  DialogueFormGroup: FormGroup;
  rfx = new RFxPartner;
  RFxPartners:RFxPartner[]=[];
  Users:string[]=[];
  SelectedUsers:string[]=[];

  public bankMultiFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword for multi-selection */

  public filteredBanksMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  /** Subject that emits when the component has been destroyed. */

  private _onDestroy = new Subject<void>();
  constructor(private _formBuilder: FormBuilder,private masterService: MasterService, public dialogRef: MatDialogRef<PartnerDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.rfx = data.data;
    this.RFxPartners=data.RFxPartners;
    }

  ngOnInit(): void {
    this.RFxPartners.forEach(partner => {
      this.SelectedUsers.push(partner.User);
    });
    this.InitializeDialogueFormGroup();
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private filterBanksMulti() {
    if (!this.Users) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.Users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.Users.filter(user => user.toLowerCase().indexOf(search) > -1)
    );
  }

  InitializeDialogueFormGroup(): void {
    this.DialogueFormGroup = this._formBuilder.group({
      Partner: ["", Validators.required],
      User: [this.SelectedUsers, Validators.required]
    });
    this.DialogueFormGroup.get('User').disable();
  }
  RoleSelected(role:string){
    this.masterService.GetRFQRoleWithUsers(role).subscribe(data=>{
      this.Users=data;
      this.filteredBanksMulti.next(this.Users.slice());
      this.DialogueFormGroup.get('User').enable();
    });
  }
  Save(){
    if(this.DialogueFormGroup.valid){
      var users=this.DialogueFormGroup.get('User').value;
      users.forEach(user => {
        if(this.RFxPartners.filter(x=>x.User==user).length==0){
          var partner=new RFxPartner();
          partner.Client=this.rfx.Client;
          partner.Company=this.rfx.Company;
          partner.Type=this.DialogueFormGroup.get('Partner').value;
          partner.User=user;
          this.RFxPartners.push(partner);
        }
      });
      this.dialogRef.close(this.RFxPartners);
    }
    else{
      this.ShowValidationErrors(this.DialogueFormGroup);
    }
  }
  ShowValidationErrors(formGroup:FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
    });
  }
}
