import { Injectable } from '@angular/core';
import { Order } from '../entity/order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedOrderService {
  private selectedOrderSubject = new BehaviorSubject<Order | null>(null);
  selectedOrder$ = this.selectedOrderSubject.asObservable();

  setSelectedOrder(order: Order): void {
    this.selectedOrderSubject.next(order);
  }
}
