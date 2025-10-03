// tests/useFormValidation.test.ts

import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../src/hooks/useFormValidation';
import { BaseField } from '../src/types/schema.types';

describe('useFormValidation', () => {
  const fields: BaseField[] = [
    {
      id: 'email',
      name: 'email',
      label: 'E-mail',
      type: 'email',
      validations: [
        { type: 'required', message: 'E-mail é obrigatório' },
        { type: 'email', message: 'E-mail inválido' }
      ]
    },
    {
      id: 'name',
      name: 'name',
      label: 'Nome',
      type: 'text',
      validations: [
        { type: 'required', message: 'Nome é obrigatório' },
        { type: 'min', value: 3, message: 'Mínimo 3 caracteres' }
      ]
    }
  ];

  test('initializes with empty values', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    expect(result.current.values).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('validates required field', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.handleBlur('email', fields[0]);
    });

    expect(result.current.errors.email).toBe('E-mail é obrigatório');
    expect(result.current.touched.email).toBe(true);
  });

  test('validates email format', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.handleChange('email', 'invalid-email', fields[0]);
      result.current.handleBlur('email', fields[0]);
    });

    expect(result.current.errors.email).toBe('E-mail inválido');
  });

  test('validates min length', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.handleChange('name', 'Jo', fields[1]);
      result.current.handleBlur('name', fields[1]);
    });

    expect(result.current.errors.name).toBe('Mínimo 3 caracteres');
  });

  test('validateAll returns false when there are errors', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    let isValid = false;
    act(() => {
      isValid = result.current.validateAll();
    });

    expect(isValid).toBe(false);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  test('validateAll returns true when all fields are valid', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.handleChange('email', 'test@example.com', fields[0]);
      result.current.handleChange('name', 'João Silva', fields[1]);
    });

    let isValid = true;
    act(() => {
      isValid = result.current.validateAll();
    });

    expect(isValid).toBe(true);
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  test('reset clears all values and errors', () => {
    const { result } = renderHook(() => useFormValidation(fields));

    act(() => {
      result.current.handleChange('email', 'test@example.com', fields[0]);
      result.current.handleChange('name', 'João', fields[1]);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});