import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }),
    withCredentials: true
};
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private customer_base_url = 'http://localhost:3030/customer';
    constructor(private http: HttpClient) { }

    postCustomerDetails(customer_name:string, details){
        return this.http.post<any>(this.customer_base_url + `/${customer_name}/details/edit`, details);
    }

    public getCustomerDetails = (username: String) => {
      return this.http.get<any>(`${environment.webSvcBaseUrl}/user/${username}/customers/get`);
    }
}

