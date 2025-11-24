import { PatientRequest, PatientResponse } from "../types";
import { http } from "./http";

export async function listPatients(): Promise<PatientResponse[]> {
  const { data } = await http.get<PatientResponse[]>("/api/patients");
  return data;
}

export async function getPatient(id: number): Promise<PatientResponse> {
  const { data } = await http.get<PatientResponse>(`/api/patients/${id}`);
  return data;
}

export async function createPatient(
  payload: PatientRequest
): Promise<PatientResponse> {
  const { data } = await http.post<PatientResponse>("/api/patients", payload);
  return data;
}

export async function updatePatient(
  id: number,
  payload: PatientRequest
): Promise<PatientResponse> {
  const { data } = await http.put<PatientResponse>(
    `/api/patients/${id}`,
    payload
  );
  return data;
}

export async function deletePatient(id: number): Promise<void> {
  await http.delete(`/api/patients/${id}`);
}
