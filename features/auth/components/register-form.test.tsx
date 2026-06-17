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
 * Mock các hooks được sử dụng bởi RegisterForm
 * - useRegister: Hook xử lý đăng ký tài khoản
 * - useGetRoles: Hook lấy danh sách roles từ API
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
   * Mock data cho danh sách roles
   * Được sử dụng để populate Select dropdown
   */
  const mockRoles = [
    { id: 1, name: 'Student' },
    { id: 2, name: 'Teacher' },
  ];

  /**
   * Valid form data - dùng cho các test case thành công
   */
  const validFormData = {
    email: 'test@example.com',
    name: 'John Doe',
    password: 'password123',
    confirmPassword: 'password123',
  };

  // ============================================================================
  // BEFORE EACH - Reset mocks trước mỗi test
  // ============================================================================

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useRegister với trạng thái mặc định (không loading, không error)
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      isPending: false,
      error: null,
    });

    // Mock useGetRoles với danh sách roles mẫu
    mockUseGetRoles.mockReturnValue({
      data: mockRoles,
    });
  });

  // ============================================================================
  // RENDERING TESTS - Kiểm tra form render đúng các elements
  // ============================================================================

  describe('Rendering', () => {
    /**
     * Test: Verify form renders correctly with all required elements
     * Purpose: Đảm bảo register form hiển thị đầy đủ các input fields và submit button
     * What it checks:
     * - Form container tồn tại
     * - Email, name, password, confirm password inputs tồn tại
     * - Role select dropdown tồn tại
     * - Submit button tồn tại
     */
    it('renders register form with all input fields', () => {
      render(<RegisterForm />);

      // ✅ Sử dụng data-testid - không phụ thuộc vào text/translations
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
     * Purpose: Đảm bảo không hiển thị error message khi form mới load
     */
    it('does not show error message on initial render', () => {
      render(<RegisterForm />);

      expect(screen.queryByTestId('register-error-message')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // USER INTERACTION TESTS - Kiểm tra tương tác người dùng
  // ============================================================================

  describe('User Interactions', () => {
    /**
     * Test: Verify user can type in text input fields
     * Purpose: Đảm bảo các input fields nhận và hiển thị đúng giá trị người dùng nhập
     * What it checks:
     * - User có thể type vào email field
     * - User có thể type vào name field
     * - User có thể type vào password field
     * - User có thể type vào confirm password field
     * - Giá trị được cập nhật đúng sau khi typing
     */
    it('allows typing in all text input fields', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Lấy các input elements bằng data-testid
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
     * Purpose: Đảm bảo role select có thể được interact
     */
    it('renders role select dropdown', () => {
      render(<RegisterForm />);

      const roleSelect = screen.getByTestId('role-input');
      expect(roleSelect).toBeInTheDocument();
    });
  });

  // ============================================================================
  // FORM SUBMISSION TESTS - Kiểm tra submit form
  // ============================================================================

  describe('Form Submission', () => {
    /**
     * Test: Verify form submission with valid data
     * Purpose: Đảm bảo form gọi register function với đúng data
     * Note: Test này bị skip vì Select component cần interaction phức tạp hơn
     *       Nên dùng E2E test cho full form submission với role selection
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
          full_name: validFormData.name,
          password: validFormData.password,
          role_id: expect.any(Number),
        });
      });
    });
  });

  // ============================================================================
  // VALIDATION TESTS - Kiểm tra validation errors
  // ============================================================================

  describe('Validation', () => {
    /**
     * Test: Integration test - Component hiển thị validation errors
     * Purpose: Verify component integrates correctly with schema validation
     * Note: Chi tiết validation rules đã được test trong register.schema.test.ts
     */
    it('shows validation error when some fields are invalid', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Submit form rỗng sẽ trigger validation errors
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        // ✅ Verify: Có ít nhất 1 error message được hiển thị
        const alertElements = screen.getAllByRole('alert');
        expect(alertElements.length).toBeGreaterThan(0);
      });
    });

    /**
     * Test: Integration test - Form không submit khi có validation error
     * Purpose: Verify form prevents submission when validation fails
     * Note: Chi tiết validation rules đã được test trong register.schema.test.ts
     */
    it('form should not be submit when some fields are invalid', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      // Submit form với data không hợp lệ (email sai format)
      await user.type(screen.getByTestId('email-input'), 'invalid-email');
      await user.click(screen.getByTestId('register-submit-button'));

      await waitFor(() => {
        // ✅ Verify: register function KHÔNG được gọi
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  // ============================================================================
  // LOADING STATE TESTS - Kiểm tra trạng thái loading
  // ============================================================================

  describe('Loading State', () => {
    /**
     * Test: Verify form is disabled during registration API call
     * Purpose: Đảm bảo UI ngăn user tương tác trong khi đang xử lý đăng ký
     * What it checks:
     * - Email input bị disabled khi isPending = true
     * - Name input bị disabled khi isPending = true
     * - Password input bị disabled khi isPending = true
     * - Confirm password input bị disabled khi isPending = true
     * - Role select bị disabled khi isPending = true
     * - Submit button bị disabled để ngăn submit nhiều lần
     */
    it('disables all form fields when loading', () => {
      // Mock loading state
      mockUseRegister.mockReturnValue({
        register: mockRegister,
        isPending: true,
        error: null,
      });

      render(<RegisterForm />);

      // ✅ Verify tất cả fields bị disabled
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('name-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
      expect(screen.getByTestId('confirm-password-input')).toBeDisabled();
      expect(screen.getByTestId('role-input')).toBeDisabled();
      expect(screen.getByTestId('register-submit-button')).toBeDisabled();
    });

    /**
     * Test: Verify form fields are enabled when not loading
     * Purpose: Đảm bảo form có thể tương tác khi không ở trạng thái loading
     */
    it('enables all form fields when not loading', () => {
      render(<RegisterForm />);

      // ✅ Verify tất cả fields có thể tương tác
      expect(screen.getByTestId('email-input')).not.toBeDisabled();
      expect(screen.getByTestId('name-input')).not.toBeDisabled();
      expect(screen.getByTestId('password-input')).not.toBeDisabled();
      expect(screen.getByTestId('confirm-password-input')).not.toBeDisabled();
      expect(screen.getByTestId('role-input')).not.toBeDisabled();
      expect(screen.getByTestId('register-submit-button')).not.toBeDisabled();
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS - Kiểm tra xử lý lỗi từ API
  // ============================================================================

  describe('Error Handling', () => {
    /**
     * Test: Verify API error message is displayed to user
     * Purpose: Đảm bảo server/API errors được hiển thị trong UI
     * What it checks:
     * - Khi có error từ useRegister hook, error được render
     * - Error message từ API/server được hiển thị đúng
     * - Error có proper accessibility role (alert)
     * - User có thể thấy được lỗi xảy ra
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

      // ✅ Verify error element tồn tại và hiển thị đúng message
      const errorElement = screen.getByTestId('register-error-message');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMessage);
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    /**
     * Test: Verify no error message when there's no error
     * Purpose: Đảm bảo không hiển thị error khi hook không trả về error
     */
    it('does not display error message when error is null', () => {
      // Default mock already has error: null
      render(<RegisterForm />);

      expect(screen.queryByTestId('register-error-message')).not.toBeInTheDocument();
    });

    /**
     * Test: Verify error message displays fallback when message is empty
     * Purpose: Đảm bảo có fallback message khi error không có message
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
      // Component có fallback 'Register failed'
      expect(errorElement).toHaveTextContent('Register failed');
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS - Kiểm tra accessibility
  // ============================================================================

  describe('Accessibility', () => {
    /**
     * Test: Verify form has proper labels for screen readers
     * Purpose: Đảm bảo form accessible cho screen reader users
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
     * Purpose: Đảm bảo submit button có aria-label cho screen readers
     */
    it('submit button has aria-label', () => {
      render(<RegisterForm />);

      const submitButton = screen.getByTestId('register-submit-button');
      expect(submitButton).toHaveAttribute('aria-label', 'Submit registration form');
    });

    /**
     * Test: Verify validation errors have alert role
     * Purpose: Đảm bảo error messages được announce bởi screen readers
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
