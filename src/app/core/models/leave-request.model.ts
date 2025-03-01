// src/app/core/models/leave-request.model.ts
export interface LeaveRequest {
  id?: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  workingDays: number;
  notes?: string;
  createdAt: Date;
}