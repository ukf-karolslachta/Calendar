import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../entity/order';
import { SelectedOrderService } from '../../services/selected-order.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {
  public selectedOrder!: Order;
  public showPanel: boolean;

  constructor(private selecteOrderService: SelectedOrderService) {
    this.showPanel = false;
  }
  
  ngOnInit() {
    this.selecteOrderService.selectedOrder$.subscribe((order) => {
      if (order && (this.selectedOrder != order)) {
        this.showPanel = true;
      }
      this.selectedOrder = order!;
    });
  }

  closePanel():void {
    this.showPanel = false;
  }

}
