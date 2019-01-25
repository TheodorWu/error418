import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrls: ['./story-dialog.component.scss']
})
export class StoryDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<StoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}
}
