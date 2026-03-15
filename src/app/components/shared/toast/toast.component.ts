import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Toast } from '../../../interfaces/toast';
import { Observable } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './toast.component.html',
  styles: [`
    .toast-enter {
      animation: slideInRight 0.3s ease-out forwards;
    }
    .toast-exit {
      animation: fadeOut 0.2s ease-in forwards;
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts$!: Observable<Toast[]>;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toastService.toasts$;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      case 'warning': return 'exclamation-circle';
      default: return 'info-circle';
    }
  }

  getClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'error': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'warning': return 'bg-amber-50 text-amber-800 border-amber-200';
      default: return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
  }
}
