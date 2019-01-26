import { Component, OnInit } from '@angular/core';
import { CaptchaModel, CAPTCHAS, CaptchaAsset } from './captcha.model';
import { NewsService } from 'src/app/services/news.service';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

  currentCaptcha: CaptchaModel;
  currentlyRevealed: Array<CaptchaAsset> = [];

  constructor(private msgService: NewsService, private story: StoryService) {
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.currentCaptcha = new CaptchaModel(CAPTCHAS[0].task, CAPTCHAS[0].subtask, CAPTCHAS[0].assets.map((captcha) => CaptchaAsset.copyCaptchaAsset(captcha)));
    const copiedArray = this.currentCaptcha.assets.map((captcha) => CaptchaAsset.copyCaptchaAsset(captcha));
    this.currentCaptcha.assets = this.shuffle(this.currentCaptcha.assets.concat(copiedArray));
  }

  isSolved(): boolean {
    let result = true;
    this.currentCaptcha.assets.forEach(element => {
      result = result && element.partnerFound;
    });
    return !result;
  }

  flip(captcha: CaptchaAsset, index: number) {
    if (captcha.partnerFound) {
      this.msgService.showErrorMsg('Already Solved', 'Why would you try that one again ?');
    } else {

      if (captcha.flipped) {
        document.getElementById('Card' + index).setAttribute('style', 'transform: rotateY( 0deg );');
        const idx = this.currentlyRevealed.indexOf(captcha);
        if (idx > -1) {
          this.currentlyRevealed.splice(idx, 1);
        }
      } else {
        if (this.currentlyRevealed.length >= 2) {
          this.msgService.showErrorMsg('Action not Allowed', 'You have already revealed two Cards');
        } else {
          document.getElementById('Card' + index).setAttribute('style', 'transform: rotateY( 180deg );');
          this.currentlyRevealed.push(captcha);
          if (this.currentlyRevealed.length === 2) {
            if (this.currentlyRevealed[0].id === this.currentlyRevealed[1].id) {
              this.msgService.showErrorMsg('You Got a Pair', 'Congratulations...');
              this.currentlyRevealed[0].partnerFound = true;
              this.currentlyRevealed[1].partnerFound = true;
              this.currentlyRevealed = [];
            }
          }
        }
      }
      captcha.flipped = !captcha.flipped;
    }
  }

  shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

  next() {
    this.story.openNextStoryMsg();
  }

}
