import { Component, OnInit } from '@angular/core';
import {LocalStorageDB} from "../../domains/LocalStorageDB";
import {LocalStorageService} from "../../services/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  localStorageDB: LocalStorageDB = new LocalStorageDB();
  constructor(
    private router:Router,
    private localStorageService:LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageDB = this.localStorageService.loadUuidInsideLocalStorage();
  }

  navigateToTerritory(uuid:string|undefined) {
    this.router.navigateByUrl(`/TERRITORY?id=${uuid}`)
  }
}
