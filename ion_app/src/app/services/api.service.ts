import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient) { }

  private localUrl: string = `http://localhost:8080`;

  public async getArgs(): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : null,
      })
    };
    return this.http.get(`${this.localUrl}/api/electron/args`).toPromise();
  }

  public async getAppData(): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : null,
      })
    };
    return this.http.get(`${this.localUrl}/api/mssql/saved-info`).toPromise();
  }

}
