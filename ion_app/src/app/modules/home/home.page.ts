import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { BurnFormData } from 'src/app/models/burn-form-data.model';
import { Subscription, fromEvent } from 'rxjs';
import { MainStateActions } from 'src/app/redux-store/main/main.actions';
import { MainStateSelectors } from 'src/app/redux-store/main/main.selectors';
import { Store, State } from '@ngrx/store';
import { AppState } from 'src/app/redux-store/app.state';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment';
import { PdfService } from 'src/app/services/pdf.service';
import { BurnCanvasComponent } from './components/burn-canvas/burn-canvas.component';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('burnCanvas', null) burnCanvas: BurnCanvasComponent;
  @ViewChild('displayCanvas', null) displayCanvas: ElementRef;

  public patientInfo: Patient;
  public userInfo: User;
  public dataObject: BurnFormData;
  private subs: Subscription[] = [];
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
  public maxDate: string = moment(new Date().toISOString()).format('YYYY-MM-DD');
  public environment = environment;

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
    private appSelectors: MainStateSelectors,
    private state: State<AppState>,
    private electronService: ElectronService,
    private pdfService: PdfService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {
    if (environment.isElectron) {
      this.initElectron();
    }
    this.setSubs();
    this.timeInterval = setInterval(() => { this.setTimeAndDate(); }, 1000);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
    clearInterval(this.timeInterval);
  }

  private initElectron(): void {
    this.loading = true;
    this.appActions.fetchSavedData().then((data: any) => {
      this.loading = false;
    }).catch(err => {
      console.log('error getting saved data.... ', err);
      this.loading = false;
    });
  }

  private setSubs(): void {
    this.subs.push(this.appSelectors.burnFormData.subscribe((b: BurnFormData) => {
      if (b) {
        this.dataObject = b;
        if (!environment.isMobileApp && this.burnCanvas) {
          this.burnCanvas.dataObject = b;
        }
        if (this.dataObject.amendmentHistory.length) {
          this.estimationType = 'amended';
        } else {
          this.estimationType = 'initial';
        }
      }
    }));
    this.subs.push(this.appSelectors.patientInfo.subscribe((p: Patient) => {
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
    this.subs.push(this.appSelectors.userInfo.subscribe((u: User) => {
      if (u) { this.userInfo = u;  }
    }));
    this.subs.push(this.appSelectors.canvasUrl.subscribe((url: string) => {
      if (url) {
        if (!environment.isMobileApp && this.burnCanvas) {
          setTimeout(() => {
            this.burnCanvas.drawDataURIOnCanvas(url, this.burnCanvas.cx);
          }, 500);
        }
      }
    }));
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
    this.appActions.setburnFormData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.setCanvasFill(type === 'burn' ? '#000306' : '#0080FF');
      this.burnCanvas.resetCanvas(true);
    }
  }

  public setBurnType(type: string): void {
    this.dataObject.burnType = type;
    this.appActions.setburnFormData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.useTool('draw');
    }
  }

  public setSkinType(type: string): void {
    this.dataObject.skinType = type;
    this.appActions.setburnFormData(this.dataObject);
    if (!environment.isMobileApp) {
      this.burnCanvas.useTool('draw');
    }
  }

  public setEstimationType(type: string): void {
    this.estimationType = type;
  }

  private updateAmendmentHistory(): void {
    this.dataObject.amendmentHistory.push({ name: this.userInfo.userName, date: moment(new Date().toISOString()).format('MM/DD/YYYY HH:mm') });
    if (!this.dataObject.createdBy) {
      this.dataObject.createdBy = this.userInfo.userEsig;
    }
    this.appActions.setburnFormData(this.dataObject);
  }

  public submitData(): void {
    this.updateAmendmentHistory();
    this.loading = true;
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    const url = canvas.toDataURL();
    if (!this.dataObject.timeOfInjury && this.currentTime) {
      this.dataObject.timeOfInjury = this.currentTime;
    }
    if (!this.dataObject.dateOfInjury && this.currentDate) {
      this.dataObject.dateOfInjury = this.currentDate;
    }
    const obj = {
      data: this.dataObject,
      canvasUrl: url,
      editMode: this.state.getValue().main.isInEditMode
    };
    this.appActions.submitFormData(obj).then(() => {
      this.loading = false;
      this.showSuccess('Your form was saved successfully.');
      if (environment.isElectron) {
        setTimeout(() => {
          this.electronService.ipcRenderer.send('saved');
        }, 1500);
      }
    }).catch((e: any) => {
      this.loading = false;
      console.log('e... ', e);
    });
  }

  private async showSuccess(msg: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: msg,
      buttons: [{ text: 'Okay' }]
    });
    await alert.present();
  }

  public getAmendedDate(date: string): string {
    return moment(date).format('MM/DD/YYYY hh:mm a');
  }

  public generatePDF(): void {
    this.pdfView = true;
    if (!environment.isMobileApp && this.burnCanvas.hasDrawnOnCanvas) {
      this.burnCanvas.pdfView = true;
      this.burnCanvas.pdfSubject.next(true);
    }
    const div = document.getElementById('mainForm');
    const ogWidth = document.body.style.width;
    const ogWidth2 = div.style.width;
    div.style.width = '1400px';
    document.body.style.width = '1400px';
    this.resetForPDF().then(() => {
      this.pdfService.generatePDF('download', document.querySelector('#mainForm'), 'test', this.countRows()).then(() => {
        setTimeout(() => {
          this.makeCellsDarker(true);
          document.getElementById('mainForm').style.width = ogWidth2;
          document.body.style.width = ogWidth;
          this.pdfView = false;
          if (!environment.isMobileApp) {
            this.burnCanvas.pdfView = false;
            this.burnCanvas.pdfSubject.next(false);
          }
        }, 300);
      }).catch((e: any) => {
        this.pdfView = false;
        if (!environment.isMobileApp && this.burnCanvas.hasDrawnOnCanvas) {
          this.burnCanvas.pdfView = false;
          this.burnCanvas.pdfSubject.next(false);
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

  private resetForPDF(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.makeCellsDarker(false);
      setTimeout(() => resolve(), 1000);
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
    this.appActions.setburnFormData(this.dataObject);
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

  public async openBurnCanvasModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: BurnCanvasComponent,
      componentProps: {
        dataObject: this.dataObject,
        patientInfo: this.patientInfo
      }
    });
    await modal.present();
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

  public cancel(): void {
    this.confirmCancel().then((res: boolean) => {
      if (res) { this.electronService.ipcRenderer.send('cancel'); }
    }).catch((err: any) => { });
  }

  private async confirmCancel(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: 'Hold Up!',
        message: 'Are you sure you want to exit without saving?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              alert.dismiss(false);
            }
          }, {
            text: 'Yes',
            handler: () => {
              alert.dismiss(true);
            }
          }
        ]
      });
      await alert.present();
      const data = await alert.onWillDismiss();
      if (data.role === 'cancel') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

}
