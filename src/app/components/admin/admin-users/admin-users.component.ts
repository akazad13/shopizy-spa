import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserApi } from '../../../api/user.api';
import { UserDetails } from '../../../interfaces/user';
import { ToastService } from '../../../services/toast.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, ConfirmModalComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: UserDetails[] = [];
  loading: boolean = true;
  activeUsers = 0;
  adminUsers = 0;

  confirmModalOpen = false;
  confirmModalTitle = 'Update User Role';
  confirmModalMessage = '';
  userToUpdate: UserDetails | null = null;
  targetNewRole: string | null = null;

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
        this.adminUsers = this.users.filter((u) => u.role === 'Admin').length;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load customers list');
        this.loading = false;
      }
    });
  }

  getUserRoleLabel(user: UserDetails): string {
    return user.role === 'Admin' ? 'Admin' : 'Customer';
  }

  toggleRole(user: UserDetails): void {
    const newRole = this.getUserRoleLabel(user) === 'Admin' ? 'Customer' : 'Admin';
    this.userToUpdate = user;
    this.targetNewRole = newRole;
    this.confirmModalTitle = 'Update User Role';
    this.confirmModalMessage = `Are you sure you want to change ${user.firstName || 'this user'}'s role to ${newRole}?`;
    this.confirmModalOpen = true;
  }

  confirmUpdateRole(): void {
    if (!this.userToUpdate || !this.targetNewRole) return;
    const user = this.userToUpdate;
    const newRole = this.targetNewRole;
    this.confirmModalOpen = false;
    this.userToUpdate = null;
    this.targetNewRole = null;

    this.userApi.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        this.toast.success(`User role updated to ${newRole}`);
        this.loadUsers();
      },
      error: () => this.toast.error('Failed to update role')
    });
  }

  cancelUpdateRole(): void {
    this.confirmModalOpen = false;
    this.userToUpdate = null;
    this.targetNewRole = null;
  }
}
