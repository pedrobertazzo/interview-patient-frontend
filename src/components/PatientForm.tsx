import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { PatientRequest } from "../types";

interface Props {
  onSubmit: (data: PatientRequest) => Promise<void>;
}

export const PatientForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<PatientRequest>({
    firstName: "",
    lastName: "",
    email: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
    setForm({ firstName: "", lastName: "", email: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        sx={{
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ minWidth: 150, whiteSpace: "nowrap" }}
        >
          "Create Patient"
        </Button>
      </Stack>
    </form>
  );
};
