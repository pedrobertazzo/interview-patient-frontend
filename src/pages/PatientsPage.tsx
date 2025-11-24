import {
  Alert,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createPatient, deletePatient, listPatients } from "../api/patients";
import { PatientForm } from "../components/PatientForm";
import { PatientList } from "../components/PatientList";
import { PatientRequest, PatientResponse } from "../types";

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listPatients();
      setPatients(data);
    } catch (e: any) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(data: PatientRequest) {
    try {
      await createPatient(data);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save patient");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePatient(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to delete patient");
    }
  }

  // Filter patients by name and email
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesName =
      !nameFilter || fullName.includes(nameFilter.toLowerCase());
    const matchesEmail =
      !emailFilter ||
      patient.email.toLowerCase().includes(emailFilter.toLowerCase());
    return matchesName && matchesEmail;
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Patients</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Filter by Name"
          value={nameFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNameFilter(e.target.value)
          }
          placeholder="Search by first or last name..."
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
        <TextField
          label="Filter by Email"
          value={emailFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailFilter(e.target.value)
          }
          placeholder="Search by email..."
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
      </Stack>
      <PatientForm onSubmit={handleSubmit} />
      <Divider />
      {loading ? (
        <CircularProgress />
      ) : (
        <PatientList patients={filteredPatients} onDelete={handleDelete} />
      )}
    </Stack>
  );
};
