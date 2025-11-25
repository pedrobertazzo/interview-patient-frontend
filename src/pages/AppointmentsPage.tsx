import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [reasonFilter, setReasonFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listAppointments();
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
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to create appointment");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAppointment(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete appointment");
    }
  }

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    try {
      await updateAppointmentStatus(id, status);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to update status");
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesReason = !reasonFilter || 
      appointment.reason.toLowerCase().includes(reasonFilter.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    return matchesReason && matchesStatus;
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Appointments</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Filter by Reason"
          value={reasonFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setReasonFilter(e.target.value)
          }
          placeholder="Search by appointment reason..."
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="NO_SHOW">No Show</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <AppointmentForm onSubmit={handleSubmit} />
      <Divider />
      {loading ? (
        <CircularProgress />
      ) : (
        <AppointmentList
          appointments={filteredAppointments}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </Stack>
  );
};
