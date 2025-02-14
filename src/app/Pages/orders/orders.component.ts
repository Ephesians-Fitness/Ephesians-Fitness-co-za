import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { Papa } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupMessageComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  //#region "Global Variables."
 allOrders: any[] = []; // Store all orders
 orders: any[] = []; // Store paginated orders
 orderId: string = ''; 
 orderStatus: string = ''; 
 orderDate: string = '';

 showPopup: boolean = false;
 @ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;

 // Pagination Variables
 currentPage: number = 1;
 pageSize: number = 10;
 totalPages: number = 0;
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

           // Filter orders based on search criteria
           this.allOrders = allOrders.filter((order) => {
             const matchesOrderId = this.orderId ? order.OrderID === this.orderId : true;
             const matchesOrderStatus = this.orderStatus
               ? Number(order.OrderStatus.trim()) === Number(this.orderStatus.trim())
               : true;
             const matchesOrderDate = this.orderDate
               ? new Date(order.OrderDate).toISOString().split('T')[0] === this.orderDate
               : true;              
             return matchesOrderId && matchesOrderStatus && matchesOrderDate;
           });

           // Calculate total pages
           this.totalPages = Math.ceil(this.allOrders.length / this.pageSize);
           this.updatePaginatedOrders();
         },
       });
     },
     error: (err) => {
       this.popup.show('Error fetching orders! Please contact Administrator.');
     },
   });
 }

//#region "Approve the Selected Order."
approveOrder(cartId: string): void {
 this.http.post('http://localhost:3000/approve-order', { cartId }).subscribe({
   next: (response: any) => {
     this.popup.show(response.message || 'Order approved successfully.');
     this.loadOrders(); // Reload orders to reflect changes
   },
   error: (error) => {
     this.popup.show(error.message || 'Error approving order.');
   },
 });
}

//#endregion.

//#region "Send Shipment Email."
sendShipmentEmail(orderId: string) {
  const order = this.orders.find((order) => order.CartID === orderId); 

  const emailData = {
    orderid: order.OrderID,
    orderdate: order.OrderDate,
    totalAmount: order.FinalTotal,
    email: order.ClientEmail,
  };
  
  this.http
    .post<{ message: string }>(
      'http://localhost:3000/send-shipment-email',
      emailData
    )
    .subscribe({
      next: (response) => {
        this.popup.show(
          `Shipment details sent successfully for Order ID: ${order.OrderID}`
        );
      },
      error: (error) => {
        this.popup.show(
          `Failed to send shipment details for Order ID: ${order.OrderID}. Error:`
        );
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          this.popup.show(
            'There was an error sending the shipment details. Please try again later.'
          ); 
        }
      },
    });
}
//#endregion.

//#region "Update status in DB."
shipOrder(cartId: string): void {
 this.http.post('http://localhost:3000/ship-order', { cartId }).subscribe({
   next: (response: any) => {
     this.popup.show(response.message || 'Order shipped successfully.');
     this.loadOrders(); // Reload orders to reflect changes

     this.sendShipmentEmail(cartId);
   },
   error: (error) => {
     this.popup.show(error.message || 'Error shipping order.');
   },
 });
}

//#endregion.

// Update paginated data
updatePaginatedOrders() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.orders = this.allOrders.slice(startIndex, endIndex);
}

// Pagination controls
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePaginatedOrders();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedOrders();
  }
}

goToPage(page: number) {
  this.currentPage = page;
  this.updatePaginatedOrders();
}

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
