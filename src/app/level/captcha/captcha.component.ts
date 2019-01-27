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
  currentlyRevealed: Map<string, CaptchaAsset> = new Map<string, CaptchaAsset>();

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
      this.msgService.showPositiveMsg('Already Solved', 'Why would you try that one again ?');
    } else {
      const idx = 'Card' + index;
      if (captcha.flipped) {
        document.getElementById(idx).setAttribute('style', 'transform: rotateY( 0deg );');
        this.currentlyRevealed.delete(idx);
        captcha.flipped = !captcha.flipped;
      } else {
        if (this.currentlyRevealed.size >= 2) {
          this.msgService.showErrorMsg('Action not Allowed', 'You have already revealed two Cards');
          this.currentlyRevealed.forEach((value: CaptchaAsset, key: string) => {
            document.getElementById(key).setAttribute('style', 'transform: rotateY( 0deg );');
            value.flipped = !value.flipped;
          });
          this.currentlyRevealed = new Map<string, CaptchaAsset>();
          console.log(this.currentlyRevealed);
        } else {
          document.getElementById(idx).setAttribute('style', 'transform: rotateY( 180deg );');
          captcha.flipped = !captcha.flipped;
          this.currentlyRevealed.set(idx, captcha);
          if (this.currentlyRevealed.size === 2) {
            let lastId: number;
            let sameId = true;
            this.currentlyRevealed.forEach((value: CaptchaAsset, key: string) => {
              sameId = lastId === value.id;
              lastId = value.id;
            });

            if (sameId) {
              this.msgService.showPositiveMsg('You Got a Pair', 'Congratulations...');
              this.currentlyRevealed.forEach((value: CaptchaAsset, key: string) => {
                value.partnerFound = true;
              });
              this.currentlyRevealed = new Map<string, CaptchaAsset>();
              console.log(this.currentlyRevealed);
            }
          }
        }
      }
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
