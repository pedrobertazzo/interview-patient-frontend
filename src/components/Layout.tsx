import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Management
          </Typography>
          <Button color="inherit" component={Link} to="/patients">
            Patients
          </Button>
          <Button color="inherit" component={Link} to="/appointments">
            Appointments
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};
