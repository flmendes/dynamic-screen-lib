// ==================== COMPONENTE: DynamicField ====================
// src/components/DynamicField.tsx

import React, { useMemo } from 'react';
import { BaseField, FieldOption } from '../types/schema.types';
import { formatters } from '../utils/formatting';

interface DynamicFieldProps {
  field: BaseField;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  className?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  className = ''
}) => {
  const showError = touched && error;
  const isRequired = useMemo(
    () => field.validations?.some(v => v.type === 'required'),
    [field.validations]
  );

  const baseInputClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:outline-hidden focus:ring-2 focus:ring-blue-500
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${showError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `;

  const handleMaskedChange = (rawValue: string) => {
    if (!field.mask) {
      onChange(rawValue);
      return;
    }

    const formatter = formatters[field.mask as keyof typeof formatters];
    if (formatter) {
      onChange(formatter(rawValue));
    } else {
      onChange(rawValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <input
            id={field.id}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => {
              if (field.mask) {
                handleMaskedChange(e.target.value);
              } else {
                onChange(e.target.value);
              }
            }}
            onBlur={onBlur}
            disabled={field.disabled}
            className={baseInputClasses}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${field.id}-error` : undefined}
          />
        );

      case 'date':
        return (
          <input
            id={field.id}
            name={field.name}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={field.disabled}
            className={baseInputClasses}
            aria-invalid={showError ? 'true' : 'false'}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={field.disabled}
            rows={4}
            className={`${baseInputClasses} resize-vertical`}
            aria-invalid={showError ? 'true' : 'false'}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            name={field.name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={field.disabled}
            className={baseInputClasses}
            aria-invalid={showError ? 'true' : 'false'}
          >
            <option value="">
              {field.placeholder || 'Selecione uma opção...'}
            </option>
            {field.options?.map((opt: FieldOption) => (
              <option 
                key={opt.value} 
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              disabled={field.disabled}
              className="
                mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded 
                focus:ring-2 focus:ring-blue-500
                disabled:opacity-50
              "
              aria-invalid={showError ? 'true' : 'false'}
            />
            <label 
              htmlFor={field.id} 
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((opt: FieldOption) => (
              <div key={opt.value} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={`${field.id}-${opt.value}`}
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  disabled={field.disabled || opt.disabled}
                  className="
                    w-4 h-4 text-blue-600 border-gray-300 
                    focus:ring-2 focus:ring-blue-500
                  "
                />
                <label 
                  htmlFor={`${field.id}-${opt.value}`}
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Checkbox e radio tem layout diferente
  if (field.type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderField()}
        {field.helpText && !showError && (
          <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
        )}
        {showError && (
          <p 
            id={`${field.id}-error`}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      {field.type !== 'radio' && (
        <label 
          htmlFor={field.id} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {field.type === 'radio' && (
        <div className="text-sm font-medium text-gray-700 mb-3">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      {renderField()}

      {field.helpText && !showError && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}

      {showError && (
        <p 
          id={`${field.id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default DynamicField;