import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  onSearch(): void {
    const term = this.searchTerm.trim();
    this.router.navigate(['/admin/products'], {
      queryParams: term ? { name: term } : {}
    });
  }

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
