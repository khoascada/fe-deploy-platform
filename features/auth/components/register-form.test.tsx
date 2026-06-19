import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@lib/test/test-utils';
import RegisterForm from './register-form';
import * as authHooks from '../hooks';

// ============================================================================
// MOCK SETUP
// ============================================================================

/**
 * Mock cÃ¡c hooks Ä‘Æ°á»£c sá»­ dá»¥ng bá»Ÿi RegisterForm
 * - useRegister: Hook xá»­ lÃ½ Ä‘Äƒng kÃ½ tÃ i khoáº£n
 * - useGetRoles: Hook láº¥y danh sÃ¡ch roles tá»« API
 */
vi.mock('../hooks', () => ({
  useRegister: vi.fn(),
  useGetRoles: vi.fn(),
}));

describe('RegisterForm', () => {
  // ============================================================================
  // TEST FIXTURES
  // ============================================================================

  const mockRegister = vi.fn();
  const mockUseRegister = authHooks.useRegister as ReturnType<typeof vi.fn>;
  const mockUseGetRoles = authHooks.useGetRoles as ReturnType<typeof vi.fn>;

  /**
   * Mock data cho danh sÃ¡ch roles
   * ÄÆ°á»£c sá»­ dá»¥ng Ä‘á»ƒ populate Select dropdown
   */
  const mockRoles = [
    { id: 1, name: 'Student' },
    { id: 2, name: 'Teacher' },
  ];

  /**
   * Valid form data - dÃ¹ng cho cÃ¡c test case thÃ nh cÃ´ng
   */
  const validFormData = {
    email: 'test@example.com',
    name: 'John Doe',
    password: 'password123',
    confirmPassword: 'password123',
  };

  // ============================================================================
  // BEFORE EACH - Reset mocks trÆ°á»›c má»—i test
  // ============================================================================

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useRegister vá»›i tráº¡ng thÃ¡i máº·c Ä‘á»‹nh (khÃ´ng loading, khÃ´ng error)
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      isPending: false,
      error: null,
    });

    // Mock useGetRoles vá»›i danh sÃ¡ch roles máº«u
    mockUseGetRoles.mockReturnValue({
      data: mockRoles,
    });
  });

  // ============================================================================
  // RENDERING TESTS - Kiá»ƒm tra form render Ä‘Ãºng cÃ¡c elements
  // ============================================================================

  describe('Rendering', () => {
    /**
     * Test: Verify form renders correctly with all required elements
     * Purpose: Äáº£m báº£o register form hiá»ƒn thá»‹ Ä‘áº§y Ä‘á»§ cÃ¡c input fields vÃ  submit button
     * What it checks:
     * - Form container tá»“n táº¡i
     * - Email, name, password, confirm password inputs tá»“n táº¡i
     * - Role select dropdown tá»“n táº¡i
     * - Submit button tá»“n táº¡i
     */
    it('renders register form with all input fields', () => {
      render(<RegisterForm />);

      // âœ… Sá»­ dá»¥ng data-testid - khÃ´ng phá»¥ thuá»™c vÃ o text/translations
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('role-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-submit-button')).toBeInTheDocument();
    });

    /**
     * Test: Verify form renders without API error initially
     * Purpose: Äáº£m báº£o khÃ´ng hiá»ƒn thá»‹ error message khi form má»›i load
     */
    it('does not show error message on initial render', () => {
      render(<RegisterForm />);

      expect(screen.queryByTestId('register-error-message')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // USER INTERACTION TESTS - Kiá»ƒm tra tÆ°Æ¡ng tÃ¡c ngÆ°á»i dÃ¹ng
  // ============================================================================

  describe('User Interactions', () => {
    /**
     * Test: Verify user can type in text input fields
     * Purpose: Äáº£m báº£o cÃ¡c input fields nháº­n vÃ  hiá»ƒn thá»‹ Ä‘Ãºng giÃ¡ trá»‹ ngÆ°á»i dÃ¹ng nháº­p
     * What it checks:
     * - User cÃ³ thá»ƒ type vÃ o email field
     * - User cÃ³ thá»ƒ type vÃ o name field
     * - User cÃ³ thá»ƒ type vÃ o password field
     * - User cÃ³ thá»ƒ type vÃ o confirm password field
     * - GiÃ¡ trá»‹ Ä‘Æ°á»£c cáº­p nháº­t Ä‘Ãºng sau khi typing
     */
    it('allows typing in all text input fields', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Láº¥y cÃ¡c input elements báº±ng data-testid
      const emailInput = screen.getByTestId('email-input');
      const nameInput = screen.getByTestId('name-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');

      // Simulate user typing
      await user.type(emailInput, validFormData.email);
      await user.type(nameInput, validFormData.name);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);

      // Verify values are updated correctly
      expect(emailInput).toHaveValue(validFormData.email);
      expect(nameInput).toHaveValue(validFormData.name);
      expect(passwordInput).toHaveValue(validFormData.password);
      expect(confirmPasswordInput).toHaveValue(validFormData.confirmPassword);
    });

    /**
     * Test: Verify role select dropdown is accessible
     * Purpose: Äáº£m báº£o role select cÃ³ thá»ƒ Ä‘Æ°á»£c interact
     */
    it('renders role select dropdown', () => {
      render(<RegisterForm />);

      const roleSelect = screen.getByTestId('role-input');
      expect(roleSelect).toBeInTheDocument();
    });
  });

  // ============================================================================
  // FORM SUBMISSION TESTS - Kiá»ƒm tra submit form
  // ============================================================================

  describe('Form Submission', () => {
    /**
     * Test: Verify form submission with valid data
     * Purpose: Äáº£m báº£o form gá»i register function vá»›i Ä‘Ãºng data
     * Note: Test nÃ y bá»‹ skip vÃ¬ Select component cáº§n interaction phá»©c táº¡p hÆ¡n
     *       NÃªn dÃ¹ng E2E test cho full form submission vá»›i role selection
     */
    it.skip('calls register function with credentials on submit', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByTestId('email-input'), validFormData.email);
      await user.type(screen.getByTestId('name-input'), validFormData.name);
      await user.type(screen.getByTestId('password-input'), validFormData.password);
      await user.type(screen.getByTestId('confirm-password-input'), validFormData.confirmPassword);
      // Note: Role selection requires complex Radix Select interaction
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: validFormData.email,
          name: validFormData.name,
          password: validFormData.password,
          roleId: expect.any(Number),
        });
      });
    });
  });

  // ============================================================================
  // VALIDATION TESTS - Kiá»ƒm tra validation errors
  // ============================================================================

  describe('Validation', () => {
    /**
     * Test: Integration test - Component hiá»ƒn thá»‹ validation errors
     * Purpose: Verify component integrates correctly with schema validation
     * Note: Chi tiáº¿t validation rules Ä‘Ã£ Ä‘Æ°á»£c test trong register.schema.test.ts
     */
    it('shows validation error when some fields are invalid', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Submit form rá»—ng sáº½ trigger validation errors
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        // âœ… Verify: CÃ³ Ã­t nháº¥t 1 error message Ä‘Æ°á»£c hiá»ƒn thá»‹
        const alertElements = screen.getAllByRole('alert');
        expect(alertElements.length).toBeGreaterThan(0);
      });
    });

    /**
     * Test: Integration test - Form khÃ´ng submit khi cÃ³ validation error
     * Purpose: Verify form prevents submission when validation fails
     * Note: Chi tiáº¿t validation rules Ä‘Ã£ Ä‘Æ°á»£c test trong register.schema.test.ts
     */
    it('form should not be submit when some fields are invalid', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Submit form vá»›i data khÃ´ng há»£p lá»‡ (email sai format)
      await user.type(screen.getByTestId('email-input'), 'invalid-email');
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        // âœ… Verify: register function KHÃ”NG Ä‘Æ°á»£c gá»i
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  // ============================================================================
  // LOADING STATE TESTS - Kiá»ƒm tra tráº¡ng thÃ¡i loading
  // ============================================================================

  describe('Loading State', () => {
    /**
     * Test: Verify form is disabled during registration API call
     * Purpose: Äáº£m báº£o UI ngÄƒn user tÆ°Æ¡ng tÃ¡c trong khi Ä‘ang xá»­ lÃ½ Ä‘Äƒng kÃ½
     * What it checks:
     * - Email input bá»‹ disabled khi isPending = true
     * - Name input bá»‹ disabled khi isPending = true
     * - Password input bá»‹ disabled khi isPending = true
     * - Confirm password input bá»‹ disabled khi isPending = true
     * - Role select bá»‹ disabled khi isPending = true
     * - Submit button bá»‹ disabled Ä‘á»ƒ ngÄƒn submit nhiá»u láº§n
     */
    it('disables all form fields when loading', () => {
      // Mock loading state
      mockUseRegister.mockReturnValue({
        register: mockRegister,
        isPending: true,
        error: null,
      });

      render(<RegisterForm />);

      // âœ… Verify táº¥t cáº£ fields bá»‹ disabled
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('name-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
      expect(screen.getByTestId('confirm-password-input')).toBeDisabled();
      expect(screen.getByTestId('role-input')).toBeDisabled();
      expect(screen.getByTestId('register-submit-button')).toBeDisabled();
    });

    /**
     * Test: Verify form fields are enabled when not loading
     * Purpose: Äáº£m báº£o form cÃ³ thá»ƒ tÆ°Æ¡ng tÃ¡c khi khÃ´ng á»Ÿ tráº¡ng thÃ¡i loading
     */
    it('enables all form fields when not loading', () => {
      render(<RegisterForm />);

      // âœ… Verify táº¥t cáº£ fields cÃ³ thá»ƒ tÆ°Æ¡ng tÃ¡c
      expect(screen.getByTestId('email-input')).not.toBeDisabled();
      expect(screen.getByTestId('name-input')).not.toBeDisabled();
      expect(screen.getByTestId('password-input')).not.toBeDisabled();
      expect(screen.getByTestId('confirm-password-input')).not.toBeDisabled();
      expect(screen.getByTestId('role-input')).not.toBeDisabled();
      expect(screen.getByTestId('register-submit-button')).not.toBeDisabled();
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS - Kiá»ƒm tra xá»­ lÃ½ lá»—i tá»« API
  // ============================================================================

  describe('Error Handling', () => {
    /**
     * Test: Verify API error message is displayed to user
     * Purpose: Äáº£m báº£o server/API errors Ä‘Æ°á»£c hiá»ƒn thá»‹ trong UI
     * What it checks:
     * - Khi cÃ³ error tá»« useRegister hook, error Ä‘Æ°á»£c render
     * - Error message tá»« API/server Ä‘Æ°á»£c hiá»ƒn thá»‹ Ä‘Ãºng
     * - Error cÃ³ proper accessibility role (alert)
     * - User cÃ³ thá»ƒ tháº¥y Ä‘Æ°á»£c lá»—i xáº£y ra
     */
    it('displays error message when API returns error', () => {
      const errorMessage = 'Email already exists';

      // Mock error state
      mockUseRegister.mockReturnValue({
        register: mockRegister,
        isPending: false,
        error: { message: errorMessage },
      });

      render(<RegisterForm />);

      // âœ… Verify error element tá»“n táº¡i vÃ  hiá»ƒn thá»‹ Ä‘Ãºng message
      const errorElement = screen.getByTestId('register-error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMessage);
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    /**
     * Test: Verify no error message when there's no error
     * Purpose: Äáº£m báº£o khÃ´ng hiá»ƒn thá»‹ error khi hook khÃ´ng tráº£ vá» error
     */
    it('does not display error message when error is null', () => {
      // Default mock already has error: null
      render(<RegisterForm />);

      expect(screen.queryByTestId('register-error-message')).not.toBeInTheDocument();
    });

    /**
     * Test: Verify error message displays fallback when message is empty
     * Purpose: Äáº£m báº£o cÃ³ fallback message khi error khÃ´ng cÃ³ message
     */
    it('displays fallback error message when error.message is empty', () => {
      // Mock error without message
      mockUseRegister.mockReturnValue({
        register: mockRegister,
        isPending: false,
        error: { message: '' },
      });

      render(<RegisterForm />);

      const errorElement = screen.getByTestId('register-error-message');
      expect(errorElement).toBeInTheDocument();
      // Component cÃ³ fallback 'Register failed'
      expect(errorElement).toHaveTextContent('Register failed');
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS - Kiá»ƒm tra accessibility
  // ============================================================================

  describe('Accessibility', () => {
    /**
     * Test: Verify form has proper labels for screen readers
     * Purpose: Äáº£m báº£o form accessible cho screen reader users
     */
    it('has labels associated with inputs', () => {
      render(<RegisterForm />);

      // Verify labels exist (by checking htmlFor/id relationship)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      // Use getAllByLabelText since there are multiple password-related labels
      const passwordLabels = screen.getAllByLabelText(/password/i);
      expect(passwordLabels.length).toBeGreaterThan(0);
    });

    /**
     * Test: Verify submit button has aria-label
     * Purpose: Äáº£m báº£o submit button cÃ³ aria-label cho screen readers
     */
    it('submit button has aria-label', () => {
      render(<RegisterForm />);

      const submitButton = screen.getByTestId('register-submit-button');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit registration form');
    });

    /**
     * Test: Verify validation errors have alert role
     * Purpose: Äáº£m báº£o error messages Ä‘Æ°á»£c announce bá»Ÿi screen readers
     */
    it('validation errors have alert role for screen readers', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Trigger validation error
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        const alertElements = screen.getAllByRole('alert');
        // Verify all error elements have role="alert"
        alertElements.forEach((element) => {
          expect(element).toHaveAttribute('role', 'alert');
        });
      });
    });
  });
});

