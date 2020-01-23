import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class Html2CanvasService {
  constructor() {
  }

  public async getCanvas(ele: any): Promise<any> {
    if (!ele) {
      return;
    }
    const option = { height: 3200, allowTaint: true, useCORS: true };
    return html2canvas(ele, option).then((canvas: any) => {
      if (canvas) {
        return canvas;
      }
      return null;
    }).catch((res: any) => {
      console.log(res);
      return res;
    });
  }

}
