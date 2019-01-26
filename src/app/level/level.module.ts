import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgbComponent } from './agb/agb.component';
import { LoadingComponent } from './loading/loading.component';
import { LanguageComponent } from './language/language.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { MaterialModule } from '../material.module';
import { CaptchaComponent } from './captcha/captcha.component';
import { CaptchaCardComponent } from './captcha/captcha-card/captcha-card.component';

@NgModule({
  declarations: [AgbComponent, LoadingComponent, LanguageComponent, NotfoundComponent, CaptchaComponent, CaptchaCardComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports:
  [AgbComponent],
})
export class LevelModule { }
