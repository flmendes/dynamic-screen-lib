import '@testing-library/jest-dom';

// Extend Jest matchers with jest-dom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value?: string | number | string[]): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeVisible(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}