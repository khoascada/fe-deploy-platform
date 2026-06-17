import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@lib/test/test-utils';
import LoginForm from './login-form';
import * as authHooks from '../hooks';

// Mock the useLogin hook used by LoginForm
vi.mock('../hooks', () => ({
  useLogin: vi.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockUseLogin = authHooks.useLogin as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseLogin.mockReturnValue({
      login: mockLogin,
      isPending: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    /**
     * Test: Verify form renders correctly with all required elements
     * Purpose: Ensure the login form displays email, password fields and submit button
     * What it checks:
     * - Email input field exists and is accessible
     * - Password input field exists and is accessible
     * - Submit button exists
     */
    it('renders login form with email and password fields', () => {
      render(<LoginForm />);

      // ✅ Use data-testid - not dependent on text/translations
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    /**
     * Test: Verify user can type in form fields
     * Purpose: Ensure form inputs are interactive and accept user input
     * What it checks:
     * - User can type into email field
     * - User can type into password field
     * - Input values are updated correctly after typing
     * - Form is not read-only or disabled
     */
    it('allows typing in fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      // ✅ Use data-testid instead of text-based queries
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Form Submission', () => {
    /**
     * Test: Verify successful form submission with valid data
     * Purpose: Ensure form submits correctly and calls login API with proper data
     * What it checks:
     * - User can fill in valid email and password
     * - Clicking submit button triggers form submission
     * - Login function is called with correct credentials object
     * - Data format matches expected API structure (email, password, rememberMe)
     */
    it('calls login function with credentials on submit', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      // ✅ Use data-testid
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });


    /**
     * Test: Verify email validation error displays for invalid format
     * Purpose: Ensure form validates email format and shows appropriate error
     * What it checks:
     * - Invalid email format triggers validation
     * - Error message is displayed (checked by presence, not exact text)
     * - Form does NOT submit when email is invalid
     * - Login function is NOT called with invalid data
     */
    it('shows validation error for invalid email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      // Use clearly invalid email format (has @ but missing domain extension)
      await user.type(screen.getByTestId('email-input'), 'test@invalid');
      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        // ✅ Check that error exists using role="alert" (used by error <p> elements)
        const alertElements = screen.getAllByRole('alert');
        expect(alertElements.length).toBeGreaterThan(0);
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    /**
     * Test: Verify required field validation for password
     * Purpose: Ensure form prevents submission when password is empty
     * What it checks:
     * - Valid email but empty password triggers validation
     * - Error message is displayed
     * - Form does NOT submit with missing required field
     * - Login function is NOT called when validation fails
     */
    it('shows validation error for empty password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      // Leave password empty
      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        // ✅ Check that error exists using role="alert" (used by error <p> elements)
        const alertElements = screen.getAllByRole('alert');
        expect(alertElements.length).toBeGreaterThan(0);
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    /**
     * Test: Verify form is disabled during login API call
     * Purpose: Ensure UI prevents user interaction while login is processing
     * What it checks:
     * - Email input is disabled when isLoadingLogin is true
     * - Password input is disabled when isLoadingLogin is true
     * - Submit button is disabled to prevent multiple submissions
     * - User cannot modify form or submit again during API call
     */
    it('disables form fields when loading', () => {
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        isPending: true,
        error: null,
      });

      render(<LoginForm />);

      // ✅ Use data-testid
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
      expect(screen.getByTestId('login-submit-button')).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    /**
     * Test: Verify API error message is displayed to user
     * Purpose: Ensure server/API errors are shown in the UI
     * What it checks:
     * - When errorLogin exists in auth hook, error is rendered
     * - Error message from API/server is displayed correctly
     * - Error has proper accessibility role (alert)
     * - User can see what went wrong
     */
    it('displays error message when error exists', () => {
      const errorMessage = 'Invalid credentials';
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        isPending: false,
        error: { message: errorMessage },
      });

      render(<LoginForm />);

      // ✅ Use data-testid for error container
      const errorElement = screen.getByTestId('login-error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMessage);
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('does not display error when errorLogin is null', () => {
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        isPending: false,
        error: null,
      });

      render(<LoginForm />);

      expect(screen.queryByTestId('login-error-message')).not.toBeInTheDocument();
    });
  });
});
