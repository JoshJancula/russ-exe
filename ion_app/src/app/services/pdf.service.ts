import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public generatePDF(action: string, div: any, title: string, totalRows?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      html2canvas(div, {height: 3200 }).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const position = window.innerWidth < 600 ? -80 : window.innerWidth >= 600 && window.innerWidth < 800 ? -60 : -20;
        setTimeout(() => {
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, '', 'FAST');
          if (action === 'download') {
            pdf.save(title);
            resolve();
          } else if (action === 'print') {
            const blob = pdf.output('blob');
            resolve();
          }
        }, 300);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

}
