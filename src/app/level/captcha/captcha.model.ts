import { environment } from '../../../environments/environment';


export class CaptchaAsset {
  id: number;
  path: string;
  flippedPath: string;
  flipped: boolean;

  constructor(id: number) {
    this.id = id;
    this.path = `${environment.deployUrl}assets/captchas/Asset${id}.png`;
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
  ]),
];
