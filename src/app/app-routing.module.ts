import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AgbComponent } from './level/agb/agb.component';
import { NotfoundComponent } from './level/notfound/notfound.component';

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'agb', component: AgbComponent },
  { path: '404', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
