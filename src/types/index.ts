// OpenAPI derived types
export interface PatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // yyyy-MM-dd
}

export interface PatientResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface AppointmentRequest {
  patientId: number;
  appointmentDateTime: string; // ISO date-time
  reason: string;
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface AppointmentResponse {
  id: number;
  patientId: number;
  appointmentDateTime: string;
  reason: string;
  status: AppointmentStatus;
}
