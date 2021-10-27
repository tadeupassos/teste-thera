import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(
    private http: HttpClient,
  ) { }

  get(body: any){

  }

  login(body:any){
    return this.http.post(`${environment.url}api/accounts`, body)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(erro => {
      return erro
    })
  }

  postTimesheet(body:any){
    return this.http.post(`${environment.url}api/timesheet`, body, {
      headers: { 'Authorization' : 'Bearer ' + localStorage['token'] }
    })
    .toPromise()
    .then(res => {
      return res
    })
    .catch(erro => {
      return erro
    })
  }

  getTimesheet(){
    return this.http.get(`${environment.url}api/timesheet`, {
      headers: { 'Authorization' : 'Bearer ' + localStorage['token'] }
    })
    .toPromise()
    .then(res => {
      return res
    })
    .catch(erro => {
      return erro
    })
  }


}
