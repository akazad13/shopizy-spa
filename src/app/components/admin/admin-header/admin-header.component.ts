import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  readonly quickLinks = [
    {
      label: 'New Product',
      route: '/admin/products/new',
      tone: 'bg-slate-900 text-white hover:bg-black'
    },
    {
      label: 'Orders',
      route: '/admin/orders',
      tone: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
    }
  ];
}
