# 🚀 Roadmap para Implementação de Backend - MediaExpand

## 📋 Situação Atual
- ✅ Frontend funcionando com GitHub Pages
- ✅ Formulários enviando para email via FormSubmit
- ❌ Sem banco de dados
- ❌ Sem backend para processar dados

---

## 🎯 Objetivos Futuros
1. Armazenar cadastros de anunciantes em banco de dados
2. Dashboard administrativo para gerenciar anunciantes
3. API para consultar disponibilidade de segmentos
4. Sistema de autenticação para anunciantes
5. Geração automática de relatórios

---

## 💡 Opções de Implementação

### **Opção 1: Backend Simples - Vercel + Supabase (RECOMENDADO)**
**Custo:** Gratuito até 500MB de dados
**Complexidade:** ⭐⭐ (Baixa)
**Tempo estimado:** 2-3 dias

#### Stack:
- **Frontend:** Continua no GitHub Pages
- **Backend:** Vercel Serverless Functions (Node.js)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth

#### Vantagens:
- ✅ Gratuito para começar
- ✅ Fácil de implementar
- ✅ Escalável
- ✅ Interface administrativa built-in do Supabase
- ✅ Sem servidor para gerenciar

#### Como Implementar:
```bash
# 1. Criar projeto no Supabase (https://supabase.com)
# 2. Criar tabela de anunciantes
# 3. Criar Vercel Functions para receber dados
# 4. Atualizar formulário para enviar para API
```

---

### **Opção 2: Backend Completo - Python Flask/FastAPI**
**Custo:** $5-10/mês (servidor)
**Complexidade:** ⭐⭐⭐ (Média)
**Tempo estimado:** 1 semana

#### Stack:
- **Frontend:** GitHub Pages
- **Backend:** Python (Flask ou FastAPI)
- **Banco de Dados:** PostgreSQL ou MongoDB
- **Hospedagem:** Railway, Render ou Heroku

#### Vantagens:
- ✅ Controle total do backend
- ✅ Você já conhece Python
- ✅ Fácil integração com análise de dados
- ✅ Pode adicionar ML/AI futuramente

---

### **Opção 3: Solução No-Code - Airtable + Zapier**
**Custo:** $20/mês
**Complexidade:** ⭐ (Muito Baixa)
**Tempo estimado:** 1 dia

#### Stack:
- **Frontend:** GitHub Pages
- **Backend:** Zapier (automações)
- **Banco de Dados:** Airtable (visual)

#### Vantagens:
- ✅ Implementação rápida
- ✅ Interface visual bonita
- ✅ Não precisa programar backend
- ❌ Limitado em customizações

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `anunciantes`
```sql
CREATE TABLE anunciantes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Dados do Estabelecimento
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    
    -- Público e Movimento
    daily_traffic VARCHAR(50) NOT NULL,
    peak_hours VARCHAR(100) NOT NULL,
    operating_days VARCHAR(50) NOT NULL,
    
    -- Infraestrutura
    has_tv BOOLEAN NOT NULL,
    tv_brand VARCHAR(100),
    tv_size VARCHAR(20),
    is_smart_tv VARCHAR(20),
    needs_firestick BOOLEAN,
    has_wifi BOOLEAN NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, active, inactive
    segment_reserved VARCHAR(100),
    
    -- Observações
    additional_info TEXT,
    admin_notes TEXT
);
```

### Tabela: `segmentos`
```sql
CREATE TABLE segmentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    anunciante_id INTEGER REFERENCES anunciantes(id),
    data_reserva TIMESTAMP
);
```

### Tabela: `locais_exibicao`
```sql
CREATE TABLE locais_exibicao (
    id SERIAL PRIMARY KEY,
    anunciante_id INTEGER REFERENCES anunciantes(id),
    nome_local VARCHAR(255) NOT NULL,
    endereco TEXT NOT NULL,
    tipo_local VARCHAR(100), -- restaurante, lavanderia, etc
    horario_funcionamento VARCHAR(100),
    movimento_estimado INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    data_inicio DATE,
    data_fim DATE
);
```

### Tabela: `metricas`
```sql
CREATE TABLE metricas (
    id SERIAL PRIMARY KEY,
    anunciante_id INTEGER REFERENCES anunciantes(id),
    local_id INTEGER REFERENCES locais_exibicao(id),
    data DATE NOT NULL,
    
    -- Métricas
    visualizacoes INTEGER DEFAULT 0,
    tempo_exibicao INTEGER DEFAULT 0, -- em minutos
    publico_impactado INTEGER DEFAULT 0,
    
    -- Engagement (se aplicável)
    interacoes INTEGER DEFAULT 0,
    qr_code_scans INTEGER DEFAULT 0
);
```

---

## 🔧 Exemplo de API Endpoints

### **POST /api/anunciantes**
Cadastrar novo anunciante
```json
{
  "businessName": "Restaurante do Chef",
  "ownerName": "João Silva",
  "businessType": "Restaurante",
  "phone": "(55) 99999-9999",
  "email": "joao@restaurante.com",
  ...
}
```

### **GET /api/segmentos/disponibilidade**
Verificar segmentos disponíveis
```json
{
  "disponiveis": ["Pet Shop", "Imobiliária", "Farmácia"],
  "reservados": ["Restaurante", "Academia", "Lavanderia"]
}
```

### **GET /api/dashboard/:anuncianteId**
Obter métricas do anunciante
```json
{
  "visualizacoes": 7680,
  "publicoImpactado": 5500,
  "tempoExibicao": "32h",
  "locaisAtivos": 3
}
```

---

## 📊 Dashboard Administrativo

### Funcionalidades:
1. **Lista de Anunciantes**
   - Status: Pendente, Aprovado, Ativo, Inativo
   - Filtros por segmento, data, status
   - Exportar para CSV/Excel

2. **Gestão de Segmentos**
   - Ver segmentos disponíveis/ocupados
   - Reservar/liberar segmentos
   - Histórico de reservas

3. **Gestão de Locais**
   - Adicionar/editar locais de exibição
   - Mapear anunciantes por local
   - Métricas por local

4. **Relatórios**
   - Crescimento da rede (gráficos)
   - ROI por anunciante
   - Ocupação de segmentos
   - Previsão de expansão

---

## 🔐 Autenticação

### Níveis de Acesso:
1. **Admin** - Acesso total ao sistema
2. **Anunciante** - Ver apenas suas próprias métricas
3. **Operador** - Gerenciar locais e métricas

---

## 📱 Integração com Formulário Atual

### Mudança Necessária:
```javascript
// ANTES (FormSubmit)
<form method="POST" action="https://formsubmit.co/email@email.com">

// DEPOIS (API)
<form id="advertiserForm">
  <script>
    document.getElementById('advertiserForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      const response = await fetch('https://sua-api.vercel.app/api/anunciantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        window.location.href = 'pagina-de-agradecimento.html';
      }
    });
  </script>
</form>
```

---

## 🚀 Plano de Migração (Quando Implementar)

### Fase 1: Setup Básico (1-2 dias)
- [ ] Criar conta no Supabase
- [ ] Criar tabelas no banco de dados
- [ ] Configurar Vercel Functions
- [ ] Testar envio de dados

### Fase 2: Integração Frontend (1 dia)
- [ ] Atualizar formulário para usar API
- [ ] Adicionar loading states
- [ ] Tratamento de erros
- [ ] Validações no frontend

### Fase 3: Dashboard Admin (2-3 dias)
- [ ] Criar página de login
- [ ] Lista de anunciantes
- [ ] Gestão de segmentos
- [ ] Métricas básicas

### Fase 4: Features Avançadas (1 semana)
- [ ] Dashboard para anunciantes
- [ ] Relatórios automatizados
- [ ] Sistema de notificações
- [ ] Exportação de dados

---

## 💰 Estimativa de Custos

### Opção Gratuita (Supabase + Vercel):
- Supabase Free: 500MB DB, 2GB bandwidth
- Vercel Free: 100GB bandwidth, serverless functions
- **Total: R$ 0/mês** (até crescer muito)

### Opção Paga (quando escalar):
- Supabase Pro: $25/mês
- Vercel Pro: $20/mês
- **Total: ~R$ 230/mês**

---

## 📚 Recursos para Aprender

### Supabase:
- Docs: https://supabase.com/docs
- Tutorial: https://supabase.com/docs/guides/getting-started

### Vercel Functions:
- Docs: https://vercel.com/docs/functions
- Examples: https://github.com/vercel/examples

### FastAPI (Python):
- Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

---

## 🎯 Próximos Passos (Quando Decidir Implementar)

1. Escolher a opção de backend (Recomendo Opção 1)
2. Criar conta no Supabase
3. Configurar tabelas do banco
4. Criar API endpoints no Vercel
5. Testar com dados de exemplo
6. Migrar formulário para usar API
7. Desenvolver dashboard administrativo

---

## 📝 Notas

- **Mantenha FormSubmit como backup** até o backend estar 100% testado
- **Implemente em ambiente de teste primeiro** (branch separado)
- **Documente todas as APIs** para facilitar manutenção
- **Configure backups automáticos** do banco de dados
- **Monitore custos** quando começar a escalar

---

**Última atualização:** Outubro 2025
**Status:** Planejamento - Não implementado ainda
