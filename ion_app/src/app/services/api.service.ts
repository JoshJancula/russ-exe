import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient, private electronService: ElectronService) { }

  private localUrl: string = environment.baseUrl ? environment.baseUrl : `http://localhost:8080`;

  public async getArgs(): Promise<any> {
    if (environment.isElectron && environment.useIpcForApi) {
      return this.getArgsIPC();
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : null,
        })
      };
      return this.http.get(`${this.localUrl}/api/electron/args`).toPromise();
    }
  }

  private async getArgsIPC(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.send('get-args');
      this.electronService.ipcRenderer.on('args-response', (event, args) => {
        alert('args... ' + JSON.stringify(args));
        resolve(args);
      });
    });
  }

  public async getAppData(): Promise<any> {
    if (environment.isElectron && environment.useIpcForApi) {
      return this.getAppDataIPC();
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : null,
        })
      };
      return this.http.get(`${this.localUrl}/api/mssql/saved-info`).toPromise();
    }
  }

  private async getAppDataIPC(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.send('connect-mssql');
      this.electronService.ipcRenderer.on('mssql-response', (event, args) => {
        alert('app data.... ' + JSON.stringify(args));
        if (args.err) {
          reject(args.err);
        } else {
          resolve(args);
        }
      });
    });
  }

  public async submitData(data: any): Promise<any> {
    if (environment.isElectron && environment.useIpcForApi) {
      return this.submitDataIPC(data);
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : null,
        })
      };
      return this.http.post(`${this.localUrl}/api/mssql/submit`, data).toPromise();
    }
  }

  private async submitDataIPC(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.send('submit-mssql', data);
      this.electronService.ipcRenderer.on('submit-response', (event, args) => {
        if (args.err) {
          reject(args.err);
        } else {
          resolve(args);
        }
      });
    });
  }

}
