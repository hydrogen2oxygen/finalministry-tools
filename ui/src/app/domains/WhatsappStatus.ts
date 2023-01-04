import {ValueTypes} from "ol/style/expressions";
import COLOR = ValueTypes.COLOR;

export class WhatsappStatus {
  rawText:string = '';
  elements:WhatsappElement[] = [];
  idCounter:number = 0;

  transformRawTextToElements():void {

    this.idCounter = 0;
    this.elements = [];

    let paragraphs:string[] = this.rawText.split("---");

    paragraphs.forEach( p => {
      p = p.trim();
      if (p.startsWith("*") && p.endsWith("*")) {
        this.addElement(this.idCounter++, p.replaceAll("*",""), 1);
      } else {
        this.addElement(this.idCounter++, p, 2);
      }
    })
  }

  addElement(id:number, text:string, type:number):void{
    let element = new WhatsappElement();
    element.id = id;
    element.text = text;
    element.type = type;
    this.elements.push(element);
  }
}

export class WhatsappElement {
  id:number = 0;
  text:string = '';
  type:number = 0;
  color:string = '#ffffff';
  bgcolor:string = '#000000';

  getStyle():string {
    return `background-color: ${this.bgcolor}; color: ${this.color}; margin: 0px`;
  }
}
