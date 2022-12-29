import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CopyPasteComponent} from "./components/copy-paste/copy-paste.component";

const routes: Routes = [
  {path: '', redirectTo: 'DASHBOARD', pathMatch: 'full'},
  {path: 'DASHBOARD', component:DashboardComponent},
  {path: 'COPYPASTE', component:CopyPasteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
