import React from 'react';
import DynamicScreenRenderer from '@flmendes/dynamic-screen-lib';

// Exemplo 1: Uso básico
export function BasicUsage() {
  return (
    <DynamicScreenRenderer
      screenId="user-registration"
      apiBaseUrl="https://api.example.com"
      onSuccess={(data) => {
        console.log('Cadastro realizado:', data);
        window.location.href = '/dashboard';
      }}
      onError={(error) => {
        console.error('Erro no cadastro:', error);
        alert('Erro ao processar formulário');
      }}
    />
  );
}

// Exemplo 2: Com renderização customizada
export function CustomRendering() {
  return (
    <DynamicScreenRenderer
      screenId="order-form"
      apiBaseUrl="https://api.example.com"
      renderLoading={() => (
        <div className="custom-loader">
          <h2>Carregando seu formulário...</h2>
          <div className="spinner" />
        </div>
      )}
      renderError={(error) => (
        <div className="custom-error">
          <h2>Ops! Algo deu errado</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      )}
      renderSuccess={(data) => (
        <div className="custom-success">
          <h2>Pedido #{data.orderId} criado!</h2>
          <p>Seu pedido foi processado com sucesso.</p>
          <button onClick={() => window.location.href = '/orders'}>
            Ver Pedidos
          </button>
        </div>
      )}
    />
  );
}

// Exemplo 3: Com fetch customizado
export function CustomFetch() {
  const customFetch = async (screenId: string) => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`/api/v2/screens/${screenId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': 'abc123'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load screen');
    }
    
    return response.json();
  };

  return (
    <DynamicScreenRenderer
      screenId="performance-review"
      customFetch={customFetch}
      onSuccess={(data) => {
        console.log('Review submitted:', data);
      }}
    />
  );
}

// Exemplo 4: Com ações customizadas de botões
export function CustomActions() {
  const handleButtonClick = (action: string, customAction?: string) => {
    switch (customAction) {
      case 'save-draft':
        console.log('Salvando rascunho...');
        // Implementar lógica de salvar rascunho
        break;
      case 'export-pdf':
        console.log('Exportando PDF...');
        // Implementar lógica de exportar
        break;
      default:
        // Deixa a biblioteca lidar com ações padrão
        break;
    }
  };

  return (
    <DynamicScreenRenderer
      screenId="order-form"
      apiBaseUrl="https://api.example.com"
      onButtonClick={handleButtonClick}
    />
  );
}