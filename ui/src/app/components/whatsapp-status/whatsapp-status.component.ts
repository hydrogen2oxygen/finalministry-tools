import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {WhatsappElement, WhatsappStatus} from "../../domains/WhatsappStatus";
import {FontsChecker} from "../../utilities/FontsChecker";

@Component({
  selector: 'app-whatsapp-status',
  templateUrl: './whatsapp-status.component.html',
  styleUrls: ['./whatsapp-status.component.scss']
})
export class WhatsappStatusComponent implements OnInit {

  whatsappStatus: WhatsappStatus = new WhatsappStatus();
  whatsappText = this.formBuilder.group({
    text: ''
  });
  color: any;
  selectedElement: WhatsappElement|undefined;
  availableFonts:string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {

    let fontsChecker:FontsChecker = new FontsChecker();
    this.availableFonts = fontsChecker.availableFonts();
  }

  elementClick(element: WhatsappElement) {
    this.selectedElement = element;
    this.whatsappText.get('text')?.setValue(element.text);
  }

  closeEditMode() {
    this.selectedElement = undefined;
  }

  selectFont(font: string) {
    // @ts-ignore
    this.selectedElement.font = font;
  }

  addElement() {
    this.whatsappStatus.addElement("TEXT")
  }

  actualizeText() {
    // @ts-ignore
    this.selectedElement.text = this.whatsappText.get('text')?.value;
  }
}
