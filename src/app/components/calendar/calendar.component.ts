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
   // const startDate = selectedDate?.toISOString();
    const startDate = this.getStartOfMonth(selectedDate).toISOString();
    const endDate = this.getEndOfMonth(selectedDate).toISOString();
    this.loadOrders(startDate, endDate);
  }

  ngOnInit() {
    this.loadOrdersForSelectedDate(this.selectedYearMonth);
  }

  leftArrow():void {
    if(this.selectedYearMonth.getMonth() === 0) {
      this.selectedYearMonth = new Date(this.selectedYearMonth.getFullYear()-1,11,1);
    } else {
      this.selectedYearMonth = new Date(this.selectedYearMonth.getFullYear(),this.selectedYearMonth.getMonth()-1,1);
    }
    this.loadOrdersForSelectedDate(this.selectedYearMonth);
  }

  rightArrow():void {
    if(this.selectedYearMonth.getMonth() === 11) {
      this.selectedYearMonth = new Date(this.selectedYearMonth.getFullYear()+1,0,1);
    } else {
      this.selectedYearMonth = new Date(this.selectedYearMonth.getFullYear(),this.selectedYearMonth.getMonth()+1,1);
    }
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
  const selectedYearMonth = this.selectedYearMonth; 

  let firstDay = new Date(selectedYearMonth.getFullYear(), selectedYearMonth.getMonth(), 1);
 
  while (firstDay.getDay() !== 1) { 
    firstDay.setDate(firstDay.getDate() - 1);
    }

  const lastDay = new Date(selectedYearMonth.getFullYear(), selectedYearMonth.getMonth() + 1, 0);

  for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
    daysInMonth.push(new Date(day));
  }

  return daysInMonth;
  
  }

  getOrdersForDay(day: Date): Order[] {
   
    const dayStart = new Date(day);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
  
    const ordersForDay = this.orders.filter(
      (order) =>
        new Date(order.date) >= dayStart &&
        new Date(order.date) <= dayEnd
    );
  
    ordersForDay.sort((a, b) => {
      const timeA = this.extractTime(a.date);
      const timeB = this.extractTime(b.date);
  
      if (timeA === timeB) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
  
      return timeA.localeCompare(timeB);
    });
  
    return ordersForDay;
  }
  
  private extractTime(dateTime: string): string {
    const dateObj = new Date(dateTime);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
  
    const formattedTime = hours % 12 === 0 ? '12' : (hours % 12).toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const amPm = hours < 12 ? 'AM' : 'PM';
  
    return `${formattedTime}:${formattedMinutes} ${amPm}`;
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getEndOfMonth(date: Date): Date {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), 23, 59, 59, 999);
  }

  isDateInCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.selectedYearMonth.getMonth();
  }

}
