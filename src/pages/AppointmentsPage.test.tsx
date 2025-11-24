import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentsPage } from './AppointmentsPage';
import * as appointmentsApi from '../api/appointments';

vi.mock('../api/appointments', () => ({
  listAppointments: vi.fn(),
  createAppointment: vi.fn(),
  deleteAppointment: vi.fn(),
  updateAppointmentStatus: vi.fn(),
  getAppointment: vi.fn(),
}));

const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    appointmentDateTime: '2025-11-25T10:00:00',
    reason: 'Annual checkup',
    status: 'SCHEDULED' as const,
  },
  {
    id: 2,
    patientId: 2,
    appointmentDateTime: '2025-11-26T14:30:00',
    reason: 'Follow-up visit',
    status: 'COMPLETED' as const,
  },
  {
    id: 3,
    patientId: 1,
    appointmentDateTime: '2025-11-27T09:00:00',
    reason: 'Dental cleaning',
    status: 'CANCELLED' as const,
  },
];

describe('AppointmentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(appointmentsApi.listAppointments).mockResolvedValue(mockAppointments);
  });

  it('renders appointments page with title', async () => {
    render(<AppointmentsPage />);
    
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('loads and displays appointments', async () => {
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
      expect(screen.getByText('Follow-up visit')).toBeInTheDocument();
      expect(screen.getByText('Dental cleaning')).toBeInTheDocument();
    });

    expect(appointmentsApi.listAppointments).toHaveBeenCalledTimes(1);
  });

  it('filters appointments by reason', async () => {
    const user = userEvent.setup();
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
    });

    const reasonFilter = screen.getByPlaceholderText('Search by appointment reason...');
    await user.type(reasonFilter, 'checkup');

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
      expect(screen.queryByText('Follow-up visit')).not.toBeInTheDocument();
      expect(screen.queryByText('Dental cleaning')).not.toBeInTheDocument();
    });
  });

  it('filters appointments by status', async () => {
    const user = userEvent.setup();
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
    });

    const comboboxes = screen.getAllByRole('combobox');
    const statusSelect = comboboxes.find((box) => box.getAttribute('aria-controls')?.includes(':'));
    
    if (statusSelect) {
      await user.click(statusSelect);
      
      const completedOption = screen.getByRole('option', { name: 'Completed' });
      await user.click(completedOption);

      await waitFor(() => {
        expect(screen.queryByText('Annual checkup')).not.toBeInTheDocument();
        expect(screen.getByText('Follow-up visit')).toBeInTheDocument();
        expect(screen.queryByText('Dental cleaning')).not.toBeInTheDocument();
      });
    }
  });

  it('displays formatted status labels', async () => {
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });
  });

  it('creates a new appointment', async () => {
    const user = userEvent.setup();
    vi.mocked(appointmentsApi.createAppointment).mockResolvedValue({
      id: 4,
      patientId: 3,
      appointmentDateTime: '2025-12-01T10:00:00',
      reason: 'New appointment',
      status: 'SCHEDULED',
    });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
    });

    const patientIdInput = screen.getAllByLabelText(/Patient ID/i)[0];
    const dateTimeInput = screen.getByLabelText(/Date & Time/i);
    const reasonInputs = screen.getAllByLabelText(/Reason/i);
    const reasonInput = reasonInputs[reasonInputs.length - 1];

    await user.type(patientIdInput, '3');
    await user.type(dateTimeInput, '2025-12-01T10:00');
    await user.type(reasonInput, 'New appointment');

    const createButton = screen.getByRole('button', { name: /Create Appointment/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(appointmentsApi.createAppointment).toHaveBeenCalledWith({
        patientId: 3,
        appointmentDateTime: '2025-12-01T10:00',
        reason: 'New appointment',
      });
      expect(appointmentsApi.listAppointments).toHaveBeenCalledTimes(2); // Initial load + after create
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(appointmentsApi.listAppointments).mockRejectedValue(new Error('API Error'));

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('applies both reason and status filters together', async () => {
    const user = userEvent.setup();
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
    });

    const reasonFilter = screen.getByPlaceholderText('Search by appointment reason...');
    await user.type(reasonFilter, 'visit');

    const comboboxes = screen.getAllByRole('combobox');
    const statusSelect = comboboxes[0];
    
    await user.click(statusSelect);
    const completedOption = screen.getByRole('option', { name: 'Completed' });
    await user.click(completedOption);

    await waitFor(() => {
      expect(screen.queryByText('Annual checkup')).not.toBeInTheDocument();
      expect(screen.getByText('Follow-up visit')).toBeInTheDocument();
      expect(screen.queryByText('Dental cleaning')).not.toBeInTheDocument();
    });
  });

  it('shows all appointments when filters are cleared', async () => {
    const user = userEvent.setup();
    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
    });

    const reasonFilter = screen.getByPlaceholderText('Search by appointment reason...');
    await user.type(reasonFilter, 'checkup');

    await waitFor(() => {
      expect(screen.queryByText('Follow-up visit')).not.toBeInTheDocument();
    });

    await user.clear(reasonFilter);

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
      expect(screen.getByText('Follow-up visit')).toBeInTheDocument();
      expect(screen.getByText('Dental cleaning')).toBeInTheDocument();
    });
  });
});
