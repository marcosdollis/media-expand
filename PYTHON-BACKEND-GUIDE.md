# 🐍 Implementação Backend Python - MediaExpand

## 🎯 Stack Escolhida: Python FastAPI

### Por que FastAPI?
- ✅ Rápido e moderno
- ✅ Documentação automática (Swagger UI)
- ✅ Type hints nativos
- ✅ Fácil de testar
- ✅ Async/await support
- ✅ Menor que Flask, mais rápido que Django

---

## 📦 Estrutura do Projeto

```
media-expand/
├── frontend/                 # Seu projeto atual (GitHub Pages)
│   ├── landing-page-new.html
│   ├── formulario-anunciante.html
│   └── ...
│
└── backend/                  # Novo backend Python
    ├── app/
    │   ├── __init__.py
    │   ├── main.py          # Entry point da API
    │   ├── database.py      # Configuração do banco
    │   ├── models.py        # Modelos SQLAlchemy
    │   ├── schemas.py       # Pydantic schemas
    │   ├── crud.py          # Operações de banco
    │   └── routers/
    │       ├── __init__.py
    │       ├── anunciantes.py
    │       ├── segmentos.py
    │       └── metricas.py
    ├── migrations/          # Migrações do banco (Alembic)
    ├── tests/              # Testes unitários
    ├── .env                # Variáveis de ambiente
    ├── requirements.txt    # Dependências
    └── README.md
```

---

## 🚀 Setup Inicial (Passo a Passo)

### 1. Criar Ambiente Virtual

```bash
cd "c:\Users\Marcos\Documents\python projects\med\media-expand"
mkdir backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente (Windows)
.\venv\Scripts\activate

# Ou se estiver usando PowerShell
.\venv\Scripts\Activate.ps1
```

### 2. Instalar Dependências

```bash
pip install fastapi
pip install uvicorn[standard]
pip install sqlalchemy
pip install psycopg2-binary  # Para PostgreSQL
# OU
pip install aiosqlite  # Para SQLite (mais simples para começar)

pip install pydantic
pip install python-dotenv
pip install alembic  # Para migrações
pip install python-multipart  # Para forms
pip install email-validator  # Para validar emails
pip install bcrypt  # Para senhas
pip install python-jose[cryptography]  # Para JWT
pip install passlib

# Gerar requirements.txt
pip freeze > requirements.txt
```

---

## 💻 Código Base

### `backend/app/main.py` - Entry Point

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import anunciantes, segmentos, metricas
from app.database import engine, Base

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediaExpand API",
    description="API para gerenciamento de anunciantes e rede de mídia",
    version="1.0.0"
)

# Configurar CORS para aceitar requisições do GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://marcosdollis.github.io",
        "http://localhost:5500",  # Para desenvolvimento local
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(anunciantes.router, prefix="/api/anunciantes", tags=["Anunciantes"])
app.include_router(segmentos.router, prefix="/api/segmentos", tags=["Segmentos"])
app.include_router(metricas.router, prefix="/api/metricas", tags=["Métricas"])

@app.get("/")
def read_root():
    return {
        "message": "MediaExpand API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### `backend/app/database.py` - Configuração do Banco

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Opção 1: SQLite (para começar - mais simples)
SQLALCHEMY_DATABASE_URL = "sqlite:///./mediaexpand.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Opção 2: PostgreSQL (para produção)
# DATABASE_URL = os.getenv("DATABASE_URL")
# engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency para usar nas rotas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### `backend/app/models.py` - Modelos do Banco

```python
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Anunciante(Base):
    __tablename__ = "anunciantes"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Dados do Estabelecimento
    business_name = Column(String(255), nullable=False)
    owner_name = Column(String(255), nullable=False)
    business_type = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    address = Column(Text, nullable=False)
    
    # Público e Movimento
    daily_traffic = Column(String(50), nullable=False)
    peak_hours = Column(String(100), nullable=False)
    operating_days = Column(String(50), nullable=False)
    
    # Infraestrutura
    has_tv = Column(Boolean, nullable=False)
    tv_brand = Column(String(100))
    tv_size = Column(String(20))
    is_smart_tv = Column(String(20))
    needs_firestick = Column(Boolean)
    has_wifi = Column(Boolean, nullable=False)
    
    # Status e Segmento
    status = Column(String(50), default="pending")  # pending, approved, active, inactive
    segment_reserved = Column(String(100))
    
    # Observações
    additional_info = Column(Text)
    admin_notes = Column(Text)
    
    # Relacionamentos
    locations = relationship("LocalExibicao", back_populates="anunciante")
    metrics = relationship("Metrica", back_populates="anunciante")


class Segmento(Base):
    __tablename__ = "segmentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), unique=True, nullable=False, index=True)
    disponivel = Column(Boolean, default=True)
    anunciante_id = Column(Integer, ForeignKey("anunciantes.id"), nullable=True)
    data_reserva = Column(DateTime(timezone=True))


class LocalExibicao(Base):
    __tablename__ = "locais_exibicao"

    id = Column(Integer, primary_key=True, index=True)
    anunciante_id = Column(Integer, ForeignKey("anunciantes.id"), nullable=False)
    nome_local = Column(String(255), nullable=False)
    endereco = Column(Text, nullable=False)
    tipo_local = Column(String(100))
    horario_funcionamento = Column(String(100))
    movimento_estimado = Column(Integer)
    status = Column(String(50), default="active")
    data_inicio = Column(DateTime(timezone=True))
    data_fim = Column(DateTime(timezone=True))
    
    # Relacionamentos
    anunciante = relationship("Anunciante", back_populates="locations")
    metrics = relationship("Metrica", back_populates="local")


class Metrica(Base):
    __tablename__ = "metricas"

    id = Column(Integer, primary_key=True, index=True)
    anunciante_id = Column(Integer, ForeignKey("anunciantes.id"), nullable=False)
    local_id = Column(Integer, ForeignKey("locais_exibicao.id"), nullable=False)
    data = Column(DateTime(timezone=True), nullable=False)
    
    # Métricas
    visualizacoes = Column(Integer, default=0)
    tempo_exibicao = Column(Integer, default=0)  # em minutos
    publico_impactado = Column(Integer, default=0)
    interacoes = Column(Integer, default=0)
    qr_code_scans = Column(Integer, default=0)
    
    # Relacionamentos
    anunciante = relationship("Anunciante", back_populates="metrics")
    local = relationship("LocalExibicao", back_populates="metrics")
```

### `backend/app/schemas.py` - Pydantic Schemas

```python
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Schemas para Anunciante
class AnuncianteBase(BaseModel):
    business_name: str
    owner_name: str
    business_type: str
    phone: str
    email: EmailStr
    address: str
    daily_traffic: str
    peak_hours: str
    operating_days: str
    has_tv: bool
    tv_brand: Optional[str] = None
    tv_size: Optional[str] = None
    is_smart_tv: Optional[str] = None
    needs_firestick: Optional[bool] = None
    has_wifi: bool
    additional_info: Optional[str] = None

class AnuncianteCreate(AnuncianteBase):
    pass

class AnuncianteUpdate(BaseModel):
    status: Optional[str] = None
    segment_reserved: Optional[str] = None
    admin_notes: Optional[str] = None

class AnuncianteResponse(AnuncianteBase):
    id: int
    created_at: datetime
    status: str
    segment_reserved: Optional[str] = None
    
    class Config:
        from_attributes = True

# Schemas para Segmento
class SegmentoBase(BaseModel):
    nome: str
    disponivel: bool = True

class SegmentoCreate(SegmentoBase):
    pass

class SegmentoResponse(SegmentoBase):
    id: int
    anunciante_id: Optional[int] = None
    data_reserva: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schemas para Local de Exibição
class LocalExibicaoBase(BaseModel):
    nome_local: str
    endereco: str
    tipo_local: str
    horario_funcionamento: str
    movimento_estimado: int

class LocalExibicaoCreate(LocalExibicaoBase):
    anunciante_id: int

class LocalExibicaoResponse(LocalExibicaoBase):
    id: int
    anunciante_id: int
    status: str
    data_inicio: Optional[datetime] = None
    
    class Config:
        from_attributes = True
```

### `backend/app/routers/anunciantes.py` - Rotas de Anunciantes

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.AnuncianteResponse, status_code=status.HTTP_201_CREATED)
def criar_anunciante(
    anunciante: schemas.AnuncianteCreate,
    db: Session = Depends(get_db)
):
    """
    Criar novo anunciante (substitui FormSubmit)
    """
    # Verificar se email já existe
    db_anunciante = db.query(models.Anunciante).filter(
        models.Anunciante.email == anunciante.email
    ).first()
    
    if db_anunciante:
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado"
        )
    
    # Criar novo anunciante
    db_anunciante = models.Anunciante(**anunciante.dict())
    db.add(db_anunciante)
    db.commit()
    db.refresh(db_anunciante)
    
    # TODO: Enviar email de confirmação
    
    return db_anunciante

@router.get("/", response_model=List[schemas.AnuncianteResponse])
def listar_anunciantes(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db)
):
    """
    Listar todos os anunciantes (para dashboard admin)
    """
    query = db.query(models.Anunciante)
    
    if status:
        query = query.filter(models.Anunciante.status == status)
    
    anunciantes = query.offset(skip).limit(limit).all()
    return anunciantes

@router.get("/{anunciante_id}", response_model=schemas.AnuncianteResponse)
def obter_anunciante(
    anunciante_id: int,
    db: Session = Depends(get_db)
):
    """
    Obter detalhes de um anunciante específico
    """
    anunciante = db.query(models.Anunciante).filter(
        models.Anunciante.id == anunciante_id
    ).first()
    
    if not anunciante:
        raise HTTPException(status_code=404, detail="Anunciante não encontrado")
    
    return anunciante

@router.patch("/{anunciante_id}", response_model=schemas.AnuncianteResponse)
def atualizar_anunciante(
    anunciante_id: int,
    anunciante_update: schemas.AnuncianteUpdate,
    db: Session = Depends(get_db)
):
    """
    Atualizar status ou informações administrativas
    """
    db_anunciante = db.query(models.Anunciante).filter(
        models.Anunciante.id == anunciante_id
    ).first()
    
    if not db_anunciante:
        raise HTTPException(status_code=404, detail="Anunciante não encontrado")
    
    update_data = anunciante_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_anunciante, key, value)
    
    db.commit()
    db.refresh(db_anunciante)
    
    return db_anunciante

@router.delete("/{anunciante_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_anunciante(
    anunciante_id: int,
    db: Session = Depends(get_db)
):
    """
    Deletar um anunciante
    """
    db_anunciante = db.query(models.Anunciante).filter(
        models.Anunciante.id == anunciante_id
    ).first()
    
    if not db_anunciante:
        raise HTTPException(status_code=404, detail="Anunciante não encontrado")
    
    db.delete(db_anunciante)
    db.commit()
    
    return None
```

### `backend/app/routers/segmentos.py` - Rotas de Segmentos

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter()

@router.get("/disponibilidade")
def verificar_disponibilidade(db: Session = Depends(get_db)):
    """
    Verificar quais segmentos estão disponíveis
    """
    segmentos = db.query(models.Segmento).all()
    
    disponiveis = [s.nome for s in segmentos if s.disponivel]
    reservados = [s.nome for s in segmentos if not s.disponivel]
    
    return {
        "disponiveis": disponiveis,
        "reservados": reservados,
        "total_disponiveis": len(disponiveis),
        "total_reservados": len(reservados)
    }

@router.post("/reservar/{segmento_nome}")
def reservar_segmento(
    segmento_nome: str,
    anunciante_id: int,
    db: Session = Depends(get_db)
):
    """
    Reservar um segmento para um anunciante
    """
    segmento = db.query(models.Segmento).filter(
        models.Segmento.nome == segmento_nome
    ).first()
    
    if not segmento:
        raise HTTPException(status_code=404, detail="Segmento não encontrado")
    
    if not segmento.disponivel:
        raise HTTPException(status_code=400, detail="Segmento já está reservado")
    
    segmento.disponivel = False
    segmento.anunciante_id = anunciante_id
    from datetime import datetime
    segmento.data_reserva = datetime.now()
    
    # Atualizar anunciante
    anunciante = db.query(models.Anunciante).filter(
        models.Anunciante.id == anunciante_id
    ).first()
    anunciante.segment_reserved = segmento_nome
    
    db.commit()
    
    return {"message": f"Segmento '{segmento_nome}' reservado com sucesso"}
```

---

## 🌐 Atualizar Frontend (formulario-anunciante.html)

```javascript
// Substituir o FormSubmit por chamada à API
document.getElementById('advertiserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Coletar dados do formulário
    const formData = new FormData(e.target);
    const data = {
        business_name: formData.get('businessName'),
        owner_name: formData.get('ownerName'),
        business_type: formData.get('businessType'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        daily_traffic: formData.get('dailyTraffic'),
        peak_hours: formData.get('peakHours'),
        operating_days: formData.get('operatingDays'),
        has_tv: formData.get('hasTV') === 'sim',
        tv_brand: formData.get('tvBrand') || null,
        tv_size: formData.get('tvSize') || null,
        is_smart_tv: formData.get('isSmartTV') || null,
        needs_firestick: formData.get('needsFireStick') === 'sim',
        has_wifi: formData.get('hasWiFi') === 'sim',
        additional_info: formData.get('additionalInfo') || null
    };
    
    try {
        const response = await fetch('https://sua-api.com/api/anunciantes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            window.location.href = 'pagina-de-agradecimento.html';
        } else {
            const error = await response.json();
            alert('Erro ao enviar cadastro: ' + error.detail);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Cadastro';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar cadastro. Tente novamente.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Cadastro';
    }
});
```

---

## 🚀 Rodar Localmente

```bash
cd backend

# Ativar ambiente virtual
.\venv\Scripts\activate

# Rodar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Acessar documentação automática
# http://localhost:8000/docs
```

---

## 🌍 Deploy em Produção

### Opção 1: Railway (Recomendado - Fácil)
```bash
# 1. Criar conta em railway.app
# 2. Instalar Railway CLI
# 3. Deploy
railway login
railway init
railway up
```

### Opção 2: Render (Gratuito)
```bash
# 1. Criar conta em render.com
# 2. Conectar repositório GitHub
# 3. Configurar:
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Opção 3: Heroku
```bash
# Criar Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
heroku create mediaexpand-api
git push heroku main
```

---

## 📊 Próximos Passos

1. ✅ Configurar ambiente Python
2. ✅ Criar estrutura do projeto
3. ✅ Implementar modelos e rotas
4. ⬜ Adicionar autenticação JWT
5. ⬜ Criar dashboard administrativo
6. ⬜ Implementar envio de emails
7. ⬜ Adicionar testes unitários
8. ⬜ Deploy em produção

---

**Pronto para começar!** 🚀
