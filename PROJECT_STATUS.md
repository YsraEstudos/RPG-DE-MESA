# RPG Tabletop - Status do Desenvolvimento

> **Status Atual**: Frontend com Backend Simulado (Mock)
> **Meta Futura**: Integração com Java Spring Boot

## 🏗️ Estado Atual do Projeto

O projeto atualmente opera como uma aplicação **SPA (Single Page Application)** autônoma. Para agilidade no desenvolvimento da interface e usabilidade, a camada de backend está sendo **simulada** (mocked) diretamente no código do frontend.

### Principais Características Atuais:
- **Autenticação Simulada (`authService.ts`)**:
  - Aceita credenciais fictícias para validar o fluxo de login.
  - Possui um modo **Convidado (Guest)** que gera usuários temporários.
  - Simula latência de rede e respostas de erro padrão (401, 400).
- **Persistência Local (`authStore.ts`)**:
  - Utiliza `localStorage` (via Zustand Persist) para manter a sessão do usuário entre recarregamentos.
  - Não há banco de dados real conectado neste momento.

---

## 🚀 Planejamento Futuro: Migração para Java Spring

A visão de longo prazo para este projeto é torná-lo robusto e escalável, substituindo os serviços simulados por um backend real.

### Arquitetura Alvo:
- **Backend**: Java com Spring Boot.
- **Segurança**: Spring Security com JWT.
- **Contrato de API**:
  - O frontend já está utilizando interfaces (`AuthResponse`, `User`, `AuthError`) desenhadas para espelhar estruturas comuns de DTOs do Spring.
  - A migração exigirá apenas a substituição das funções de "mock" por chamadas reais `fetch` ou `axios` para os endpoints do Spring.

### Roteiro de Migração Sugerido:
1. **Configurar Backend Spring Boot**:
   - Criar Controller de Autenticação (`/api/auth/login`).
   - Implementar Segurança (JWT Token Provider).
2. **Conectar Frontend**:
   - Substituir `loginRequest` em `authService.ts` por uma chamada HTTP real.
   - Manter a lógica do Store intacta (o Store não precisa saber se os dados vêm de um mock ou de uma API real).

---

## ℹ️ Notas para Desenvolvedores

- **Firebase** is being used for Hosting and Storage. The project is deployed at [https://rpgprimeiroentrenos.web.app](https://rpgprimeiroentrenos.web.app).
- **Não remova o Firebase** sem alinhar a estratégia, mas mantenha o código limpo para receber o Java Spring no futuro.
- Ao editar serviços, tente manter as Tipagens (`interfaces`) estritas, pois isso facilitará a conexão com os DTOs do Java futuramente.

## 📁 Firebase Storage Rules (AI Context)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Qualquer um vê as imagens (bom para sites)
      allow read: if true;
      
      // Só quem está logado pode enviar/editar/deletar
      allow write: if request.auth != null;
    }
  }
}
```
