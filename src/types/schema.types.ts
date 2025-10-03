// ==================== TYPES ====================
// src/types/schema.types.ts

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any, allValues: Record<string, any>) => boolean;
}

export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface BaseField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'password';
  placeholder?: string;
  defaultValue?: any;
  validations?: ValidationRule[];
  disabled?: boolean;
  visible?: boolean;
  options?: FieldOption[];
  dependsOn?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  };
  mask?: string;
  helpText?: string;
}

export interface Button {
  id: string;
  label: string;
  type: 'submit' | 'button' | 'reset';
  action: 'next' | 'previous' | 'submit' | 'cancel' | 'custom';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  customAction?: string;
}

export interface Section {
  id: string;
  title?: string;
  description?: string;
  fields: BaseField[];
  visible?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
  buttons: Button[];
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

export interface ScreenSchema {
  screenId: string;
  version?: string;
  title: string;
  description?: string;
  type: 'single' | 'wizard' | 'tabbed';
  steps: Step[];
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  };
  onSubmit?: {
    endpoint: string;
    method?: 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
  };
  onError?: {
    showNotification?: boolean;
    redirectTo?: string;
  };
  styling?: {
    theme?: 'light' | 'dark';
    primaryColor?: string;
  };
}

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}