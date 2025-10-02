# 🚀 TODO - Web3 Talent Hub MVP (Hackathon 40h)

## 📋 OBJETIVO PRINCIPAL
Construir el **mejor hub de talentos Web3** comenzando con **creadores de contenido** como actor principal. MVP funcional en 40 horas para hackathon.

---

## 🎯 PRIORIDADES (P1 = Crítico, P2 = Importante, P3 = Deseable)

### **FASE 1: FUNDACIÓN Y ARQUITECTURA** ⚡ (Horas 1-8)

#### **P1 - Configuración del Proyecto**
- [ ] **Setup inicial Next.js 14** con TypeScript
  - Configurar estructura de carpetas (components, pages, lib, types)
  - Setup de Tailwind CSS para UI moderna
  - Configurar variables de entorno
- [ ] **Integración Stellar/Soroban**
  - Setup de Stellar SDK
  - Configurar conexión a testnet
  - Crear utilidades básicas de wallet
- [ ] **Base de datos y estado**
  - Setup de Prisma/Supabase para datos off-chain
  - Configurar Zustand/Redux para estado global
  - Definir schemas básicos

#### **P1 - Contratos Inteligentes Base**
- [ ] **Contrato de Usuarios**
  - Registro de creadores de contenido
  - Almacenar hash de perfil en blockchain
  - Funciones básicas de verificación
- [ ] **Contrato de Reputación**
  - Sistema básico de puntuación
  - Funciones para incrementar/decrementar reputación
  - Consulta de reputación por usuario

---

### **FASE 2: CORE FEATURES - CREADORES** 🎨 (Horas 9-20)

#### **P1 - Autenticación y Perfiles**
- [ ] **Sistema de Login Web3**
  - Conexión con Freighter/Albedo wallet
  - Autenticación por firma de mensaje
  - Manejo de sesiones
- [ ] **Perfil de Creador de Contenido**
  - Formulario de registro completo
  - Campos: nombre, bio, especialidades, portfolio links
  - Subida de avatar (IPFS)
  - Categorías: YouTube, TikTok, Instagram, Twitch, etc.

#### **P1 - Dashboard del Creador**
- [ ] **Panel principal**
  - Vista de estadísticas personales
  - Reputación actual y progreso
  - Notificaciones básicas
- [ ] **Gestión de Portfolio**
  - Agregar/editar trabajos anteriores
  - Links a contenido externo
  - Métricas de engagement (si disponible)

#### **P2 - Búsqueda y Descubrimiento**
- [ ] **Directorio de Creadores**
  - Lista paginada de todos los creadores
  - Filtros por categoría y especialidad
  - Ordenamiento por reputación
- [ ] **Perfil público**
  - Vista pública del perfil del creador
  - Mostrar portfolio y estadísticas
  - Botón de contacto/colaboración

---

### **FASE 3: SISTEMA DE REPUTACIÓN Y GAMIFICACIÓN** 🏆 (Horas 21-28)

#### **P1 - Sistema de Valoraciones**
- [ ] **Mecanismo de Rating**
  - Sistema de 5 estrellas
  - Comentarios opcionales
  - Solo usuarios verificados pueden valorar
- [ ] **Cálculo de Reputación**
  - Algoritmo ponderado (recencia, cantidad, calidad)
  - Actualización en tiempo real
  - Prevención de spam/manipulación

#### **P2 - Gamificación Básica**
- [ ] **Sistema de Insignias**
  - "Nuevo Talento" (primer registro)
  - "Confiable" (5+ valoraciones positivas)
  - "Top Creator" (top 10% reputación)
- [ ] **Niveles de Usuario**
  - Bronce, Plata, Oro, Platino
  - Beneficios por nivel (mayor visibilidad)
  - Progreso visual en perfil

#### **P3 - Recompensas**
- [ ] **Token de Reputación**
  - Token básico en Stellar
  - Distribución por buenas valoraciones
  - Uso futuro para premium features

---

### **FASE 4: INTERACCIONES Y COLABORACIONES** 🤝 (Horas 29-35)

#### **P1 - Sistema de Contacto**
- [ ] **Mensajería Básica**
  - Chat simple entre usuarios
  - Notificaciones de mensajes nuevos
  - Historial de conversaciones
- [ ] **Solicitudes de Colaboración**
  - Formulario estructurado para propuestas
  - Estado: pendiente, aceptada, rechazada
  - Detalles del proyecto y compensación

#### **P2 - Gestión de Proyectos**
- [ ] **Tablero de Colaboraciones**
  - Lista de proyectos activos
  - Estados: en negociación, en progreso, completado
  - Timeline básico
- [ ] **Sistema de Entregables**
  - Subida de archivos/links
  - Confirmación de recepción
  - Trigger para valoración

---

### **FASE 5: UI/UX Y PULIMIENTO** ✨ (Horas 36-40)

#### **P1 - Interfaz de Usuario**
- [ ] **Diseño Responsive**
  - Mobile-first approach
  - Componentes reutilizables
  - Tema oscuro/claro
- [ ] **Landing Page**
  - Hero section atractivo
  - Explicación clara del valor
  - Call-to-action prominente
- [ ] **Navegación Intuitiva**
  - Menú principal claro
  - Breadcrumbs donde sea necesario
  - Estados de carga y error

#### **P2 - Experiencia de Usuario**
- [ ] **Onboarding**
  - Tutorial interactivo para nuevos usuarios
  - Tooltips explicativos
  - Progreso de completado de perfil
- [ ] **Feedback Visual**
  - Animaciones suaves
  - Estados de éxito/error claros
  - Indicadores de progreso

#### **P3 - Optimización**
- [ ] **Performance**
  - Lazy loading de imágenes
  - Code splitting
  - Optimización de queries
- [ ] **SEO Básico**
  - Meta tags apropiados
  - URLs amigables
  - Schema markup

---

## 🔧 CONFIGURACIÓN TÉCNICA REQUERIDA

### **Dependencias Principales**
```json
{
  "stellar-sdk": "^11.x",
  "@stellar/freighter-api": "^1.x",
  "next": "^14.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "prisma": "^5.x",
  "zustand": "^4.x"
}
```

### **Variables de Entorno**
```env
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
IPFS_GATEWAY=...
```

---

## 📊 MÉTRICAS DE ÉXITO MVP

### **Funcionalidad Core**
- [ ] ✅ Usuario puede registrarse con wallet
- [ ] ✅ Usuario puede crear perfil completo
- [ ] ✅ Usuario puede buscar otros creadores
- [ ] ✅ Usuario puede valorar colaboraciones
- [ ] ✅ Sistema de reputación funcional

### **Experiencia de Usuario**
- [ ] ✅ Tiempo de carga < 3 segundos
- [ ] ✅ Responsive en móvil y desktop
- [ ] ✅ Flujo de onboarding < 5 minutos
- [ ] ✅ 0 errores críticos en funciones principales

### **Blockchain Integration**
- [ ] ✅ Conexión estable con Stellar testnet
- [ ] ✅ Transacciones de reputación funcionando
- [ ] ✅ Datos críticos almacenados on-chain

---

## 🚨 RIESGOS Y CONTINGENCIAS

### **Riesgos Técnicos**
- **Integración Stellar compleja** → Preparar fallback con simulación
- **Performance de queries** → Implementar caching básico
- **Wallet connection issues** → Múltiples opciones de wallet

### **Riesgos de Tiempo**
- **Scope creep** → Mantener focus en P1 features únicamente
- **Debugging extenso** → Timeboxing de 30min por bug
- **UI perfectionism** → Usar componentes pre-hechos (shadcn/ui)

---

## 📅 CRONOGRAMA DETALLADO

| Horas | Fase | Entregables |
|-------|------|-------------|
| 1-8   | Fundación | Proyecto configurado + contratos base |
| 9-20  | Core Features | Perfiles + autenticación + dashboard |
| 21-28 | Reputación | Sistema de valoraciones + gamificación |
| 29-35 | Colaboraciones | Mensajería + gestión de proyectos |
| 36-40 | Pulimiento | UI final + optimizaciones + testing |

---

## 🎯 POST-MVP (Futuras Iteraciones)

### **Expansión de Actores**
- Empresas buscando creadores
- Editores ofreciendo servicios
- Desarrolladores para proyectos Web3
- Artistas y músicos

### **Features Avanzadas**
- Sistema de disputas (inspirado en Kleros)
- Pagos automáticos con smart contracts
- NFTs como certificados de colaboración
- DAO para governance de la plataforma

---

**🔥 MANTRA DEL MVP: "Mejor hacer una cosa excelente que muchas cosas mediocres"**

**🎯 FOCUS: Creadores de contenido → Perfiles → Reputación → Colaboraciones**

