// ==================== UTILITIES ====================
// src/utils/fieldVisibility.ts

import { BaseField, FormValues } from '../types/schema.types';

export const isFieldVisible = (
  field: BaseField,
  values: FormValues
): boolean => {
  if (field.visible === false) return false;
  if (!field.dependsOn) return true;

  const { field: dependentField, value: dependentValue, operator = 'equals' } = field.dependsOn;
  const currentValue = values[dependentField];

  switch (operator) {
    case 'equals':
      return currentValue === dependentValue;
    case 'notEquals':
      return currentValue !== dependentValue;
    case 'contains':
      return Array.isArray(currentValue) && currentValue.includes(dependentValue);
    case 'greaterThan':
      return currentValue > dependentValue;
    case 'lessThan':
      return currentValue < dependentValue;
    default:
      return true;
  }
};

export const getVisibleFields = (
  fields: BaseField[],
  values: FormValues
): BaseField[] => {
  return fields.filter(field => isFieldVisible(field, values));
};