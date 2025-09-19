# EPIC 12: Scaffolding del Frontend y Vistas Públicas

## 1.0 Configuración Inicial del Frontend (React)

- [x] 1.1 Inicializar el proyecto con Vite y la plantilla de React + TypeScript.
- [x] 1.2 Instalar dependencias principales:
  - [x] 1.2.1 `react-router-dom` (navegación)
  - [x] 1.2.2 `@tanstack/react-query` (data fetching y caching)
  - [x] 1.2.3 `axios` (cliente HTTP)
  - [x] 1.2.4 `zustand` (state management)
  - [x] 1.2.5 `react-hook-form` + `@hookform/resolvers` (formularios)
  - [x] 1.2.6 `zod` (validación de esquemas)
  - [x] 1.2.7 `tailwindcss` (estilos)
  - [x] 1.2.8 `shadcn/ui` (componentes UI)
  - [x] 1.2.9 `react-hot-toast` (notificaciones)
  - [x] 1.2.10 `lucide-react` (iconos)
- [x] 1.3 Configurar la estructura de carpetas optimizada:
  ```
  src/
  ├── components/ui/     # shadcn/ui components
  ├── components/       # Custom components
  ├── pages/           # Route components
  ├── hooks/           # Custom hooks
  ├── services/        # API layer
  ├── stores/          # Zustand stores
  ├── types/           # TypeScript types
  ├── utils/           # Helper functions
  ├── lib/             # Configuration (axios, react-query)
  └── assets/          # Static assets
  ```
- [x] 1.4 Configurar variables de entorno para diferentes ambientes (dev/prod).
- [x] 1.5 Configurar una instancia de `axios` pre-configurada con interceptores para JWT.
- [x] 1.6 Configurar TanStack Query con configuración de cache y error handling.
- [x] 1.7 Configurar Tailwind CSS y shadcn/ui theme system.

---

## 2.0 Configuración de Infraestructura y Estado Global

- [ ] 2.1 Crear store de autenticación con Zustand:
  - [ ] 2.1.1 Estado de usuario, token, y funciones de login/logout
  - [ ] 2.1.2 Persistencia en localStorage
  - [ ] 2.1.3 Auto-refresh de token
- [ ] 2.2 Crear servicio de API con tipos TypeScript:
  - [ ] 2.2.1 Definir tipos basados en `FRONTEND_API_DOCUMENTATION.md`
  - [ ] 2.2.2 Funciones de autenticación
  - [ ] 2.2.3 Funciones de providers y reviews
- [ ] 2.3 Configurar error boundaries y manejo global de errores.
- [ ] 2.4 Configurar sistema de notificaciones (toast) global.

---

## 3.0 Creación de Componentes Reutilizables de UI

- [ ] 3.1 Componentes de layout:
  - [ ] 3.1.1 `Header` con navegación responsiva y estado de autenticación
  - [ ] 3.1.2 `Footer` con información de contacto y enlaces legales
  - [ ] 3.1.3 `Layout` principal con Header/Footer
- [ ] 3.2 Componentes de providers:
  - [ ] 3.2.1 `ProviderCard` con rating, servicios, y estado de disponibilidad
  - [ ] 3.2.2 `ProviderGrid` para listados con lazy loading
  - [ ] 3.2.3 `ProviderSkeleton` para estados de carga
- [ ] 3.3 Componentes de búsqueda y filtros:
  - [ ] 3.3.1 `SearchBar` con autocomplete y validación
  - [ ] 3.3.2 `FilterPanel` para servicios, ubicación, rating, etc.
  - [ ] 3.3.3 `SortSelector` para ordenamiento de resultados
- [ ] 3.4 Componentes de UI generales:
  - [ ] 3.4.1 `LoadingSpinner` y estados de carga
  - [ ] 3.4.2 `ErrorMessage` para manejo de errores
  - [ ] 3.4.3 `Pagination` reutilizable
  - [ ] 3.4.4 `Rating` component para mostrar/editar calificaciones

---

## 4.0 Implementación de Vistas Públicas

- [ ] 4.1 **Página Principal (`/`)**:
  - [ ] 4.1.1 Hero section con `SearchBar` prominente
  - [ ] 4.1.2 Sección de servicios populares
  - [ ] 4.1.3 Listado de proveedores destacados (rating alto)
  - [ ] 4.1.4 Testimonios/reseñas destacadas
  - [ ] 4.1.5 Sección "Cómo funciona" explicativa
  - [ ] 4.1.6 Optimización SEO (meta tags, structured data)
- [ ] 4.2 **Página de Resultados de Búsqueda (`/providers`):**
  - [ ] 4.2.1 `FilterPanel` lateral con filtros activos visibles
  - [ ] 4.2.2 Grilla responsiva de `ProviderCard` con infinite scroll
  - [ ] 4.2.3 Ordenamiento por relevancia, rating, fecha
  - [ ] 4.2.4 Estado "sin resultados" con sugerencias
  - [ ] 4.2.5 Persistencia de filtros en URL para compartir búsquedas
- [ ] 4.3 **Página de Detalle del Proveedor (`/providers/:id`):**
  - [ ] 4.3.1 Header con información principal y botón de contacto
  - [ ] 4.3.2 Galería de portfolio con lightbox
  - [ ] 4.3.3 Sección de reseñas con filtros y paginación
  - [ ] 4.3.4 Mapa de ubicación (si disponible)
  - [ ] 4.3.5 Botón para escribir reseña (autenticación requerida)
  - [ ] 4.3.6 SEO optimizado por proveedor

---

## 5.0 Sistema de Autenticación

- [ ] 5.1 **Páginas de autenticación:**
  - [ ] 5.1.1 Página de login (`/login`) con formulario validado
  - [ ] 5.1.2 Página de registro (`/register`) con selección de rol
  - [ ] 5.1.3 Página de recuperación de contraseña (si implementada en backend)
- [ ] 5.2 **Protección de rutas:**
  - [ ] 5.2.1 HOC o hook para rutas protegidas
  - [ ] 5.2.2 Redirects automáticos según estado de autenticación
  - [ ] 5.2.3 Manejo de roles y permisos
- [ ] 5.3 **Estados de autenticación:**
  - [ ] 5.3.1 Loading states durante login/registro
  - [ ] 5.3.2 Manejo de errores de autenticación
  - [ ] 5.3.3 Auto-logout en caso de token expirado

---

## 6.0 Configuración de Navegación y Routing

- [ ] 6.1 Configurar `react-router-dom` con rutas optimizadas:
  - [ ] 6.1.1 Rutas públicas: `/`, `/providers`, `/providers/:id`, `/login`, `/register`
  - [ ] 6.1.2 Rutas protegidas: dashboard según rol de usuario
  - [ ] 6.1.3 Rutas de error: 404, 500
- [ ] 6.2 Implementar navegación avanzada:
  - [ ] 6.2.1 Breadcrumbs para navegación contextual
  - [ ] 6.2.2 Persistencia de estado en navegación
  - [ ] 6.2.3 Preloading de rutas críticas
- [ ] 6.3 Optimización de URLs:
  - [ ] 6.3.1 URLs semánticas y SEO-friendly
  - [ ] 6.3.2 Manejo de parámetros de búsqueda en URL
  - [ ] 6.3.3 Canonical URLs para SEO

---

## 7.0 Optimización y Calidad

- [ ] 7.1 **Performance:**
  - [ ] 7.1.1 Lazy loading de componentes y rutas
  - [ ] 7.1.2 Optimización de imágenes (lazy loading, WebP)
  - [ ] 7.1.3 Code splitting estratégico
  - [ ] 7.1.4 Caching estratégico con TanStack Query
- [ ] 7.2 **Accesibilidad:**
  - [ ] 7.2.1 ARIA labels y roles apropiados
  - [ ] 7.2.2 Navegación por teclado
  - [ ] 7.2.3 Contraste de colores WCAG AA
  - [ ] 7.2.4 Screen reader compatibility
- [ ] 7.3 **Responsive Design:**
  - [ ] 7.3.1 Mobile-first approach
  - [ ] 7.3.2 Breakpoints consistentes
  - [ ] 7.3.3 Touch-friendly interactions
- [ ] 7.4 **PWA Capabilities:**
  - [ ] 7.4.1 Service worker para caching
  - [ ] 7.4.2 Manifest.json para instalación
  - [ ] 7.4.3 Offline fallbacks

---

## 8.0 Testing y Documentación

- [ ] 8.1 **Setup de testing:**
  - [ ] 8.1.1 Configurar Vitest + Testing Library
  - [ ] 8.1.2 Setup de mocks para API calls
  - [ ] 8.1.3 Configurar coverage reports
- [ ] 8.2 **Tests críticos:**
  - [ ] 8.2.1 Tests de componentes de UI
  - [ ] 8.2.2 Tests de flujos de autenticación
  - [ ] 8.2.3 Tests de integración para búsqueda
- [ ] 8.3 **Documentación:**
  - [ ] 8.3.1 README con setup instructions
  - [ ] 8.3.2 Storybook para componentes UI
  - [ ] 8.3.3 Documentación de arquitectura

---

## 9.0 Analytics y Monitoreo

- [ ] 9.1 **Analytics:**
  - [ ] 9.1.1 Google Analytics 4 setup
  - [ ] 9.1.2 Event tracking para acciones clave
  - [ ] 9.1.3 Conversion tracking
- [ ] 9.2 **Error Monitoring:**
  - [ ] 9.2.1 Sentry integration para error tracking
  - [ ] 9.2.2 Performance monitoring
  - [ ] 9.2.3 User session recording (opcional)

---

### ### Archivos Relevantes

- `FRONTEND_API_DOCUMENTATION.md` - Contiene todos los endpoints y modelos de datos necesarios para esta épica.