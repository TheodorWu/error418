import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AgbComponent } from './level/agb/agb.component';
import { NotfoundComponent } from './level/notfound/notfound.component';
import { LoadingComponent } from './level/loading/loading.component';
import { DownloadsComponent } from './level/downloads/downloads.component';
import { CaptchaComponent } from './level/captcha/captcha.component';

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'agb', component: AgbComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'captcha', component: CaptchaComponent }
  { path: 'downloads', component: DownloadsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
