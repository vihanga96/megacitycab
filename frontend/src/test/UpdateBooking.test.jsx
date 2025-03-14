import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UpdateBooking from "../pages/UpdateBooking";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vi.mock("axios");

describe("UpdateBooking Component - Booking Data Update", () => {
  const mockLocationState = {
    role: "ADMIN",
    userId: "12345",
    token: "fake-token",
    bookingId: "booking-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("submits updated booking data correctly", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        bookingId: "booking-123",
        phoneNumber: "0123456789",
        pickupLocation: "Colombo",
        destinationLocation: "Gampaha",
        vehicle: "car",
        distance: 10,
        cost: 3000,
      },
    });

    axios.put.mockResolvedValueOnce({
      status: 200,
      data: { message: "Booking updated successfully!" },
    });

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/updatebooking", state: mockLocationState }]}
      >
        <Routes>
          <Route path="/updatebooking" element={<UpdateBooking />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/phone number/i)).toHaveValue("0123456789");
      expect(screen.getByLabelText(/pickup location/i)).toHaveValue("Colombo");
      expect(screen.getByLabelText(/destination location/i)).toHaveValue("Gampaha");
      expect(screen.getByLabelText(/vehicle type/i)).toHaveValue("car");
    });

    await userEvent.selectOptions(screen.getByLabelText(/pickup location/i), "Galle");
    await userEvent.selectOptions(screen.getByLabelText(/destination location/i), "Kandy");
    await userEvent.selectOptions(screen.getByLabelText(/vehicle type/i), "van");

    await userEvent.click(screen.getByRole("button", { name: /update booking/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:9090/api/bookings/updateByBookingId",
        expect.objectContaining({
          bookingId: "booking-123",
          phoneNumber: "0123456789",
          pickupLocation: "Galle",
          destinationLocation: "Kandy",
          vehicle: "van",
          distance: expect.any(Number),
          cost: expect.any(Number),
        }),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer fake-token`,
          },
        })
      );
    });
  });
});