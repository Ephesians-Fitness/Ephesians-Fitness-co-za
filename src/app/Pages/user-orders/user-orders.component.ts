import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { Papa } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupMessageComponent],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent {
    //#region "Global Variables."
    orders: any[] = []; 
    paginatedOrders: any[] = []; // Holds orders for the current page
    orderId: string = ''; 
    orderStatus: string = '';
    orderDate: string = ''; 
    clientEmail: string = localStorage.getItem('email') ?? '';
  
    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
  
    // serverHost: string = 'http://localhost:3000';
serverHost: string = 'https://ephesians-fitness-server.onrender.com';

    showPopup: boolean = false;
    @ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;
    //#endregion.
    
    constructor(
      private router: Router,
      private http: HttpClient,
      private papa: Papa
    ) {}
  
    ngOnInit() {
      this.loadOrders(); 
    }
  
    //#region "Load & Display the orders from the DB."
    loadOrders() {
      this.http.get('../files/OrderSummary.csv', { responseType: 'text' }).subscribe({
        next: (csvData) => {
          this.papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const allOrders = result.data as Array<{
                CartID: string;
                OrderID: string;
                ClientEmail: string;
                SubTotal: string;
                ShippingFee: string;
                FinalTotal: string;
                OrderStatus: string;
                OrderDate: string;
                OrderUpdateDate: string;
              }>;
  
              // Filter orders based on client email
              this.orders = allOrders.filter(order => order.ClientEmail === this.clientEmail);
              
              this.currentPage = 1; // Reset to first page
              this.paginateOrders(); // Apply pagination
            },
          });
        },
        error: () => {
          this.popup.show('Error fetching orders! Please contact Administrator.');
        },
      });
    }
  
    //#region "Pagination Methods"
    paginateOrders() {
      this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedOrders = this.orders.slice(startIndex, endIndex);
    }
    
  
    nextPage() {
      if ((this.currentPage * this.itemsPerPage) < this.orders.length) {
        this.currentPage++;
        this.paginateOrders();
      }
    }
  
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginateOrders();
      }
    }
    //#endregion.
  
    //#region "Approve the Selected Order."
    approveOrder(cartId: string): void {
      this.http.post(`${this.serverHost}/approve-order`, { cartId }).subscribe({
        next: (response: any) => {
          this.popup.show(response.message || 'Order approved successfully.');
          this.loadOrders(); 
        },
        error: (error) => {
          this.popup.show(error.message || 'Error approving order.');
        },
      });
    }
  
    //#endregion.
  
    //#region "Send Shipment Email."
    sendShipmentEmail(orderId: string) {
      const order = this.orders.find(order => order.CartID === orderId);
      const emailData = {
        orderid: order.OrderID,
        orderdate: order.OrderDate,
        totalAmount: order.FinalTotal,
        email: order.ClientEmail,
      };
  
      this.http.post<{ message: string }>(`${this.serverHost}/send-shipment-email`, emailData).subscribe({
        next: (response) => {
          this.popup.show(`Shipment details sent successfully for Order ID: ${order.OrderID}`);
        },
        error: () => {
          this.popup.show(`Failed to send shipment details for Order ID: ${order.OrderID}.`);
        },
      });
    }
    //#endregion.
  
    //#region "Update status in DB."
    shipOrder(cartId: string): void {
      this.http.post(`${this.serverHost}/ship-order`, { cartId }).subscribe({
        next: (response: any) => {
          this.popup.show(response.message || 'Order shipped successfully.');
          this.loadOrders(); 
        },
        error: (error) => {
          this.popup.show(error.message || 'Error shipping order.');
        },
      });
    }
    //#endregion.
  
    refreshOrders() {
      this.orderId = '';
      this.orderStatus = '';
      this.orderDate = '';
    
      this.currentPage = 1;
    
      this.loadOrders();
    }
    
    //Home page navigation.
    goToHome(): void {
      this.router.navigate(['/home']); 
    }
}
