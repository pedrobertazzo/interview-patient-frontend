import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react"; // React import retained for clarity though not strictly required
import {
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "../api/appointments";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentList } from "../components/AppointmentList";
import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentStatus,
} from "../types";

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientFilter, setPatientFilter] = useState<string>("");

  async function load(patientId?: number) {
    setLoading(true);
    setError(null);
    try {
      const data = await listAppointments(patientId);
      setAppointments(data);
    } catch (e: any) {
      setError(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(data: AppointmentRequest) {
    try {
      await createAppointment(data);
      await load(data.patientId);
    } catch (e: any) {
      setError(e.message || "Failed to create appointment");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAppointment(id);
      await load(patientFilter ? Number(patientFilter) : undefined);
    } catch (e: any) {
      setError(e.message || "Failed to delete appointment");
    }
  }

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    try {
      await updateAppointmentStatus(id, status);
      await load(patientFilter ? Number(patientFilter) : undefined);
    } catch (e: any) {
      setError(e.message || "Failed to update status");
    }
  }

  function applyFilter() {
    load(patientFilter ? Number(patientFilter) : undefined);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Appointments</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Filter by Patient ID"
          value={patientFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPatientFilter(e.target.value)
          }
        />
        <Button variant="outlined" onClick={applyFilter}>
          Apply Filter
        </Button>
      </Stack>
      <AppointmentForm onSubmit={handleSubmit} />
      <Divider />
      {loading ? (
        <CircularProgress />
      ) : (
        <AppointmentList
          appointments={appointments}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </Stack>
  );
};
