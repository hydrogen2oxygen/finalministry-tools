import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CopyPasteComponent} from "./components/copy-paste/copy-paste.component";
import {MapComponent} from "./components/map/map.component";
import {WhatsappStatusComponent} from "./components/whatsapp-status/whatsapp-status.component";

const routes: Routes = [
  {path: '', redirectTo: 'DASHBOARD', pathMatch: 'full'},
  {path: 'DASHBOARD', component:DashboardComponent},
  {path: 'COPYPASTE', component:CopyPasteComponent},
  {path: 'TERRITORY', component:MapComponent},
  {path: 'WHATSAPP', component:WhatsappStatusComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
