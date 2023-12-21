import { Component, OnInit } from '@angular/core';
import { OrderDataService } from '../../services/order-data.service';
import { Order } from '../../entity/order';
import { SelectedOrderService } from '../../services/selected-order.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  currentDate: Date = new Date();
  orders: Order[] = [];
  selectedYearMonth: Date = new Date();

  constructor(private orderDataService: OrderDataService,
    private selectedOrderService: SelectedOrderService) {
    this.selectedYearMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  private loadOrdersForSelectedDate(selectedDate: Date) {
    const startDate = selectedDate?.toISOString();
    const endDate = this.getEndOfMonth(selectedDate).toISOString();
    this.loadOrders(startDate, endDate);
  }

  ngOnInit() {
    this.loadOrdersForSelectedDate(this.selectedYearMonth);
  }

  onSelectedYearMonthChange(newValue: Date): void {
    this.loadOrdersForSelectedDate(newValue);
  }

  onOrderClick(order: Order) {
    console.log('Clicked on order:', order);
    this.selectedOrderService.setSelectedOrder(order);
  }

  private loadOrders(startDate: string, endDate: string): void {
    this.orderDataService.getOrders(startDate, endDate).subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Error loading orders:', error);
      }
    );
  }

  getDaysInMonth(date: Date): Date[] {
    const daysInMonth: Date[] = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
      daysInMonth.push(new Date(day));
    }

    return daysInMonth;
  }

  getOrdersForDay(day: Date): Order[] {
    const dayStart = new Date(day);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return this.orders.filter(
      (order) =>
        new Date(order.date) >= dayStart &&
        new Date(order.date) <= dayEnd
    );
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getEndOfMonth(date: Date): Date {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), 23, 59, 59, 999);
  }
}
