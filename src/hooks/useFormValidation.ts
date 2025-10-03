// ==================== HOOKS ====================
// src/hooks/useFormValidation.ts

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { BaseField, FormValues, FormErrors, FormTouched } from '../types/schema.types';

export const useFormValidation = (fields: BaseField[]) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track field names to detect when fields actually change
  const fieldNamesKey = useMemo(() =>
    fields.map(f => f.name).sort().join(','),
    [fields]
  );

  const initializedRef = useRef<string>('');

  // Inicializa valores padrão apenas quando os campos realmente mudam
  useEffect(() => {
    if (initializedRef.current === fieldNamesKey) return;

    const initialValues: FormValues = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue;
      }
    });
    setValues(prev => {
      // Only merge if we have new fields
      const hasNewFields = fields.some(f => !(f.name in prev));
      return hasNewFields ? { ...prev, ...initialValues } : prev;
    });

    initializedRef.current = fieldNamesKey;
  }, [fields, fieldNamesKey]);

  // Valida um campo específico
  const validateField = useCallback((field: BaseField, value: any, allValues: FormValues): string | null => {
    if (!field.validations) return null;

    for (const rule of field.validations) {
      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            return rule.message;
          }
          if (typeof value === 'string' && !value.trim()) {
            return rule.message;
          }
          if (Array.isArray(value) && value.length === 0) {
            return rule.message;
          }
          break;

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message;
          }
          break;

        case 'min':
          if (value && value.length < rule.value) {
            return rule.message;
          }
          break;

        case 'max':
          if (value && value.length > rule.value) {
            return rule.message;
          }
          break;

        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            return rule.message;
          }
          break;

        case 'custom':
          if (rule.customValidator && !rule.customValidator(value, allValues)) {
            return rule.message;
          }
          break;
      }
    }
    return null;
  }, []);

  // Manipula mudança de valor
  const handleChange = useCallback((name: string, value: any, field: BaseField) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      
      // Se o campo tem validação, valida imediatamente se já foi tocado
      if (touched[name]) {
        const error = validateField(field, value, newValues);
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: error || ''
        }));
      }
      
      return newValues;
    });
  }, [touched, validateField]);

  // Manipula blur
  const handleBlur = useCallback((name: string, field: BaseField) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Use functional update to get current values
    setValues(currentValues => {
      const error = validateField(field, currentValues[name], currentValues);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
      return currentValues; // Don't change values, just use for validation
    });
  }, [validateField]);

  // Valida todos os campos
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const newTouched: FormTouched = {};

    fields.forEach(field => {
      newTouched[field.name] = true;
      const error = validateField(field, values[field.name], values);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [fields, values, validateField]);

  // Reseta o formulário
  const reset = useCallback(() => {
    const initialValues: FormValues = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue;
      }
    });
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [fields]);

  // Define múltiplos valores de uma vez
  const setFieldValues = useCallback((newValues: FormValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Define um erro manualmente
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues: setFieldValues,
    setFieldError,
    setIsSubmitting
  };
};