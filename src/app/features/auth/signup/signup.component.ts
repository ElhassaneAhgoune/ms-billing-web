// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // public method
  SignUpOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
}
