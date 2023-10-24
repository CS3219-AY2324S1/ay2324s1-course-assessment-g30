import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router

import LandingPage from '../pages/LandingPage/LandingPage';

async function renderWithRouter(ui)  {
  return render(
    <Router> {/* Use BrowserRouter here */}
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/login" element={<p>Hello</p>} />
      </Routes>
    </Router>
  );
}

test('renders the tagline in the page', async () => {
  renderWithRouter(<LandingPage />);
  const text = screen.getByText(/Elevate Your Programming Skills with PeerPrep: Your Ultimate Destination for DSA Mastery! Dive into a world of challenging coding exercises, sharpen your problem-solving abilities, and prepare for coding interviews with our extensive collection of data structures and algorithms challenges./i);
  expect(text).toBeInTheDocument();
});

test('renders the "Get started" button', async () => {
  renderWithRouter(<LandingPage />);
  const getStartedButton = screen.getByText('Get started');
  expect(getStartedButton).toBeInTheDocument();
});

test('clicking the "Get started" button navigates to the login page', async () => {
  renderWithRouter(<LandingPage />);
  const getStartedButton = screen.getByText('Get started');
  fireEvent.click(getStartedButton);
  expect(window.location.pathname).toBe('/login');
});
