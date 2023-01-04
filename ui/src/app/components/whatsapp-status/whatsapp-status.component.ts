import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {WhatsappElement, WhatsappStatus} from "../../domains/WhatsappStatus";

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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.whatsappText.get('text')?.setValue('*HI!*\n' +
      '---\n' +
      'This is a test');
    this.actualizeText()
  }

  actualizeText() {
    // @ts-ignore
    this.whatsappStatus.rawText = this.whatsappText.get('text').value;
    this.whatsappStatus.transformRawTextToElements();
  }

  elementClick(element: WhatsappElement) {
    this.selectedElement = element;
  }
}
