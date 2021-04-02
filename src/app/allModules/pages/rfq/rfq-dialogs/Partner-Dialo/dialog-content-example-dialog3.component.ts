import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  RFxPartner } from 'app/models/RFx';
import { AuthService } from 'app/services/auth.service';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'app-dialog-content-example-dialog3',
  templateUrl: './dialog-content-example-dialog3.component.html',
  styleUrls: ['./dialog-content-example-dialog3.component.css']
})
export class DialogContentExampleDialog3Component implements OnInit {
  DialogueFormGroup: FormGroup;
  rfx = new RFxPartner;
  RFxPartners:RFxPartner[]=[];
  Users:string[]=[];
  SelectedUsers:string[]=[];
  constructor(private _formBuilder: FormBuilder,private masterService: MasterService, public dialogRef: MatDialogRef<DialogContentExampleDialog3Component>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { this.rfx = data.data;
    this.RFxPartners=data.RFxPartners;
    }

  ngOnInit(): void {
    this.RFxPartners.forEach(partner => {
      this.SelectedUsers.push(partner.User);
    });
    this.InitializeDialogueFormGroup();
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
