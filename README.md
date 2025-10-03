# Dynamic Screen Library

Biblioteca completa para renderização dinâmica de formulários baseados em JSON Schema.

## 📦 Instalação

```bash
npm install @flmendes/dynamic-screen-lib
```

## ⚙️ Configuração do Tailwind CSS

Esta biblioteca usa Tailwind CSS para estilização. Escolha a configuração baseada na sua versão do Tailwind:

### Opção A: Tailwind CSS v4 com Vite (Recomendado)

Se você usa Vite com o plugin `@tailwindcss/vite`:

#### 1. Instalar Tailwind CSS v4

```bash
npm install -D @tailwindcss/vite
```

#### 2. Configurar Vite

Edite `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

#### 3. Criar arquivo CSS

Crie `src/app.css`:

```css
@import "tailwindcss";

/* Escanear componentes da biblioteca */
@source "../node_modules/@flmendes/dynamic-screen-lib/dist";
```

#### 4. Importar CSS no app

```tsx
// src/main.tsx
import './app.css';
```

---

### Opção B: Tailwind CSS v3 (Configuração Tradicional)

Se você usa Tailwind CSS v3 ou anterior:

#### 1. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. Configurar Tailwind

Edite `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Incluir componentes da biblioteca
    "./node_modules/@flmendes/dynamic-screen-lib/dist/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 3. Adicionar diretivas Tailwind

Crie ou edite `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. Importar CSS no app

```tsx
// src/main.tsx
import './index.css';
```

## 🚀 Uso Rápido

```tsx
import { DynamicScreenRenderer } from '@flmendes/dynamic-screen-lib';

function App() {
  return (
    <DynamicScreenRenderer
      screenId="user-registration"
      apiBaseUrl="https://api.example.com"
      onSuccess={(data) => console.log('Success!', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

## 📚 Documentação Completa

### Componentes Disponíveis

- `DynamicScreenRenderer` - Componente principal
- `DynamicField` - Renderiza campos individuais
- `FormSection` - Agrupa campos em seções
- `StepWizard` - Navegação entre steps

### Hooks

- `useDynamicScreen` - Gerencia estado da tela
- `useFormValidation` - Validações de formulário

### Utilitários

- `formatters` - Máscaras de CPF, CNPJ, telefone, etc.
- `getVisibleFields` - Lógica de campos condicionais

### API Client

```typescript
import { DynamicScreenClient } from '@flmendes/dynamic-screen-lib';

const client = new DynamicScreenClient('https://api.example.com');
client.setAuthToken('your-jwt-token');

const schema = await client.getScreen('user-registration');
const result = await client.submitScreen('user-registration', formData);
```

## 🎨 Tipos de Campo Suportados

- text, email, password, number
- textarea
- select, radio, checkbox
- date

## ✅ Validações Disponíveis

- required
- email
- min/max (length)
- pattern (regex)
- custom (função customizada)

## 🔧 Backend Integration

### Express.js Example

```typescript
import express from 'express';
import screenRoutes from './routes/screenRoutes';

const app = express();
app.use(express.json());
app.use('/api', screenRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🎯 Features

- ✅ Validação em tempo real
- ✅ Campos condicionais
- ✅ Wizard multi-step
- ✅ Máscaras de formatação
- ✅ Seções colapsáveis
- ✅ TypeScript completo
- ✅ Totalmente customizável

## 📖 Exemplos Avançados

### Validação Customizada

```typescript
{
  "id": "password",
  "name": "password",
  "type": "password",
  "validations": [
    {
      "type": "custom",
      "message": "Senha deve conter letra maiúscula e número",
      "customValidator": (value, allValues) => {
        return /[A-Z]/.test(value) && /[0-9]/.test(value);
      }
    }
  ]
}
```

### Campos Condicionais Avançados

```typescript
// Campo aparece apenas se outro campo tiver valor específico
{
  "id": "otherReason",
  "name": "otherReason",
  "type": "text",
  "dependsOn": {
    "field": "reason",
    "value": "other",
    "operator": "equals"
  }
}

// Campo aparece se valor for maior que X
{
  "id": "managerApproval",
  "name": "managerApproval",
  "type": "checkbox",
  "dependsOn": {
    "field": "amount",
    "value": 1000,
    "operator": "greaterThan"
  }
}
```

## 🛠️ Customização

### Tema Customizado

```tsx
<DynamicScreenRenderer
  screenId="user-form"
  apiBaseUrl="https://api.example.com"
  renderLoading={() => <CustomLoader />}
  renderError={(error) => <CustomError error={error} />}
  renderSuccess={(data) => <CustomSuccess data={data} />}
/>
```

### Estilos Customizados

```tsx
import DynamicField from '@flmendes/dynamic-screen-lib';

<DynamicField
  field={field}
  value={value}
  onChange={onChange}
  onBlur={onBlur}
  className="custom-input-class"
/>
```

## 🔐 Segurança

### Autenticação

```typescript
const client = new DynamicScreenClient('https://api.example.com');

// JWT Token
client.setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Custom Header
client.setHeader('X-API-Key', 'your-api-key');
```

### Validação Server-Side

Sempre valide no backend! A validação do frontend é apenas UX.

```typescript
// Backend validation
const validationResult = await screenService.validateSubmission(
  screenId,
  formData
);

if (!validationResult.isValid) {
  return res.status(400).json({
    errors: validationResult.errors
  });
}
```

## 📊 Monitoramento

```typescript
<DynamicScreenRenderer
  screenId="user-registration"
  onSuccess={(data) => {
    // Analytics
    analytics.track('Form Submitted', {
      screenId: 'user-registration',
      timestamp: new Date()
    });
  }}
  onError={(error) => {
    // Error tracking
    errorLogger.log('Form Error', {
      screenId: 'user-registration',
      error: error.message
    });
  }}
/>
```

## 🧪 Testes

### Testando Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicScreenRenderer } from '@flmendes/dynamic-screen-lib';

test('renders form and submits data', async () => {
  const onSuccess = jest.fn();

  render(
    <DynamicScreenRenderer
      screenId="test-form"
      customFetch={async () => mockSchema}
      onSuccess={onSuccess}
    />
  );

  // Preenche campos
  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'João Silva' }
  });

  // Submete
  fireEvent.click(screen.getByText('Enviar'));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

## 🎓 Casos de Uso

### 1. Formulário de Cadastro

```json
{
  "screenId": "user-registration",
  "type": "wizard",
  "steps": [
    { "title": "Dados Pessoais" },
    { "title": "Endereço" },
    { "title": "Confirmação" }
  ]
}
```

### 2. Formulário de Pedido

```json
{
  "screenId": "order-form",
  "type": "single",
  "steps": [
    {
      "sections": [
        { "title": "Cliente" },
        { "title": "Produtos" },
        { "title": "Entrega" }
      ]
    }
  ]
}
```

### 3. Avaliação de Desempenho

```json
{
  "screenId": "performance-review",
  "type": "tabbed",
  "steps": [
    { "title": "Técnicas" },
    { "title": "Comportamentais" },
    { "title": "Metas" }
  ]
}
```

## 🔄 Versionamento

A biblioteca suporta versionamento de schemas:

```json
{
  "screenId": "user-registration",
  "version": "2.1.0",
  "steps": [...]
}
```

Backend pode retornar versões diferentes baseado em:
- Feature flags
- A/B testing
- Permissões de usuário
- Ambiente (dev/staging/prod)

## 📈 Performance

### Otimizações

- Lazy loading de schemas
- Memoização de campos
- Debounce em validações
- Code splitting por tipo de campo

### Bundle Size

- Core: ~25kb (gzipped)
- Com todos os componentes: ~45kb (gzipped)

## 🌍 i18n (Internacionalização)

```typescript
// Schema com múltiplos idiomas
{
  "screenId": "user-registration",
  "title": {
    "pt-BR": "Cadastro de Usuário",
    "en-US": "User Registration",
    "es-ES": "Registro de Usuario"
  },
  "steps": [...]
}

// No frontend
<DynamicScreenRenderer
  screenId="user-registration"
  locale="pt-BR"
/>
```

## 🤝 Contribuindo

```bash
# Clone o repositório
git clone https://github.com/flmendes/dynamic-screen-lib

# Instale dependências
npm install

# Execute testes
npm test

# Build
npm run build
```

## 📄 Licença

MIT License - veja LICENSE.md para detalhes

## 🔗 Links Úteis

- [Documentação Completa](https://docs.example.com)
- [Exemplos no CodeSandbox](https://codesandbox.io/examples)
- [Playground Interativo](https://playground.example.com)
- [GitHub Issues](https://github.com/flmendes/dynamic-screen-lib/issues)
