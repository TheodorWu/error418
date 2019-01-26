import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { STORY_TXT } from '../../assets/texts/StoryLine';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StoryService {

  msgCounter = 0;
  dialogIsOpen = false;

  constructor(
    public dialog: MatDialog,
    private router: Router) { }

  // openStoryMsg(id: number) {
  //   const dialogRef = this.dialog.open(StoryDialogComponent, {
  //     width: '90%',
  //     height: '90%',
  //     disableClose: true,
  //     panelClass: 'story-panel',
  //     data: STORY_TXT.find(txt => txt.num === id).content
  //   });
  //   this.msgCounter = id;
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  openNextStoryMsg(): Observable<any> {
    const storyElm = STORY_TXT.find(txt => txt.num === this.msgCounter);
    console.log(this.msgCounter);

    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      panelClass: 'story-panel',
      data: storyElm.content
    });
    this.dialogIsOpen = true;
    this.msgCounter++;

    dialogRef.afterClosed().subscribe(result => {
      this.dialogIsOpen = false;
      if (storyElm.next) {
        this.router.navigate(storyElm.next);
      }
    });

    return dialogRef.afterClosed();
  }

  isCompleted(): boolean {
    return STORY_TXT.pop().num <= this.msgCounter;
  }
}
