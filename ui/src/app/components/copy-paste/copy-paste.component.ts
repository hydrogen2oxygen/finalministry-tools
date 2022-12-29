import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {ToastrModule, ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-copy-paste',
  templateUrl: './copy-paste.component.html',
  styleUrls: ['./copy-paste.component.scss']
})
export class CopyPasteComponent implements OnInit {

  copyPasteForm = this.formBuilder.group({
    text: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
  }

  cleanText() {
    this.copyPasteForm?.get('text')?.setValue(this.clean(this.copyPasteForm?.get('text')?.value));

    setTimeout(()=>{this.copyPasteForm?.get('text')?.setValue("")},5000);
  }

  clean(text:string|null|undefined):string {
    if (text === undefined) return "";
    if (text === null) return "";

    text = text.replace(/\+/gi,"");
    text = text.replace(/\*/gi,"");

    let i = 2;

    for (i = 2; i < 500; i++) {
      text = text.replace(` ${i} `," ");
      text = text.replace(`\n${i} `,"\n ");
    }

    this.copyMessage(text);
    return text;
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();

    let text_to_copy = document.getElementById("textarea")?.innerHTML;
    let that = this;

    if (!navigator.clipboard) {
      document.execCommand('copy');
    } else {
      navigator.clipboard.writeText(val).then(
        function () {
          that.toastr.success(`Text copied to clipboard!`) // success
        })
        .catch(
          function () {
            that.toastr.error("Copy to clipboard failed!") // error
          });
    }

    document.body.removeChild(selBox);
  }
}
