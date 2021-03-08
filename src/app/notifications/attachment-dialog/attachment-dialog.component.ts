import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { saveAs } from 'file-saver';

@Component({
  selector: 'attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AttachmentDialogComponent implements OnInit {
  public AttachmentData: any;
  constructor(
    public matDialogRef: MatDialogRef<AttachmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public attachmentDetails: any,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const fileURL = URL.createObjectURL(this.attachmentDetails.blob);
    this.AttachmentData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
  }

  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
  downloadFile(): void {
    saveAs(this.attachmentDetails.blob, this.attachmentDetails.FileName);
  }

}
