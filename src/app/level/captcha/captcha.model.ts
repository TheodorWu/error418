import { environment } from '../../../environments/environment';


export class CaptchaAsset {
  id: number;
  path: string;
  flippedPath: string;
  flipped: boolean;
  partnerFound = false;

  constructor(id: number) {
    this.id = id;
    this.path = `assets/img/car${id}.png`;
    this.flippedPath = `assets/img/cardback.png`;
    this.flipped = false;
  }

  static copyCaptchaAsset(captcha: CaptchaAsset): CaptchaAsset {
    return new CaptchaAsset(captcha.id);
  }
}

export class CaptchaModel {
  task: string;
  subtask: string;
  assets: Array<CaptchaAsset>;


  constructor(task: string, subtask: string, assets: Array<CaptchaAsset>) {
    this.assets = assets;
    this.task = task;
    this.subtask = subtask;
  }

}

export const CAPTCHAS: Array<CaptchaModel> = [
  new CaptchaModel('Find all car pairs', 'Please verify that you\'re human by solving this Captcha', [
    new CaptchaAsset(1),
    new CaptchaAsset(2),
    new CaptchaAsset(3),
    new CaptchaAsset(4),
    new CaptchaAsset(5),
    new CaptchaAsset(6),
    new CaptchaAsset(7),
    new CaptchaAsset(8),
    new CaptchaAsset(9),
    new CaptchaAsset(10),
  ]),
];
