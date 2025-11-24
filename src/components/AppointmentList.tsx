import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { AppointmentResponse, AppointmentStatus } from "../types";

interface Props {
  appointments: AppointmentResponse[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: AppointmentStatus) => void;
}

const statuses: AppointmentStatus[] = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export const AppointmentList: React.FC<Props> = ({
  appointments,
  onDelete,
  onStatusChange,
}) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Patient ID</TableCell>
          <TableCell>Date & Time</TableCell>
          <TableCell>Reason</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map((a: AppointmentResponse) => (
          <TableRow key={a.id} hover>
            <TableCell>{a.id}</TableCell>
            <TableCell>{a.patientId}</TableCell>
            <TableCell>
              {new Date(a.appointmentDateTime).toLocaleString()}
            </TableCell>
            <TableCell>{a.reason}</TableCell>
            <TableCell>
              <Select
                size="small"
                value={a.status}
                onChange={(e: any) =>
                  onStatusChange(a.id, e.target.value as AppointmentStatus)
                }
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={() => onDelete(a.id)}
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
