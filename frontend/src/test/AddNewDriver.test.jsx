import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddNewDriver from "../pages/AddNewDriver"; 
import { vi } from 'vitest'; 
import '@testing-library/jest-dom'; 
import userEvent from '@testing-library/user-event'; 
import axios from "axios"; 
import { useAuth } from '../utils/AuthContext'; 

// Mock axios globally
vi.mock("axios");

// Mock the useAuth hook
vi.mock('../utils/AuthContext', () => ({
  useAuth: () => ({
    auth: {
      token: "fake-token",
    },
  }),
}));

describe("AddNewDriver Component - Driver Data Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  test("submits new driver data correctly", async () => {
    // Mock the response for adding a new driver
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: "Driver added successfully!" },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/addnewdriver" }]}>
        <Routes>
          <Route path="/addnewdriver" element={<AddNewDriver />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate filling out the form
    await userEvent.type(screen.getByLabelText(/username/i), "JohnDoe");
    await userEvent.type(screen.getByLabelText(/nic/i), "123456789V");
    await userEvent.type(screen.getByLabelText(/address/i), "123 Main St");
    await userEvent.type(screen.getByLabelText(/phone number/i), "0123456789");
    await userEvent.type(screen.getByLabelText(/email/i), "johndoe@example.com");
    await userEvent.type(screen.getByLabelText(/license number/i), "L123456");

    // Simulate form submission
    await userEvent.click(screen.getByRole("button", { name: /add driver/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/api/user/register",
        expect.objectContaining({
          username: "JohnDoe",
          nic: "123456789V",
          address: "123 Main St",
          phoneNumber: "0123456789",
          email: "johndoe@example.com",
          password: "L123456", // License number is set as password
          userRole: "DRIVER",
          licenseNumber: "L123456",
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