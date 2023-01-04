export class WhatsappStatus {
  elements:WhatsappElement[] = [];
  idCounter:number = 0;

  addElement(text:string):void{
    let element = new WhatsappElement();
    element.id = this.idCounter++;
    element.text = text;
    this.elements.push(element);
  }
}

export class WhatsappElement {
  id:number = 0;
  text:string = '';
  color:string = '#ffffff';
  bgcolor:string = '#000000';
  font:string = 'Arial'

  getStyle():string {
    return `font-family: ${this.font}; background-color: ${this.bgcolor}; color: ${this.color}; margin: 0px; padding: 0.3rem`;
  }
}
