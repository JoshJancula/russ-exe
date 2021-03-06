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

  public async getAppData(): Promise<any> {
    if (environment.isElectron && environment.useIpcForApi) {
      return await this.getAppDataIPC();
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: null,
        })
      };
      return this.http.get(`${this.localUrl}/api/mssql/saved-info`).toPromise();
    }
  }

  private async getAppDataIPC(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.send('connect-mssql');
      this.electronService.ipcRenderer.on('mssql-response', (event, args) => {
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
      return await this.submitDataIPC(data);
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: null,
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

  public async getPath2ffMpeg(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.send('request-ffmpeg');
      this.electronService.ipcRenderer.on('ffmpeg-response', (event, args) => {
        if (args.err) {
          reject(args.err);
        } else {
          resolve(args);
        }
      });
    });
  }

}
