import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpdateQuestionPage from './UpdateQuestionPage';

// Mock the necessary modules/functions that are not directly related to the component
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('UpdateQuestionPage', () => {
  it('renders the form with pre-filled data', () => {
    const locationState = {
      question_title: 'Test Question',
      question_categories: 'Test Category',
      question_complexity: 'Easy',
      question_link: 'https://example.com',
      description: 'Test description',
    };

    // Mock location state
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: locationState,
    });

    render(<UpdateQuestionPage />);

    // Assert that the pre-filled data is displayed in the form
    expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Easy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('submits the form successfully', () => {
    const mockNavigate = jest.fn();
    // Mock useNavigate from react-router-dom
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<UpdateQuestionPage />);

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    // Assert that the navigation function is called
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('displays an error message on form submission failure', () => {
    // Mock useNavigate to avoid actual navigation
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(jest.fn());

    // Mock the toast function
    jest.spyOn(require('@chakra-ui/react'), 'useToast').mockReturnValue({
      // Mock toast function to handle the error case
      // You can add your own assertions here to verify the toast message
      // For simplicity, this mock function returns a resolved promise.
      // In a real test, you might want to use a more advanced mocking library like jest.spyOn().
      // Example: mockResolvedValue({/* your toast data */})
      then: jest.fn().mockResolvedValue(null),
    });

    render(<UpdateQuestionPage />);

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));
  });
});
