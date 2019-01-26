import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { STORY_TXT } from '../../assets/texts/StoryLine';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class StoryService {

  msgCounter = 0;

  constructor(
    public dialog: MatDialog,
    private router: Router) { }

  openStoryMsg(id: number) {
    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      panelClass: 'story-panel',
      data: STORY_TXT.find(txt => txt.num === id).content
    });

    dialogRef.afterClosed().subscribe(result => {
      this.msgCounter = id;
    });
  }

  openNextStoryMsg() {

    const storyElm = STORY_TXT.find(txt => txt.num === this.msgCounter);

    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      panelClass: 'story-panel',
      data: storyElm.content
    });

    dialogRef.afterClosed().subscribe(result => {
      this.msgCounter++;
      this.router.navigate(storyElm.next);
    });
  }
}
