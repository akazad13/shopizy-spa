import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductQuestionApi {
  private readonly baseUrl = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) { }

  askQuestion(productId: string, question: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/${productId}/questions`, { question });
  }

  getQuestions(productId: string, pageNumber: number = 1, pageSize: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/products/${productId}/questions`, { params }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res?.$values) return res.$values;
        if (res?.items) return res.items;
        return res;
      })
    );
  }


  answerQuestion(questionId: string, answer: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/questions/${questionId}/answer`, { answer });
  }
}
