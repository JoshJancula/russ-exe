import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment.prod';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private printIframe: HTMLIFrameElement | any;
  private debug: boolean = true;

  constructor(private electronService: ElectronService) { }

  public generatePDF(action: string, div: HTMLElement, title: string, totalRows?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      html2canvas(div, { height: 3200 }).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight() + 40;
        const position = window.innerWidth < 600 ? -80 : window.innerWidth >= 600 && window.innerWidth < 800 ? -60 : -50;
        setTimeout(() => {
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, '', 'FAST');
          if (action === 'download') {
            if (!environment.isElectron || !this.debug) {
              // pdf.save(title);
              // pdf.output('save', title);
              resolve();
            } else {
              // console.log('blob.... ', pdf.output('datauristring').toString());
              this.electronService.ipcRenderer.send('save-pdf', imgData);
              this.electronService.ipcRenderer.on('pdf-complete', (event, args) => {
                if (args.err) {
                  reject(args.err);
                } else {
                  resolve();
                }
              });
            }
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
