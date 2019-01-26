import { environment } from '../../../environments/environment';


export class CaptchaAsset {
  id: number;
  path: string;
  flippedPath: string;
  flipped: boolean;

  constructor(id: number) {
    this.id = id;
    this.path = `${environment.deployUrl}assets/img/car${id}.png`;
    this.flippedPath = `${environment.deployUrl}assets/captchas/AssetFlipped.png`;
    this.flipped = false;
  }

  static copyCaptchaAsset(captcha: CaptchaAsset): CaptchaAsset {
    return new CaptchaAsset(captcha.id);
  }
}

export class CaptchaModel {
  task: string;
  assets: Array<CaptchaAsset>;

  constructor(task: string, assets: Array<CaptchaAsset>) {
    this.assets = assets;
    this.task = task;
  }

}

export const CAPTCHAS: Array<CaptchaModel> = [
  new CaptchaModel('Find all cars!', [
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
