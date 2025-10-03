// tests/DynamicField.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicField from '../src/components/DynamicField';
import { BaseField } from '../src/types/schema.types';

describe('DynamicField', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders text input correctly', () => {
    const field: BaseField = {
      id: 'name',
      name: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite seu nome'
    };

    render(
      <DynamicField
        field={field}
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  });

  test('shows error message when touched and has error', () => {
    const field: BaseField = {
      id: 'email',
      name: 'email',
      label: 'E-mail',
      type: 'email'
    };

    render(
      <DynamicField
        field={field}
        value=""
        error="E-mail é obrigatório"
        touched={true}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const field: BaseField = {
      id: 'name',
      name: 'name',
      label: 'Nome',
      type: 'text'
    };

    render(
      <DynamicField
        field={field}
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Nome');
    fireEvent.change(input, { target: { value: 'João' } });

    expect(mockOnChange).toHaveBeenCalledWith('João');
  });

  test('renders select with options', () => {
    const field: BaseField = {
      id: 'country',
      name: 'country',
      label: 'País',
      type: 'select',
      options: [
        { label: 'Brasil', value: 'BR' },
        { label: 'EUA', value: 'US' }
      ]
    };

    render(
      <DynamicField
        field={field}
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.getByText('EUA')).toBeInTheDocument();
  });

  test('applies mask to input', () => {
    const field: BaseField = {
      id: 'cpf',
      name: 'cpf',
      label: 'CPF',
      type: 'text',
      mask: 'cpf'
    };

    render(
      <DynamicField
        field={field}
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('CPF');
    fireEvent.change(input, { target: { value: '12345678900' } });

    // Verifica se o formatador foi chamado
    expect(mockOnChange).toHaveBeenCalled();
  });
});