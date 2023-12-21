import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../entity/order';

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {
  private apiUrl = 'http://pumec.zapto.org:8000';
  private ordersUrl = `${this.apiUrl}/orders`;

  constructor(private http: HttpClient) {
  }
  
  getOrders(startDate: string, endDate: string): Observable<Order[]> {
    const params = { start_date: startDate, end_date: endDate };
    return this.http.get<Order[]>(this.ordersUrl, { params });
  }

}
