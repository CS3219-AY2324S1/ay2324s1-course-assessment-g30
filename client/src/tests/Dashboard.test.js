import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import { getUserProfile } from '../api/Auth';

jest.mock('../api/Auth');

describe('Dashboard',  () => {
  beforeEach( async () => {
    getUserProfile.mockClear();
  });

  it('fetches user profile data', async () => {
    getUserProfile.mockResolvedValue({ username: 'John' });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  
    await new Promise((resolve) => setTimeout(resolve, 0)); // Introduce a delay
    expect(getUserProfile).toHaveBeenCalled();
  });
  
});
