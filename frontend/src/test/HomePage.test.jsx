import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../pages/HomePage";
import { useAuth } from "../utils/AuthContext";
import "@testing-library/jest-dom";

// Mock useAuth
vi.mock("../utils/AuthContext", () => ({
  useAuth: () => ({
    auth: { role: "USER", userId: "123", token: "fake-token" },
  }),
}));

describe("HomePage Component", () => {
  test("renders hero section with title and text", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/your reliable travel partner since 2010/i)
    ).toBeInTheDocument();
  });

  test("renders call-to-action button", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const bookRideButton = screen.getByRole("button", {
      name: /book a ride now/i,
    });
    expect(bookRideButton).toBeInTheDocument();
  });

  test("renders why choose section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/why choose mega city cabs/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /safe, reliable, and comfortable rides at affordable prices/i
      )
    ).toBeInTheDocument();
  });

  test("renders service cards", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const services = [
      "Private Airport Shuttles",
      "Daily Commute Solutions",
      "VIP Chauffeur Service",
      "Event Transportation",
      "Long-Distance Journeys",
      "Instant Ride Booking",
    ];

    services.forEach((service) => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  test("renders footer contact information", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/123-456-7890/)).toBeInTheDocument();
    expect(
      screen.getByText(/support@megacitycabs.com/)
    ).toBeInTheDocument();
  });
});