import {
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  createPatient,
  deletePatient,
  listPatients,
  updatePatient,
} from "../api/patients";
import { PatientForm } from "../components/PatientForm";
import { PatientList } from "../components/PatientList";
import { PatientRequest, PatientResponse } from "../types";

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PatientResponse | null>(null);

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
      if (editing) {
        await updatePatient(editing.id, data);
        setEditing(null);
      } else {
        await createPatient(data);
      }
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

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Patients</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <PatientForm onSubmit={handleSubmit} editing={editing} />
      <Divider />
      {loading ? (
        <CircularProgress />
      ) : (
        <PatientList
          patients={patients}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </Stack>
  );
};
