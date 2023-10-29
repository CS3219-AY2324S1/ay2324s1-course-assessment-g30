import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AddQuestionForm from '../pages/AddQuestionForm/AddQuestionForm';

test('Checks if form renders correctly', async () => {
    render(<MemoryRouter><AddQuestionForm /></MemoryRouter>);

    const form = screen.getByRole('heading', { name: "Add Question" }); 
    const button = screen.getByRole('button', { name: "Submit" });

    await waitFor(() => {
        expect(button).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(form).toBeInTheDocument();
    });
    
})





