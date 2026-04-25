import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserApi } from '../../../api/user.api';
import { UserDetails } from '../../../interfaces/user';
import { ToastService } from '../../../services/toast.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: UserDetails[] = [];
  loading: boolean = true;
  activeUsers = 0;
  adminUsers = 0;

  constructor(
    private userApi: UserApi,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userApi.getAllUsers(1, 100).subscribe({
      next: (res) => {
        this.users = Array.isArray(res)
          ? res
          : ((res as any)?.$values ??
            (res as any)?.items?.$values ??
            (res as any)?.items ??
            []);
        this.activeUsers = this.users.filter(
          (u) => u.isActive !== false
        ).length;
        this.adminUsers = this.users.filter((u) =>
          (u.roles || []).includes('Admin')
        ).length;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load customers list');
        this.loading = false;
      }
    });
  }

  getUserRoleLabel(user: UserDetails): string {
    return (user.roles || []).includes('Admin') ? 'Admin' : 'Customer';
  }

  toggleRole(user: UserDetails): void {
    // Quick mock switch. Usually would open a dialog or hit API explicitly
    const newRole = (user.roles || []).includes('Admin') ? 'User' : 'Admin';
    if (
      confirm(
        `Are you sure you want to change ${user.firstName}'s role to ${newRole}?`
      )
    ) {
      this.userApi.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          this.toast.success(`User role updated to ${newRole}`);
          this.loadUsers();
        },
        error: () => this.toast.error('Failed to update role')
      });
    }
  }
}
