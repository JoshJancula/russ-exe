import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { SaveObject } from 'src/app/models/save-object.model';
import { Subscription, fromEvent } from 'rxjs';
import { MainStateActions } from 'src/app/redux-store/main/main.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/redux-store/app.state';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment';
import { PdfService } from 'src/app/services/pdf.service';
import { BurnCanvasComponent } from './components/burn-canvas/burn-canvas.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild('burnCanvas', null) burnCanvas: BurnCanvasComponent;
  @ViewChild('displayCanvas', null) displayCanvas: ElementRef;

  public patientInfo: Patient;
  public userInfo: User;
  public dataObject: SaveObject;
  private subs: Subscription[] = [];
  public environment = environment;
  public manualMode: boolean = true;
  public estimationType: string = null;
  public pdfView: boolean = false;
  public loading: boolean = false;

  public grandTotal: number = 0;
  public secondTotal: number = 0;
  public thirdTotal: number = 0;
  public fourthTotal: number = 0;

  public currentDate: string = null;
  public currentTime: string = null;
  private timeInterval: any = null;
  private startEstimationType: string = 'initial';

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
    private electronService: ElectronService,
    private pdfService: PdfService,
    private modalController: ModalController
  ) {
    if (environment.isElectron) {
      this.initElectron();
    }
    this.timeInterval = setInterval(() => { this.setTimeAndDate(); }, 1000);
  }

  ngOnInit(): void {
    let initialLoad = true;
    this.subs.push(this.store.select(state => state.main.saveData).subscribe((d: SaveObject) => {
      if (d) {
        this.dataObject = d;
        if (!environment.isMobileApp && this.burnCanvas) {
          this.burnCanvas.dataObject = d;
        }
        if (this.dataObject.amendmentHistory.length && initialLoad) {
          this.estimationType = 'amended';
        } else {
          this.estimationType = 'initial';
        }
        initialLoad = false;
      }
    }));
    this.subs.push(this.store.select(state => state.main.patientInfo).subscribe((p: Patient) => {
      if (p) {
        this.patientInfo = p;
        if (!environment.isMobileApp && this.burnCanvas) {
          this.burnCanvas.patientInfo = p;
        }
        if (this.patientInfo.medRecno) {
          this.manualMode = false;
        }
      }
    }));
    this.subs.push(this.store.select(state => state.main.userInfo).subscribe((u: User) => {
      if (u) {
        this.userInfo = u;
      }
    }));
    this.subs.push(this.store.select(state => state.main.canvasUrl).subscribe((url: string) => {
      if (url) {
        if (!environment.isMobileApp && this.burnCanvas) {
          setTimeout(() => {
            this.burnCanvas.drawDataURIOnCanvas(url, this.burnCanvas.cx);
          }, 500);
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
    clearInterval(this.timeInterval);
  }

  ngAfterContentInit(): void {
    // this.startEstimationType = this.dataObject.formType;
  }

  private initElectron(): void {
    this.loading = true;
    this.appActions.getElectronArgs().then((args: any) => {
      this.appActions.fetchSavedData().then((data: any) => {
        console.log('data... ', data);
        this.loading = false;
      }).catch(err => {
        console.log('error getting saved data.... ', err);
        this.loading = false;
      });
    }).catch(e => {
      console.log('error getting args.... ', e);
      this.loading = false;
    });
  }

  private setTimeAndDate(): void {
    this.currentDate = moment(new Date().toISOString()).format('MM/DD/YYYY');
    this.currentTime = moment(new Date().toISOString()).format('hh:mm a');
  }

  public returnCanvasClass(): string {
    return `${this.useThisRange()}-canvas`;
  }

  public setSex(sex: string): void {
    if (sex === 'm') {
      this.patientInfo.patientSex = 'male';
      const box: HTMLInputElement | any = document.getElementById('femaleBox');
      box.checked = false;
    } else {
      this.patientInfo.patientSex = 'female';
      const box: HTMLInputElement | any = document.getElementById('maleBox');
      box.checked = false;
    }
    this.appActions.setPatientInfo(this.patientInfo);
  }

  public updatePatientInfo(): void {
    this.appActions.setPatientInfo(this.patientInfo);
  }

  public setFormType(type: string): void {
    this.dataObject.formType = type;
    this.appActions.setSaveData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.setCanvasFill(type === 'burn' ? '#000306' : '#0080FF');
      this.burnCanvas.resetCanvas(true);
    }
  }

  public setBurnType(type: string): void {
    this.dataObject.burnType = type;
    this.appActions.setSaveData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.useTool('draw');
    }
  }

  public setSkinType(type: string): void {
    this.dataObject.skinType = type;
    this.appActions.setSaveData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.useTool('draw');
    }
  }

  public cancel(): void {
    this.electronService.ipcRenderer.send('cancel');
  }

  public setEstimationType(type: string): void {
    this.estimationType = type;
  }

  private updateAmendmentHistory(): void {
    this.dataObject.amendmentHistory.push({ name: this.userInfo.userName, date: moment(new Date().toISOString()).format('MM/DD/YYYY') });
    if (!this.dataObject.createdBy) {
      this.dataObject.createdBy = this.userInfo.userEsig;
    }
    this.appActions.setSaveData(this.dataObject);
  }

  public submitData(): void {
    this.updateAmendmentHistory();
    this.loading = true;
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    const url = canvas.toDataURL();
    const obj = {
      data: this.dataObject,
      canvasUrl: url,
      editMode: this.estimationType === 'initial' ? false : true
    };

    this.appActions.submitFormData(obj).then(() => {
      this.loading = false;
      // if (environment.isElectron) {
      //   this.electronService.ipcRenderer.send('saved');
      // }
    }).catch((e: any) => {
      this.loading = false;
      console.log('e... ', e);
    });
  }

  public generatePDF(): void {
    this.pdfView = true;
    if (!environment.isMobileApp) {
      this.burnCanvas.pdfView = true;
    }
    const div = document.getElementById('mainForm');
    const ogWidth = document.body.style.width;
    const ogWidth2 = div.style.width;
    div.style.width = '1000px';
    document.body.style.width = '1000px';
    this.resetForPDF().then(() => {
      this.pdfService.generatePDF('download', document.querySelector('#mainForm'), 'test', this.countRows()).then(() => {
        setTimeout(() => {
          this.makeCellsDarker(true);
          document.getElementById('mainForm').style.width = ogWidth2;
          document.body.style.width = ogWidth;
          this.pdfView = false;
          if (!environment.isMobileApp) {
            this.burnCanvas.pdfView = false;
          }
        }, 300);
      }).catch((e: any) => {
        this.pdfView = false;
        if (!environment.isMobileApp) {
          this.burnCanvas.pdfView = false;
        }
        this.makeCellsDarker(true);
        document.getElementById('mainForm').style.width = ogWidth2;
        document.body.style.width = ogWidth;
        console.log('e... ', e);
      });
    });
  }

  private countRows(): number {
    let count = 0;
    this.dataObject.tableData.forEach((r: any, i) => {
      if (r.total > 0) {
        count++;
      }
    });
    return count;
  }

  private resetForPDF(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.makeCellsDarker(false);
      setTimeout(() => resolve(), 500);
    });
  }

  public displayRow(row: any, i: number): boolean {
    if (this.pdfView && environment.onlyAddValidRowsToPDF) {
      if (this.grandTotal > 0) {
        if (this.dataObject.tableData[i].total === null || this.dataObject.tableData[i].total <= 0) {
          return false;
        }
      }
    }
    return true;
  }

  private makeCellsDarker(def: boolean): void {
    const tds = Array.from(document.getElementsByTagName('td'));
    const ths = Array.from(document.getElementsByTagName('th'));
    const hrs = Array.from(document.getElementsByTagName('hr'));
    tds.map(t => this.executeStyleUpdate(t, def));
    ths.map(t => this.executeStyleUpdate(t, def));
    hrs.map(t => this.executeStyleUpdate(t, def));
  }

  private executeStyleUpdate(el: any, def: boolean): void {
    if (!def) {
      el.style.border = '1px solid rgba(0, 0, 0, 0.5)';
    } else {
      el.style.border = '1px solid rgba(0, 0, 0, 0.12)';
    }
  }

  public calculateTotals(): void {
    this.grandTotal = 0;
    this.secondTotal = 0;
    this.thirdTotal = 0;
    this.fourthTotal = 0; // reset the totals and reder calc for each row
    this.tableRows.map(row => this.renderCalculation(row));
  }

  private renderCalculation(row: any): void { // get the row total
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

  public async openBurnCanvasModal(): Promise<any> {
    const modal = await this.modalController.create({
      component: BurnCanvasComponent,
      componentProps: {
        dataObject: this.dataObject,
        patientInfo: this.patientInfo
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const canvasEl: HTMLCanvasElement = this.displayCanvas.nativeElement;
      const context = canvasEl.getContext('2d');
      const img = new Image();
      img.addEventListener('load', () => {
        context.drawImage(img, 0, 0);
      });
      img.setAttribute('src', data.toString());
    }
  }

}
