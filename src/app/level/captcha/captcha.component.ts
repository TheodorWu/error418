import { Component, OnInit } from '@angular/core';
import { CaptchaModel, CAPTCHAS, CaptchaAsset } from './captcha.model';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

  currentCaptcha: CaptchaModel;
  currentlyRevealed = [];

  constructor() { }

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
      document.getElementById('Card' + index).setAttribute('style', 'transform: rotateY( 180deg );');
      this.currentlyRevealed.push(captcha);
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
