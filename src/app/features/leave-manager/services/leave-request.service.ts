// src/app/features/leave-manager/services/leave-request.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private leaveRequests = new BehaviorSubject<LeaveRequest[]>([]);
  private readonly STORAGE_KEY = 'leaveRequests';

  constructor(private browserStorageService: BrowserStorageService) {
    this.loadLeaveRequests();
  }

  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.leaveRequests.asObservable();
  }

  saveLeaveRequest(request: LeaveRequest): void {
    const currentRequests = [...this.leaveRequests.value];

    // Genera un ID se non esiste
    if (!request.id) {
      request.id = Date.now().toString();
    }

    // Aggiungi il timestamp di creazione
    request.createdAt = new Date();

    // Aggiungi o aggiorna la richiesta
    const existingIndex = currentRequests.findIndex(r => r.id === request.id);
    if (existingIndex >= 0) {
      currentRequests[existingIndex] = request;
    } else {
      currentRequests.push(request);
    }

    this.browserStorageService.setItem(this.STORAGE_KEY, JSON.stringify(currentRequests));
    this.leaveRequests.next(currentRequests);
  }

  deleteLeaveRequest(id: string): void {
    const filteredRequests = this.leaveRequests.value.filter(request => request.id !== id);
    this.browserStorageService.setItem(this.STORAGE_KEY, JSON.stringify(filteredRequests));
    this.leaveRequests.next(filteredRequests);
  }

  private loadLeaveRequests(): void {
    const savedRequests = this.browserStorageService.getItem(this.STORAGE_KEY);
    if (savedRequests) {
      try {
        const requests = JSON.parse(savedRequests);

        // Converti le stringhe di date in oggetti Date
        const parsedRequests = requests.map((request: any) => ({
          ...request,
          startDate: new Date(request.startDate),
          endDate: new Date(request.endDate),
          createdAt: new Date(request.createdAt)
        }));

        this.leaveRequests.next(parsedRequests);
      } catch (e) {
        console.error('Error parsing leave requests', e);
        this.leaveRequests.next([]);
      }
    }
  }
}