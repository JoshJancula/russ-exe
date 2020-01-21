import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, AfterContentInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient.model';
import { BurnFormData } from 'src/app/models/burn-form-data.model';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-burn-canvas',
  templateUrl: './burn-canvas.component.html',
  styleUrls: ['./burn-canvas.component.scss'],
})
export class BurnCanvasComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('canvas', null) canvas: ElementRef;
  @Input() public patientInfo: Patient;
  @Input() public dataObject: BurnFormData;
  @Input() public pdfView: boolean = false;
  public cx: CanvasRenderingContext2D;
  public drawingSubscription: Subscription;
  public formTool: string = 'draw';
  public prevURL: string = null;
  public hasDrawnOnCanvas: boolean = false;
  private subs: Subscription[] = [];
  public environment = environment;

  constructor(private modalController: ModalController) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  ngAfterContentInit(): void {
    // get the context
    if (this.canvas) {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      this.cx = canvasEl.getContext('2d');
      canvasEl.width = 400;
      canvasEl.height = 500;
      this.cx.lineWidth = 5;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = this.dataObject.formType === 'burn' ? '#000306' : '#0080ff';
      this.captureEvents(canvasEl);
    } else {
      setTimeout(() => this.ngAfterContentInit(), 500);
    }
  }

  public resetCanvas(noReset?: boolean): void {
    if (!noReset) { this.savePrevCanvas(); }
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    this.cx.clearRect(0, 0, canvas.width, canvas.height);
    this.hasDrawnOnCanvas = false;
  }

  private savePrevCanvas(): void {
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    const url = canvas.toDataURL();
    this.prevURL = url;
  }

  public returnCanvasClass(): string {
    return `${this.useThisRange()}-canvas`;
  }

  public undoCanvasClear(): void {
    this.resetCanvas(true);
    this.drawDataURIOnCanvas(this.prevURL, this.cx);
  }

  public drawDataURIOnCanvas(strDataURI: string, context: CanvasRenderingContext2D): void {
    const img = new Image();
    img.addEventListener('load', () => {
      context.drawImage(img, 0, 0);
    });
    img.setAttribute('src', strDataURI);
    this.hasDrawnOnCanvas = true;
    this.prevURL = null;
  }

  public setCanvasFill(color: string): void {
    this.cx.strokeStyle = color;
    this.useTool('draw');
  }

  public useTool(tool: string): void {
    this.formTool = tool;
    if (tool === 'draw') {
      this.cx.globalCompositeOperation = 'source-over';
      this.cx.lineWidth = 3;
    } else if (tool === 'erase') {
      this.cx.globalCompositeOperation = 'destination-out';
      this.cx.lineWidth = 5;
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement): void {
    this.drawingSubscription = fromEvent(canvasEl, (environment.isMobileApp ? 'touchmove' : 'mousedown')).pipe(switchMap(e => {
      return fromEvent(canvasEl, (environment.isMobileApp ? 'touchmove' : 'mousemove')).pipe(
        takeUntil(fromEvent(canvasEl, (environment.isMobileApp ? 'touchend' : 'mouseup'))),
        takeUntil(fromEvent(canvasEl, 'mouseleave')),
        pairwise()
      );
    })
    ).subscribe((res: [MouseEvent, MouseEvent]) => {
      this.hasDrawnOnCanvas = true;
      const rect = canvasEl.getBoundingClientRect();
      const prevPos = {
        x: res[0].clientX - rect.left,
        y: res[0].clientY - rect.top
      };

      const currentPos = {
        x: res[1].clientX - rect.left,
        y: res[1].clientY - rect.top
      };

      this.drawOnCanvas(prevPos, currentPos);
      this.subs.push(this.drawingSubscription);
    });
  }

  public drawOnCanvas(prevPos: { x: number; y: number }, currentPos: { x: number; y: number }): void {
    if (!this.cx) { return; }
    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  public useThisRange(display?: boolean): string {
    if (this.patientInfo.patientAge < 1 || !this.patientInfo.patientAge) {
      return display ? '0-1 yr' : 'infant';
    } else if (this.patientInfo.patientAge >= 1 && this.patientInfo.patientAge < 5) {
      return display ? '1-4 yr' : 'oneToFour';
    } else if (this.patientInfo.patientAge >= 5 && this.patientInfo.patientAge < 10) {
      return display ? '5-9 yr' : 'fiveToNine';
    } else if (this.patientInfo.patientAge >= 10 && this.patientInfo.patientAge < 15) {
      return display ? '10-14 yr' : 'tenToFourteen';
    } else if (this.patientInfo.patientAge === 15) {
      return display ? '15 yr' : 'fifteen';
    } else if (this.patientInfo.patientAge >= 16) {
      return display ? 'Adult' : 'adult';
    }
  }

  public dismissModal(): void {
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    const url = canvas.toDataURL();
    this.modalController.dismiss(url);
  }


}
