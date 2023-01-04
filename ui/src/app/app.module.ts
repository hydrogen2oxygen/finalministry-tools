import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CopyPasteComponent } from './components/copy-paste/copy-paste.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { MapComponent } from './components/map/map.component';
import {HttpClientModule} from "@angular/common/http";
import { WhatsappStatusComponent } from './components/whatsapp-status/whatsapp-status.component';
import {ColorPickerModule} from "ngx-color-picker";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CopyPasteComponent,
    MapComponent,
    WhatsappStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ColorPickerModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
