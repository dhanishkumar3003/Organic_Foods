import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {

  addressObj = {
    first_line: '',
    city: '',
    state: '',
    pincode: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  addressSubmit(): void {
    const address = {
      first_line: this.addressObj.first_line,
      city: this.addressObj.city,
      state: this.addressObj.state,
      pincode: this.addressObj.pincode
    };

    // Retrieve the access token from session storage
    const accessToken = sessionStorage.getItem('accessToken');

    // Define headers including the authorization token
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`  // Add the access token here
    };

    this.http.patch('http://localhost:8000/api/users/get_user', address, { headers })
      .subscribe(
        (response: any) => {
          console.log('patch successful:', response);
          console.log(address);
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('patch failed:', error);
        }
      );
  }
}
