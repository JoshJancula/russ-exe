import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { SaveObject } from 'src/app/models/save-object.model';
import { Subscription, fromEvent } from 'rxjs';
import { MainStateActions } from 'src/app/redux-store/main/main.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/redux-store/app.state';
import { environment } from 'src/environments/environment';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  public patientInfo: Patient;
  public userInfo: User;
  public dataObject: SaveObject;
  private subs: Subscription[] = [];
  public manualMode: boolean = true;

  public grandTotal: number = 0;
  public secondTotal: number = 0;
  public thirdTotal: number = 0;
  public fourthTotal: number = 0;

  @ViewChild('canvas', null) canvas: ElementRef;
  public cx: CanvasRenderingContext2D;
  public drawingSubscription: Subscription;
  public formTool: string = 'draw';

  public tableRows: any[] = [
    { display: 'Head', name: 'head', infant: 19, oneToFour: 12, fiveToNine: 13, tenToFourteen: 11, fifteen: 8, adult: 7 },
    { display: 'Neck', name: 'neck', infant: 2, oneToFour: 2, fiveToNine: 2, tenToFourteen: 2, fifteen: 2, adult: 2 },
    { display: 'Anterior Trunk', name: 'anteriorTrunk', infant: 13, oneToFour: 13, fiveToNine: 13, tenToFourteen: 13, fifteen: 13, adult: 13 },
    { display: 'Posterior Trunk', name: 'posteriorTrunk', infant: 13, oneToFour: 13, fiveToNine: 13, tenToFourteen: 13, fifteen: 13, adult: 13 },
    { display: 'Right Buttock', name: 'rightButtock', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
    { display: 'Left Buttock', name: 'leftButtock', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
    { display: 'Genetalia', name: 'genetalia', infant: 1, oneToFour: 1, fiveToNine: 1, tenToFourteen: 1, fifteen: 1, adult: 1 },
    { display: 'Right Upper Arm', name: 'rightUpperArm', infant: 4, oneToFour: 4, fiveToNine: 4, tenToFourteen: 4, fifteen: 4, adult: 4 },
    { display: 'Left Upper Arm', name: 'leftUpperArm', infant: 4, oneToFour: 4, fiveToNine: 4, tenToFourteen: 4, fifteen: 4, adult: 4 },
    { display: 'Right Lower Arm', name: 'rightLowerArm', infant: 3, oneToFour: 3, fiveToNine: 3, tenToFourteen: 3, fifteen: 3, adult: 3 },
    { display: 'Left Lower Arm', name: 'leftLowerArm', infant: 3, oneToFour: 3, fiveToNine: 3, tenToFourteen: 3, fifteen: 3, adult: 3 },
    { display: 'Right Hand', name: 'rightHand', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
    { display: 'Left Hand', name: 'leftHand', infant: 2.5, oneToFour: 2.5, fiveToNine: 2.5, tenToFourteen: 2.5, fifteen: 2.5, adult: 2.5 },
    { display: 'Right Thigh', name: 'rightThigh', infant: 5.5, oneToFour: 6.5, fiveToNine: 8, tenToFourteen: 8.5, fifteen: 9, adult: 9.5 },
    { display: 'Left Thigh', name: 'leftThigh', infant: 5.5, oneToFour: 6.5, fiveToNine: 8, tenToFourteen: 8.5, fifteen: 9, adult: 9.5 },
    { display: 'Right Leg', name: 'rightLeg', infant: 5, oneToFour: 5, fiveToNine: 5.5, tenToFourteen: 6, fifteen: 6.5, adult: 7 },
    { display: 'Left Leg', name: 'leftLeg', infant: 5, oneToFour: 5, fiveToNine: 5.5, tenToFourteen: 6, fifteen: 6.5, adult: 7 },
    { display: 'Right Foot', name: 'rightFoot', infant: 3.5, oneToFour: 3.5, fiveToNine: 3.5, tenToFourteen: 3.5, fifteen: 3.5, adult: 3.5 },
    { display: 'Left Foot', name: 'leftFoot', infant: 3.5, oneToFour: 3.5, fiveToNine: 3.5, tenToFourteen: 3.5, fifteen: 3.5, adult: 3.5 }
  ];

  constructor(
    private appActions: MainStateActions,
    private store: Store<AppState>,
  ) {
    if (environment.isElectron) {
      this.initElectron();
    }
  }

  ngOnInit(): void {
    this.subs.push(this.store.select(state => state.main.patientInfo).subscribe((p: Patient) => {
      if (p) {
        this.patientInfo = p;
        if (this.patientInfo.patientName) {
          this.manualMode = false;
        }
      }
    }));
    this.subs.push(this.store.select(state => state.main.userInfo).subscribe((u: User) => {
      if (u) {
        this.userInfo = u;
      }
    }));
    this.subs.push(this.store.select(state => state.main.saveData).subscribe((d: SaveObject) => {
      if (d) {
        this.dataObject = d;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = 400;
    canvasEl.height = 500;
    this.cx.lineWidth = 5;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000306';
    this.captureEvents(canvasEl);
  }

  private initElectron(): void {
    this.appActions.getElectronArgs().then(() => {
      this.appActions.fetchSavedData().then((data: any) => {
        console.log('data... ', data);
      }).catch(err => {
        console.log('error getting saved data... ', err);
      });
    }).catch(e => {
      console.log('error getting args.... ', e);
    });
  }

  public renderTableCells(): void {
    //
  }

  public setSex(sex: string): void {
    //
  }

  public setFormType(type: string): void {
    this.dataObject.formType = type;
    this.appActions.setSaveData(this.dataObject);
  }

  public setBurnType(type: string): void {
    this.dataObject.burnType = type;
    this.appActions.setSaveData(this.dataObject);
  }

  public setSkinType(type: string): void {
    this.dataObject.skinType = type;
    this.appActions.setSaveData(this.dataObject);
  }

  public resetCanvas(): void {
    //
  }

  public setCanvasFill(color: string): void {
    this.cx.strokeStyle = color;
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

  public cancel(): void {
    //
  }

  public submitData(): void {
    //
  }

  public generatePDF(): void {
    //
  }

  public returnCanvasClass() {
    return `${this.useThisRange()}-canvas`;
  }

  public calculateTotals(): void {
    this.grandTotal = 0;
    this.secondTotal = 0;
    this.thirdTotal = 0;
    this.fourthTotal = 0; // reset the totals and reder calc for each row
    this.tableRows.map(row => this.renderCalculation(row));
  }

  private renderCalculation(row: any) { // get the row total
    const dataRow = this.dataObject.tableData.find(r => r.name === row.name);
    const second = dataRow.secondDegree;
    const third = dataRow.thirdDegree;
    const fourth = dataRow.fourthDegree;
    const rowTotal = parseFloat(second ? second : 0) + parseFloat(third ? third : 0) + parseFloat(fourth ? fourth : 0);
    dataRow.secondDegree = second > 0 ? second : null; // set the values
    dataRow.thirdDegree = third > 0 ? third : null;
    dataRow.fourthDegree = fourth > 0 ? fourth : null;
    dataRow.total = rowTotal > 0 ? rowTotal : null;
    const maxAllowed = row[this.useThisRange()]; // get the max allowed for the current range
    this.grandTotal += rowTotal; // update the totals
    this.secondTotal += parseFloat(second ? second : 0);
    this.thirdTotal += parseFloat(third ? third : 0);
    this.fourthTotal += parseFloat(fourth ? fourth : 0);
    if (rowTotal > maxAllowed) {
      dataRow.hasError = true;
    } else {
      dataRow.hasError = false;
    }
    this.appActions.setSaveData(this.dataObject);
  }

  public useThisRange(): string {
    if (this.patientInfo.patientAge < 1 || !this.patientInfo.patientAge) {
      return 'infant';
    } else if (this.patientInfo.patientAge >= 1 && this.patientInfo.patientAge < 5) {
      return 'oneToFour';
    } else if (this.patientInfo.patientAge >= 5 && this.patientInfo.patientAge < 10) {
      return 'fiveToNine';
    } else if (this.patientInfo.patientAge >= 10 && this.patientInfo.patientAge < 15) {
      return 'tenToFourteen';
    } else if (this.patientInfo.patientAge === 15) {
      return 'fifteen';
    } else if (this.patientInfo.patientAge >= 16) {
      return 'adult';
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement): void {
    this.drawingSubscription = fromEvent(canvasEl, 'mousedown').pipe(switchMap(e => {
      return fromEvent(canvasEl, 'mousemove').pipe(
        takeUntil(fromEvent(canvasEl, 'mouseup')),
        takeUntil(fromEvent(canvasEl, 'mouseleave')),
        pairwise()
      );
    })
    ).subscribe((res: [MouseEvent, MouseEvent]) => {
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
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

}
