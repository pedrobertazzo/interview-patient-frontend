import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { AppointmentRequest } from "../types";

interface Props {
  onSubmit: (data: AppointmentRequest) => Promise<void>;
  defaultPatientId?: number;
}

export const AppointmentForm: React.FC<Props> = ({
  onSubmit,
  defaultPatientId,
}) => {
  const [form, setForm] = useState<AppointmentRequest>({
    patientId: defaultPatientId || 0,
    appointmentDateTime: "",
    reason: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "patientId" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
    setForm({
      patientId: defaultPatientId || 0,
      appointmentDateTime: "",
      reason: "",
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
      >
        <TextField
          label="Patient ID"
          name="patientId"
          type="number"
          value={form.patientId}
          onChange={handleChange}
          required
        />
        <TextField
          label="Date & Time"
          name="appointmentDateTime"
          type="datetime-local"
          value={form.appointmentDateTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">
          Create Appointment
        </Button>
      </Stack>
    </form>
  );
};
