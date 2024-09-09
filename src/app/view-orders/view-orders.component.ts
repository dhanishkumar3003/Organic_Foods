import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css'] // Fixed styleUrls spelling
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = []; // Properly typed array
  access: string | null = ''; // Class-level property initialization
  products: any[] = []; // Moved products to class level

  constructor(private http: HttpClient, private router: Router) {
    this.access = sessionStorage.getItem('access'); // Initialize access in constructor
  }

  ngOnInit(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access}`
    });

    this.http.get('http://localhost:8000/api/orders/', { headers }).subscribe(
      (response: any) => {
        console.log('response:', response);
        for (let i = 0; i < response.length; i++) {
          let shipping = response[i].shipping;
          let order_date = response[i].order_date;
          let total_price = response[i].total_price;
          let product_ids = response[i].product_ids;
          let quantities = response[i].quantity;
          
          // Store order details in the orders array
          this.orders.push({
            shipping,
            order_date,
            total_price,
            product_ids,
            quantities
          });

          this.fetchProductDetails(product_ids); // Call fetchProductDetails correctly
        }
      },
      (error: any) => {
        console.error('Error when fetching data:', error);
      }
    );
  }

  fetchProductDetails(product_ids: string[]): void {
    if (product_ids.length > 0) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.access}`,
        'Content-Type': 'application/json'
      });

      for (const productId of product_ids) {
        this.http.get(`http://localhost:8000/api/Product_Table/${productId}`, { headers }).subscribe(
          (response: any) => {
            console.log('Fetched product details:', response);
            this.products.push(response); // Use this.products
          },
          (error: any) => {
            console.error('Error when fetching product details:', error);
          }
        );
      }
    }
  }
}
