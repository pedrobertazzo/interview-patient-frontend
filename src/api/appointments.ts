import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentStatus,
} from "../types";
import { http } from "./http";

export async function listAppointments(
  patientId?: number
): Promise<AppointmentResponse[]> {
  const { data } = await http.get<AppointmentResponse[]>("/api/appointments", {
    params: patientId ? { patientId } : undefined,
  });
  return data;
}

export async function getAppointment(id: number): Promise<AppointmentResponse> {
  const { data } = await http.get<AppointmentResponse>(
    `/api/appointments/${id}`
  );
  return data;
}

export async function createAppointment(
  payload: AppointmentRequest
): Promise<AppointmentResponse> {
  const { data } = await http.post<AppointmentResponse>(
    "/api/appointments",
    payload
  );
  return data;
}

export async function updateAppointmentStatus(
  id: number,
  status: AppointmentStatus
): Promise<AppointmentResponse> {
  const { data } = await http.patch<AppointmentResponse>(
    `/api/appointments/${id}/status`,
    null,
    {
      params: { status },
    }
  );
  return data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await http.delete(`/api/appointments/${id}`);
}
