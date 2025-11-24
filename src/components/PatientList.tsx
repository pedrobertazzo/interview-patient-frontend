import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { PatientResponse } from "../types";

interface Props {
  patients: PatientResponse[];
  onEdit: (p: PatientResponse) => void;
  onDelete: (id: number) => void;
}

export const PatientList: React.FC<Props> = ({
  patients,
  onEdit,
  onDelete,
}) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Date of Birth</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {patients.map((p: PatientResponse) => (
          <TableRow key={p.id} hover>
            <TableCell>{p.id}</TableCell>
            <TableCell>
              {p.firstName} {p.lastName}
            </TableCell>
            <TableCell>{p.email}</TableCell>
            <TableCell>{p.phone || "-"}</TableCell>
            <TableCell>{p.dateOfBirth || "-"}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={() => onEdit(p)}
                aria-label="edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(p.id)}
                aria-label="delete"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
