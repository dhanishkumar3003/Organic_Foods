import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})
export class ViewCartComponent implements OnInit {
  product_ids: any[] = [];
  quantities: number[] = [];  
  products: any[] = [];
  totalPrice: number = 0;
  user_id: number = 0;
  address: any = {
    first_line: '',
    city: '',
    state: '',
    pincode: ''
  };
  access: any = sessionStorage.getItem("access");

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access}`
    });

    // Fetch user details and cart data in parallel
    this.http.get('http://localhost:8000/api/users/get_user', { headers }).subscribe(
      (response: any) => {
        this.address = {
          first_line: response.data.first_line,
          city: response.data.city,
          state: response.data.state,
          pincode: response.data.pincode
        };
        this.product_ids = response.data.cart_product_ids;
        this.user_id = response.data.id;
        this.quantities = response.data.quantities;
        this.fetchProductDetails(headers);
      },
      (error: any) => {
        console.error('Error fetching user and cart data', error);
      }
    );
  }

  fetchProductDetails(headers: HttpHeaders): void {
    if (this.product_ids.length > 0) {
      const productRequests: Observable<any>[] = this.product_ids.map(productId => 
        this.http.get(`http://localhost:8000/api/Product_Table/${productId}`, { headers })
      );

      forkJoin(productRequests).subscribe(
        (responses: any[]) => {
          this.products = responses;
          this.calculateTotalPrice();
        },
        (error: any) => {
          console.error('Error fetching product details:', error);
        }
      );
    }
  }

  increaseQuantity(index: number): void {
    if (this.quantities[index] < this.products[index].P_Stock) {
      this.quantities[index]++;
      this.updateCartQuantity();
    }
  }

  decreaseQuantity(index: number): void {
    if (this.quantities[index] > 1) {
      this.quantities[index]--;
      this.updateCartQuantity();
    }
  }

  updateCartQuantity(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access}`,
      'Content-Type': 'application/json',
    });

    const payload = { quantities: this.quantities };

    this.http.patch('http://localhost:8000/api/users/get_user', payload, { headers }).subscribe(
      (response: any) => {
        console.log('Cart updated successfully', response);
        this.calculateTotalPrice();
      },
      (error: any) => {
        console.error('Error updating cart quantity:', error);
      }
    );
  }

  calculateTotalPrice() {
    this.totalPrice = this.products.reduce((total, product, index) => {
      return total + (this.quantities[index] * product.P_Price);
    }, 0);
  }

  buyNow() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access}`,
      'Content-Type': 'application/json',
    });
    let payload={}

    this.http.post('http://localhost:8000/api/shipping/',payload ,{ headers }).subscribe(
      (response: any) => {
        const Shipping_id = response.data.Shipping_id;
        console.log('Shipping created successfully', Shipping_id);

        // Prepare order data
        const orderData = {
          user_id: this.user_id,
          shipping: Shipping_id,
          total_price: this.totalPrice,
          product_ids: this.product_ids,
          quantity: this.quantities,
        };

        // Place the order
        this.http.post('http://localhost:8000/api/orders/', orderData, { headers }).subscribe(
          (response) => {
            console.log('Order placed successfully',response);
            alert('Order placed successfully!');
          },
          error => {
            console.error('Error placing order', error);
            alert('Error placing order. Please try again.');
          }
        );

      },
      (error: any) => {
        console.error('Error creating shipping:', error);
      }
    );
  }
}
