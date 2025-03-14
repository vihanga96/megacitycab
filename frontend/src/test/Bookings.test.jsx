import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Bookings from "../pages/Bookings";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vi.mock("axios");

vi.mock("../utils/AuthContext", () => ({
  useAuth: () => ({
    auth: {
      role: "ADMIN",
      userId: "12345",
      token: "fake-token",
    },
  }),
}));

describe("Bookings Component - Fetching and Managing Bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches and displays bookings correctly", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          bookingId: "1",
          pickupLocation: "Colombo",
          destinationLocation: "Gampaha",
          status: "pending",
          assignedDriverId: null,
          vehicleNumber: null,
          bookingDate: "2025-03-15T10:00:00Z",
          distance: "10.00",
          cost: "3000.00",
          vehicle: "Car",
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/adminbookings" }]}>
        <Routes>
          <Route path="/adminbookings" element={<Bookings />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/manage bookings/i)).toBeInTheDocument();
      expect(screen.getByText(/colombo/i)).toBeInTheDocument();
      expect(screen.getByText(/gampaha/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
      expect(screen.getAllByText(/under review/i)).toHaveLength(2); // Expect two instances
      expect(screen.getByText(/10.00/i)).toBeInTheDocument();
      expect(screen.getByText(/3000.00/i)).toBeInTheDocument();
      expect(screen.getByText(/car/i)).toBeInTheDocument();
    });
  });

  test("handles update and delete actions correctly", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          bookingId: "1",
          pickupLocation: "Colombo",
          destinationLocation: "Gampaha",
          status: "pending",
          assignedDriverId: null,
          vehicleNumber: null,
          bookingDate: "2025-03-15T10:00:00Z",
          distance: "10.00",
          cost: "3000.00",
          vehicle: "Car",
        },
      ],
    });

    axios.delete.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/adminbookings" }]}>
        <Routes>
          <Route path="/adminbookings" element={<Bookings />} />
          <Route path="/adminDriverAssign" element={<div>Driver Assign Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/manage bookings/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /assign d&v/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /assign d&v/i }));

    await waitFor(() => {
      expect(screen.getByText(/driver assign page/i)).toBeInTheDocument();
    });

    // Re-render to test delete action, ensuring mock persists
    render(
      <MemoryRouter initialEntries={[{ pathname: "/adminbookings" }]}>
        <Routes>
          <Route path="/adminbookings" element={<Bookings />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/manage bookings/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    global.window.confirm = vi.fn(() => true);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:9090/api/bookings/deleteByBookingId",
        expect.objectContaining({
          data: { bookingId: "1" },
          headers: { Authorization: `Bearer fake-token` },
        })
      );
    });
  });
});