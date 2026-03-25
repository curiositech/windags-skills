---
license: Apache-2.0
name: vitest-testing-patterns
description: Write tests using Vitest and React Testing Library. Use when creating unit tests, component tests, integration tests, or mocking dependencies. Activates for test file creation, mock patterns, coverage, and testing best practices.
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Code Quality & Testing
tags:
  - testing
  - code
  - automation
  - jest
  - react
---

# Vitest Testing Patterns

Write effective tests using Vitest and React Testing Library following project conventions.

## Decision Points

**If testing authentication flows:**
- If API route: Mock `getSession()` → test 401/200 responses
- If component with auth hook: Mock `useAuth` → test loading/authenticated/unauthenticated states
- If utility function: Mock auth service → test token validation logic

**If testing async operations:**
- If API calls: Use `waitFor()` for state changes, mock fetch/axios
- If user interactions: Use `userEvent.setup()` + `await user.click()`
- If timers/debouncing: Use `vi.useFakeTimers()` + `vi.advanceTimersByTime()`

**If testing form interactions:**
- If simple inputs: Use `getByRole('textbox')` + `userEvent.type()`
- If complex forms: Use `getByLabelText()` for accessibility
- If validation: Test both valid submission and error states

**If testing error boundaries:**
- If component errors: Mock dependency to throw → verify error UI
- If network errors: Mock fetch rejection → test error handling
- If validation errors: Submit invalid data → verify error messages

**If choosing mock strategy:**
- If external API: Mock at module level (`vi.mock('@/lib/api')`)
- If database queries: Mock ORM methods with chained returns
- If React hooks: Mock hook module, return test data
- If utilities: Mock implementation, verify calls with correct args

## Failure Modes

**Mock Pollution**: Tests affect each other due to shared mock state
- Detection: Random test failures when run together but pass individually
- Fix: Add `vi.clearAllMocks()` in `beforeEach()` or `afterEach()`

**Over-Mocking**: Mocking too much implementation detail, tests become brittle
- Detection: Tests break on refactors that don't change behavior
- Fix: Mock at boundaries (API calls, external services), not internal functions

**Async Race Conditions**: Tests fail sporadically due to timing issues
- Detection: Intermittent failures with "element not found" or timeout errors
- Fix: Use `waitFor()` or `findBy*` queries instead of `getBy*` for async content

**Query Priority Violations**: Using low-priority queries when accessible ones exist
- Detection: Tests use `getByTestId` or `querySelector` for interactive elements
- Fix: Replace with `getByRole('button')`, `getByLabelText()`, etc.

**Mock Implementation Drift**: Mocks don't match real API changes
- Detection: Tests pass but integration fails in production
- Fix: Create shared mock factories, update mocks when API changes

## Worked Example

Testing a form component with validation and API submission:

```typescript
// 1. SETUP - Mock dependencies at module level
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'user-123' },
    isLoading: false,
  }),
}));

vi.mock('@/lib/api', () => ({
  submitForm: vi.fn(),
}));

// 2. DECISION - Component test with form interaction
describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Prevent mock pollution
  });

  it('handles successful form submission', async () => {
    // 3. SETUP - Configure mocks for success case
    const mockSubmit = vi.mocked(submitForm);
    mockSubmit.mockResolvedValue({ success: true });
    
    const user = userEvent.setup();
    render(<ContactForm />);

    // 4. DECISION - Use accessible queries (getByLabelText vs getByTestId)
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // 5. ACTION - Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // 6. DECISION - Use waitFor for async state changes
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });

    // 7. VERIFY - Mock was called with correct data
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('displays validation errors', async () => {
    // Expert catches: Test error state, not just happy path
    const user = userEvent.setup();
    render(<ContactForm />);

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify validation errors appear
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    
    // Verify API was not called with invalid data
    expect(submitForm).not.toHaveBeenCalled();
  });
});
```

**Novice misses:** Testing only happy path, using `getByTestId`, not cleaning mocks
**Expert catches:** Error states, accessible queries, mock verification, async handling

## Quality Gates

- [ ] All async operations use `waitFor()` or `findBy*` queries
- [ ] Mocks are cleared between tests (`vi.clearAllMocks()` in hooks)
- [ ] Interactive elements tested with `getByRole()` or `getByLabelText()`
- [ ] Both happy path and error states covered for each component
- [ ] Mock functions verified with `toHaveBeenCalledWith()` for critical calls
- [ ] No `act()` warnings in test output
- [ ] Test names describe behavior, not implementation ("submits form" not "calls handleSubmit")
- [ ] Coverage includes edge cases (empty states, loading states, error boundaries)
- [ ] User interactions use `userEvent` not `fireEvent`
- [ ] External dependencies mocked at module level, not inline

## NOT-FOR Boundaries

**❌ DO NOT use for:**
- End-to-end testing → Use `playwright-testing` skill instead
- Performance testing → Use `performance-testing` skill instead
- API contract testing → Use `openapi-testing` skill instead
- Visual regression testing → Use `visual-testing` skill instead
- Load testing → Use dedicated load testing tools

**✅ USE this skill for:**
- Unit tests for utilities and pure functions
- Component tests with React Testing Library
- Integration tests within a single module
- Mock patterns for external dependencies
- Test setup and configuration