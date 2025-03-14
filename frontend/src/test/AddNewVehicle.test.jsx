import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddNewVehicle from "../pages/AddNewVehicle";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";

vi.mock("axios");

vi.mock("../utils/AuthContext", () => ({
  useAuth: () => ({
    auth: {
      token: "fake-token",
    },
  }),
}));

describe("AddNewVehicle Component - Vehicle Data Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("submits new vehicle data correctly", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: "Vehicle added successfully!" },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/addnewvehicle" }]}>
        <Routes>
          <Route path="/addnewvehicle" element={<AddNewVehicle />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/vehicle number/i), "ABC-1234");
    await userEvent.type(screen.getByLabelText(/vehicle type/i), "Car");
    await userEvent.type(screen.getByLabelText(/brand/i), "Toyota");
    await userEvent.type(screen.getByLabelText(/model/i), "Corolla");
    await userEvent.type(screen.getByLabelText(/year/i), "2020");
    await userEvent.type(screen.getByLabelText(/color/i), "Red");
    await userEvent.type(screen.getByLabelText(/capacity/i), "5");

    await userEvent.click(screen.getByRole("button", { name: /add vehicle/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:7075/api/vehicles/add",
        expect.objectContaining({
          vehicleNumber: "ABC-1234",
          vehicleType: "Car",
          brand: "Toyota",
          model: "Corolla",
          year: "2020",
          color: "Red",
          capacity: "5",
          driverId: null,
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