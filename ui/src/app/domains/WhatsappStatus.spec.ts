import {WhatsappStatus} from "./WhatsappStatus";

describe('WhatsappStatusComponent', () => {
  let whatsappStatus:WhatsappStatus;

  beforeEach(async () => {
    whatsappStatus = new WhatsappStatus();
    whatsappStatus.rawText = "*HELLO*\n" +
      "---\n" +
      "This is a new paragraph\n" +
      "---\n" +
      "A new block\n" +
      "---";
    whatsappStatus.transformRawTextToElements();
  });

  it('should be 4', () => {
    expect(whatsappStatus.elements.length).toBe(4);
    console.log(whatsappStatus)
  });

});
