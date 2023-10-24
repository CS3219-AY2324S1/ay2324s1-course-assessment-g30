import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react'; // Import waitFor
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from '../pages/LandingPage/LandingPage';

async function renderWithRouter(ui) {
  return render(
    <Router>
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

  // Use waitFor to ensure that the text is in the document
  await waitFor(() => {
    expect(text).toBeInTheDocument();
  });
});

test('renders the "Get started" button', async () => {
  renderWithRouter(<LandingPage />);
  const getStartedButton = screen.getByText('Get started');

  // Use waitFor to ensure that the button is in the document
  await waitFor(() => {
    expect(getStartedButton).toBeInTheDocument();
  });
});

test('clicking the "Get started" button navigates to the login page', async () => {
  renderWithRouter(<LandingPage />);
  const getStartedButton = screen.getByText('Get started');
  
  // Click the button
  fireEvent.click(getStartedButton);

  // Use waitFor to wait for the URL change
  await waitFor(() => {
    expect(window.location.pathname).toBe('/login');
  });
});
