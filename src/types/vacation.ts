export interface VacationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole?: string | null;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string | null;
  approvedByName: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
}

export type VacationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface VacationRequestListItem {
  id: string;
  userId: string;
  userName: string;
  userRole?: string | null;
  userEmail: string;
  department: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
}