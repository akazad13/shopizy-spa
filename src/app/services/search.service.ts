import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  search(term: string): void {
    this.searchSubject.next(term);
  }
}
