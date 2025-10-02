# 🆓 Hospedagem Gratuita: Python + PostgreSQL

## 🏆 Melhores Opções Gratuitas (2025)

---

## 1️⃣ **Render.com** ⭐ RECOMENDADO

### ✅ Prós:
- **100% Gratuito** para começar
- PostgreSQL gratuito incluído (90 dias, depois pode renovar)
- Deploy automático do GitHub
- SSL grátis
- Fácil de usar
- Logs em tempo real

### ❌ Contras:
- Servidor "hiberna" após 15 min sem uso (demora ~30s para acordar)
- 750h/mês de servidor (suficiente para 1 app rodando 24/7)

### 📊 Free Tier:
- **API:** 750h/mês
- **PostgreSQL:** 1GB de armazenamento (expira em 90 dias, mas pode criar novo)
- **Bandwidth:** 100GB/mês
- **Build minutes:** Ilimitado

### 🚀 Como Usar:

1. **Criar conta:** https://render.com
2. **Conectar GitHub**
3. **Criar PostgreSQL:**
   - New → PostgreSQL
   - Name: `mediaexpand-db`
   - Free plan
   - Copiar Internal Database URL

4. **Criar Web Service:**
   - New → Web Service
   - Conectar repositório
   - Configurações:
     ```
     Name: mediaexpand-api
     Runtime: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

5. **Adicionar Environment Variables:**
   ```
   DATABASE_URL=postgresql://...  (copiar do banco)
   PYTHON_VERSION=3.11
   ```

6. **Deploy!** 🎉

### 📝 Arquivos Necessários:

**requirements.txt:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
alembic==1.13.0
python-multipart==0.0.6
email-validator==2.1.0
```

---

## 2️⃣ **Railway.app** ⭐⭐

### ✅ Prós:
- **$5 de crédito grátis/mês** (sem cartão de crédito)
- PostgreSQL incluído
- Deploy super fácil
- Não hiberna
- Melhor performance

### ❌ Contras:
- Precisa gerenciar créditos ($5/mês é suficiente para projetos pequenos)
- Depois de gastar os $5, precisa pagar

### 📊 Free Trial:
- **$5 de crédito/mês**
- PostgreSQL, Redis, etc. inclusos
- 500GB de bandwidth

### 🚀 Como Usar:

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Iniciar projeto
railway init

# 4. Adicionar PostgreSQL
railway add --database postgres

# 5. Deploy
railway up
```

### 💰 Estimativa de Gasto:
- **API Python:** ~$3-4/mês
- **PostgreSQL:** ~$1-2/mês
- **Total:** Cabe nos $5 grátis! 🎉

---

## 3️⃣ **Fly.io** ⭐⭐⭐

### ✅ Prós:
- Free tier generoso
- PostgreSQL grátis (3GB)
- Não hiberna
- Rápido
- Suporte global (múltiplas regiões)

### ❌ Contras:
- Precisa de cartão de crédito (mas não cobra se ficar no free tier)
- CLI um pouco mais complexo

### 📊 Free Tier:
- **3 VMs compartilhadas** (256MB RAM cada)
- **PostgreSQL:** 3GB de armazenamento
- **160GB bandwidth/mês**
- **Sem hibernação**

### 🚀 Como Usar:

```bash
# 1. Instalar Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 2. Login
flyctl auth login

# 3. Launch (no diretório do backend)
flyctl launch

# 4. Adicionar PostgreSQL
flyctl postgres create

# 5. Conectar ao app
flyctl postgres attach <postgres-app-name>
```

---

## 4️⃣ **PythonAnywhere** 

### ✅ Prós:
- Focado em Python
- Simples de configurar
- Boa documentação

### ❌ Contras:
- **Não tem PostgreSQL grátis** (só MySQL)
- Performance limitada
- Precisa adaptar código para MySQL

### 📊 Free Tier:
- **API Python:** 1 app web
- **MySQL:** 512MB (não PostgreSQL!)
- **Bandwidth:** Limitado

### ⚠️ **Não recomendado para seu caso** (você quer PostgreSQL)

---

## 5️⃣ **Supabase** (Database Only)

### ✅ Prós:
- **PostgreSQL gratuito e generoso**
- 500MB de armazenamento
- Interface administrativa linda
- API REST automática
- Não expira

### Usar com:
- **Render/Railway/Fly** para a API
- **Supabase** só para o banco de dados

### 📊 Free Tier:
- **PostgreSQL:** 500MB
- **API requests:** Ilimitado
- **Auth users:** 50.000
- **Storage:** 1GB

### 🚀 Combinação Perfeita:

```
Render (API Python - Grátis)
    ↓
Supabase (PostgreSQL - Grátis)
```

### Como Conectar:
1. Criar projeto no Supabase
2. Copiar connection string
3. Usar no Render como `DATABASE_URL`

---

## 📊 Comparação Rápida

| Serviço | API Python | PostgreSQL | Hibernação | Precisa Cartão? |
|---------|-----------|------------|------------|----------------|
| **Render** | ✅ Grátis | ✅ 90 dias | ⚠️ Sim (15min) | ❌ Não |
| **Railway** | 💰 $5/mês | ✅ Incluído | ❌ Não | ❌ Não |
| **Fly.io** | ✅ Grátis | ✅ 3GB | ❌ Não | ⚠️ Sim |
| **Render + Supabase** | ✅ Grátis | ✅ 500MB | ⚠️ Sim | ❌ Não |

---

## 🏆 Minha Recomendação para Você

### **Opção 1: Render.com (Mais Simples)**
```
✅ 100% gratuito
✅ Sem cartão de crédito
✅ PostgreSQL incluído (90 dias, renova grátis)
⚠️ Hiberna após 15min (não é problema para projeto inicial)
```

### **Opção 2: Render (API) + Supabase (DB)**
```
✅ 100% gratuito
✅ PostgreSQL permanente
✅ Supabase tem interface admin linda
✅ 500MB de armazenamento
⚠️ API hiberna após 15min
```

### **Opção 3: Railway (Melhor Performance)**
```
✅ $5 grátis/mês (suficiente!)
✅ Não hiberna
✅ Mais rápido que Render
⚠️ Precisa monitorar créditos
```

---

## 🎯 Passo a Passo: Setup Render + Supabase (RECOMENDADO)

### 1. Criar Database no Supabase (Grátis Permanente)

```bash
# 1. Acessar: https://supabase.com
# 2. Criar conta (GitHub login)
# 3. New Project:
#    - Name: mediaexpand
#    - Database Password: (criar senha forte)
#    - Region: South America (São Paulo)
# 4. Aguardar criação (~2min)
# 5. Settings → Database → Connection String
#    Copiar: postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 2. Deploy API no Render

```bash
# 1. Acessar: https://render.com
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Configurar:
Name: mediaexpand-api
Runtime: Python 3
Branch: main
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

# 5. Environment Variables:
DATABASE_URL = (colar string do Supabase)
PYTHON_VERSION = 3.11

# 6. Deploy!
```

### 3. Testar

```bash
# API vai estar em:
https://mediaexpand-api.onrender.com

# Testar:
https://mediaexpand-api.onrender.com/health
https://mediaexpand-api.onrender.com/docs
```

---

## ⚡ Solução para Hibernação do Render

### Problema:
API hiberna após 15min → Primeiro request demora ~30s

### Solução 1: Cron Job Grátis
```bash
# Usar cron-job.org para fazer ping a cada 14min
# 1. Criar conta em cron-job.org
# 2. New Cronjob:
#    URL: https://mediaexpand-api.onrender.com/health
#    Interval: Every 14 minutes
```

### Solução 2: GitHub Actions (Grátis)
```yaml
# .github/workflows/keep-alive.yml
name: Keep API Alive
on:
  schedule:
    - cron: '*/14 * * * *'  # A cada 14 minutos
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping API
        run: curl https://mediaexpand-api.onrender.com/health
```

### Solução 3: Usar Railway 😉
Não hiberna, mas gasta os $5/mês

---

## 💡 Dica Final

**Para começar:**
1. Use **Render + Supabase** (100% grátis)
2. Se crescer muito e hibernação incomodar, migre para **Railway**
3. Se crescer MUITO, migre para **AWS/Google Cloud** (mas isso é problema bom!)

---

## 🔗 Links Úteis

- **Render:** https://render.com
- **Railway:** https://railway.app
- **Fly.io:** https://fly.io
- **Supabase:** https://supabase.com
- **Cron-job.org:** https://cron-job.org

---

**Pronto para hospedar grátis!** 🚀
