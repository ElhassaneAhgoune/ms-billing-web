import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent {
  // Footer links
  footerLinks = [
    { name: 'Home', url: 'https://moneysab.fr/contact' },
    { name: 'Privacy Policy', url: 'https://moneysab.fr/politique-de-confidentialite' },
    { name: 'Contact us', url: 'https://moneysab.fr/contact' }
  ];

  // Copyright text
  copyrightText = 'Copyright © Moneysab Team';
}