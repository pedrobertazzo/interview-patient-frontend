import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientsPage } from './PatientsPage';
import * as patientsApi from '../api/patients';

vi.mock('../api/patients', () => ({
  listPatients: vi.fn(),
  createPatient: vi.fn(),
  deletePatient: vi.fn(),
  updatePatient: vi.fn(),
  getPatient: vi.fn(),
}));

const mockPatients = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    dateOfBirth: '1990-01-01',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    dateOfBirth: '1985-05-15',
  },
];

describe('PatientsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(patientsApi.listPatients).mockResolvedValue(mockPatients);
  });

  it('renders patients page with title', async () => {
    render(<PatientsPage />);
    
    expect(screen.getByText('Patients')).toBeInTheDocument();
  });

  it('loads and displays patients', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });

    expect(patientsApi.listPatients).toHaveBeenCalledTimes(1);
  });

  it('filters patients by name', async () => {
    const user = userEvent.setup();
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const nameFilter = screen.getByPlaceholderText('Search by first or last name...');
    await user.type(nameFilter, 'Jane');

    await waitFor(() => {
      expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });

  it('filters patients by email', async () => {
    const user = userEvent.setup();
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const emailFilter = screen.getByPlaceholderText('Search by email...');
    await user.type(emailFilter, 'jane.smith');

    await waitFor(() => {
      expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });

  it('creates a new patient', async () => {
    const user = userEvent.setup();
    vi.mocked(patientsApi.createPatient).mockResolvedValue({
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    // Fill in the form - use more specific selectors
    const formInputs = screen.getAllByLabelText(/Email/i);
    const emailInput = formInputs.find((el) => el.getAttribute('name') === 'email');
    
    await user.type(screen.getByLabelText(/First Name/i), 'Bob');
    await user.type(screen.getByLabelText(/Last Name/i), 'Johnson');
    if (emailInput) {
      await user.type(emailInput, 'bob@example.com');
    }

    // Submit the form
    const createButton = screen.getByRole('button', { name: /Create Patient/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(patientsApi.createPatient).toHaveBeenCalledWith({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
      });
      expect(patientsApi.listPatients).toHaveBeenCalledTimes(2); // Initial load + after create
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(patientsApi.listPatients).mockRejectedValue(new Error('API Error'));

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });

  it('applies both name and email filters together', async () => {
    const user = userEvent.setup();
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const nameFilter = screen.getByPlaceholderText('Search by first or last name...');
    const emailFilter = screen.getByPlaceholderText('Search by email...');

    await user.type(nameFilter, 'Jane');
    await user.type(emailFilter, 'smith');

    await waitFor(() => {
      expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });
});
