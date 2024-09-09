import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})export class ViewCartComponent implements OnInit {
  product_ids: any[] = [];
  quantities: number[] = [];  
  products: any[] = [];
  totalPrice: number = 0;
  user_id :number=0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const access = sessionStorage.getItem("access");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access}`
    });

    this.http.get('http://localhost:8000/api/users/get_user', { headers }).subscribe(
      (response: any) => {
        console.log('response:', response.data);
        this.product_ids = response.data.cart_product_ids;
        this.user_id= response.data.id;
        this.quantities = response.data.quantities;
        this.fetchProductDetails(); 
      },
      (error: any) => {
        console.error('Error when fetching data:', error);
      }
    );
    this.calculateTotalPrice();
  }

  fetchProductDetails(): void {
    if (this.product_ids.length > 0) {
      const access = sessionStorage.getItem("access");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json'
      });

      for (const productId of this.product_ids) {
        this.http.get(`http://localhost:8000/api/Product_Table/${productId}`, { headers }).subscribe(
          (response: any) => {
            console.log('Fetched product details:', response);
            this.products.push(response);
          },
          (error: any) => {
            console.error('Error when fetching product details:', error);
          }
        );
      }
    }
  }

  increaseQuantity(index: number): void {
    if (this.quantities[index] < this.products[index].P_Stock) {
      this.quantities[index]++;
      // Optionally, update the cart in the backend as well
      this.updateCartQuantity(index);
    }
  }

  decreaseQuantity(index: number): void {
    if (this.quantities[index] > 1) {
      this.quantities[index]--;
      this.updateCartQuantity(index);
    }
  }

  updateCartQuantity(index: number): void {
    const access = sessionStorage.getItem("access");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      quantities: this.quantities
    };

    this.http.patch('http://localhost:8000/api/users/get_user', payload, { headers }).subscribe(
      (response: any) => {
        console.log('Cart updated successfully', response,payload);
      },
      (error: any) => {
        console.error('Error when updating cart quantity:', error);
      }
    );
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.products.reduce((total, product, index) => {
      return total + (this.quantities[index] * product.P_Price);
    }, 0);
  }

  buyNow() {
    const orderData = {
      user_id: this.user_id,
      shipping_id: 1,
      total_price: this.totalPrice,
      product_ids: this.product_ids,
      quantity: this.quantities,

    };

    // const orderData = new FormData();
    // orderData.append('user_id', this.user_id.toString());
    // orderData.append('shipping_id', '0');
    // orderData.append('total_price', this.totalPrice.toString());
    // orderData.append('product_ids', JSON.stringify(this.product_ids));
    // orderData.append('quantity', JSON.stringify(this.quantities));
    console.log(orderData);
    const access = sessionStorage.getItem("access");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8000/api/orders/', orderData, { headers }).subscribe(
      response => {
        console.log('Order placed successfully', response);
        alert('Order placed successfully!');
      },
      error => {
        console.error('Error placing order', error);
        alert('Error placing order. Please try again.');
      }
    );
  }
}
