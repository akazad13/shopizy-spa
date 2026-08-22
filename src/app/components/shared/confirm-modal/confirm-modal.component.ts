import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-200"
      (click)="onCancel()"
    >
      <div
        class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            [ngClass]="isDanger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'"
          >
            <app-icon
              [icon]="isDanger ? 'trash-solid' : 'exclamation-circle-solid'"
              classNames="h-6 w-6"
            ></app-icon>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-500">
              {{ message }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            (click)="onCancel()"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            (click)="onConfirm()"
            class="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-95"
            [ngClass]="
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            "
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Delete';
  @Input() cancelText = 'Cancel';
  @Input() isDanger = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
