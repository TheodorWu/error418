import { Component, OnInit } from '@angular/core';
import { CaptchaModel, CAPTCHAS, CaptchaAsset } from './captcha.model';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

  currentCaptcha: CaptchaModel;
  currentlyRevealed: Array<CaptchaAsset> = [];

  constructor(private errorService: NewsService) {
  }

  ngOnInit() {
    this.currentCaptcha = CAPTCHAS[0];
    const copiedArray = this.currentCaptcha.assets.map((captcha) => CaptchaAsset.copyCaptchaAsset(captcha));
    this.currentCaptcha.assets = this.shuffle(this.currentCaptcha.assets.concat(copiedArray));
  }

  isSolved(): boolean {
    return false;
  }

  flip(captcha: CaptchaAsset, index: number) {
      if (captcha.flipped) {
        document.getElementById('Card' + index).setAttribute('style', 'transform: rotateY( 0deg );');
        const idx = this.currentlyRevealed.indexOf(captcha);
        if (idx > -1) {
          this.currentlyRevealed.splice(idx, 1);
        }
      } else {
        if (this.currentlyRevealed.length > 2) {
          this.errorService.showErrorMsg('Action not Allowed', 'You have already revealed two Cards');
        } else {
          document.getElementById('Card' + index).setAttribute('style', 'transform: rotateY( 180deg );');
          this.currentlyRevealed.push(captcha);
          if (this.currentlyRevealed.length === 2) {
            if (this.currentlyRevealed[0].id === this.currentlyRevealed[1].id) {
              this.currentlyRevealed = [];
            }
          }
        }
      }
      captcha.flipped = !captcha.flipped;
      console.log(this.currentlyRevealed);

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

}
