import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(public dialog: MatDialog) { }

  openStoryMsg(txt: string) {
    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      panelClass: 'story-panel',
      data: txt
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Dialog was closed', result);
    });
  }
}
