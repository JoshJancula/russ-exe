import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { Html2CanvasService } from './html2canvas.service';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private printIframe: HTMLIFrameElement | any;

  constructor(
    private electronService: ElectronService,
    private canvasService: Html2CanvasService) { }

  public generatePDF(action: string, div: HTMLElement, title: string, totalRows?: number): Promise<void> {
    return new Promise((resolve, reject) => {

      this.html2canvas(div).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight() + 140;
        setTimeout(() => {
          pdf.addImage(imgData, 'PNG', 0, null, pdfWidth, pdfHeight, '', 'FAST');
          if (action === 'download') {
            try {
              pdf.save(title);
              resolve();
              // this.electronService.ipcRenderer.send('save-pdf', canvas.toDataURL('image/png'));
              // this.electronService.ipcRenderer.on('print-task-complete', (event, args) => {
              //   resolve();
              // });
            } catch (e) {
              console.log('e... ', e);
              resolve();
            } // WIP
          } else if (action === 'print') {
            const blob = pdf.output('blob');
            this.print(blob).then(() => {
              resolve();
            }).catch((err: any) => {
              reject(err);
            });
          }
        }, 300);
      }).catch((err: any) => {
        reject(err);
      });

    });
  }

  public html2canvas(div: HTMLElement): Promise<any> {
    // this is ridiculous but there is a bug with ionic and
    // html2pdf over shadowed root vars in duplicated stylesheets
    // so we need to do this and have that service to accomodate
    return new Promise((resolve, reject) => {
      const element = document.getElementById('html2canvas');
      const targetElement = div.cloneNode(true);
      element.appendChild(targetElement);
      this.canvasService.getCanvas(element.firstChild).then((c: any) => {
        resolve(c);
        element.firstChild.remove();
      }).catch((res: any) => {
        console.log(res);
        reject(res);
      });
    });
  }

  private print(blob: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try { // WIP
        const fileUrl = URL.createObjectURL(blob);
        let iframe = this.printIframe;
        if (!this.printIframe) {
          iframe = this.printIframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          iframe.style.display = 'none';
          iframe.onload = () => {
            setTimeout(() => {
              iframe.focus();
              iframe.contentWindow.print();
            }, 100);
          };
        }
        iframe.src = fileUrl;
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

}
