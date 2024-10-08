import React from "react";
import { render, screen } from "@testing-library/react";
import Viewfeed from "../components/Viewfeed";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Mock Firebase functions
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("Viewfeed Component", () => {
  test("renders a list of breeds with images", async () => {
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback({ uid: "test-user" });
      return jest.fn();
    });

    // Mock Firestore document retrieval
    doc.mockImplementation(() => ({ id: "test-user" }));
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        selectedBreeds: ["bulldog", "labrador"],
        likedImages: [],
      }),
    });

    // Mock the API fetch response for breed images
    global.fetch = jest.fn((url) => {
      const breed = url.split("/")[4];
      return Promise.resolve({
        json: () =>
          Promise.resolve({ message: `https://example.com/${breed}.jpg` }),
      });
    });

    render(<Viewfeed />); // Render the Viewfeed component

    // Wait for the images to load and check if they are in the document
    await waitFor(() => {
      expect(screen.getByAltText(/a bulldog/i)).toBeInTheDocument();
      expect(screen.getByAltText(/a labrador/i)).toBeInTheDocument();
    });

    // Check that the breed names are rendered
    expect(screen.getByText(/bulldog/i)).toBeInTheDocument();
    expect(screen.getByText(/labrador/i)).toBeInTheDocument();
  });
});
