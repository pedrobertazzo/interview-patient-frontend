import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { PatientsPage } from "./pages/PatientsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PatientsPage /> },
      { path: "patients", element: <PatientsPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
    ],
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
