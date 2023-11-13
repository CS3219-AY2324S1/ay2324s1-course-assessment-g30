import Register from '../pages/Authentication/Register';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

test('on initial render, the Sign up button should be pressable', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    const button = screen.getByRole('button', { name: "Sign up" });
    expect(button.disabled).toBe(false);

})


test('on initial render, the password should be hidden by default', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    const passwordInput = screen.getByRole('textbox', { name: "Password" });
    expect(passwordInput.type).toBe('password');

})

test('when hidden button is pressed, the password should be shown', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    const passwordInputShowBtn = screen.getAllByRole('button', { name: "" })[0];
    const passwordInput = screen.getByRole('textbox', { name: "Password" });
    fireEvent.click(passwordInputShowBtn);

    expect(passwordInput.type).toBe('text');

})

test('Ensure that both password and confirm password fields are working as usual', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    const passwordInputShowBtn = screen.getAllByRole('button', { name: "" })[0];
    const passwordInputShowBtn2 = screen.getAllByRole('button', { name: "" })[1];
    const passwordInput = screen.getByRole('textbox', { name: "Password" });
    const passwordInput2 = screen.getByRole('textbox', { name: "Confirm password" });
    fireEvent.click(passwordInputShowBtn);
    fireEvent.click(passwordInputShowBtn2);

    expect(passwordInput.type).toBe('text');
    expect(passwordInput2.type).toBe('text');

})

