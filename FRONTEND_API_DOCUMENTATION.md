# 📋 Oficios - Inflatrack Backend API Documentation

**Para el equipo de desarrollo Frontend**

## 🏗️ Descripción General del Proyecto

**Oficios - Inflatrack** es una plataforma web de clasificados para conectar clientes con proveedores de oficios de la construcción en La Plata, Argentina.

### 📊 Estado del Proyecto
- **Versión**: 0.2.0
- **Estado**: Backend completamente funcional ✅
- **Tests**: 324 tests pasando (100% success rate)
- **Coverage**: 87.23% statements, 71.3% branches
- **CI/CD**: GitHub Actions completamente estable

---

## 🚀 Configuración y Acceso

### Base URL de la API
```
Desarrollo: http://localhost:3000
Producción: [URL a definir]
```

### Configuración CORS
El backend está configurado para aceptar solicitudes desde:
- `http://localhost:5174` (frontend de desarrollo con Vite)
- Configurable via variable de entorno `CORS_ORIGIN`

### Health Check
```http
GET /health
```
**Respuesta:**
```json
{
  "status": "OK",
  "message": "Oficios - Inflatrack API is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 🔐 Sistema de Autenticación

### Tipos de Usuario (Roles)
| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `client` | Cliente regular | Buscar proveedores, crear reseñas |
| `provider` | Proveedor de servicios | Gestionar perfil, portfolio, disponibilidad |
| `mixto` | Usuario híbrido | Permisos de cliente + proveedor |
| `admin` | Administrador | Gestión de usuarios, proveedores, reseñas |
| `superadmin` | Super administrador | Todos los permisos |

### Autenticación JWT
- **Header requerido**: `Authorization: Bearer <token>`
- **Token expiration**: [Configurado en backend]
- **Renovación**: [A implementar si es necesario]

### Endpoints de Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123",
  "fullName": "Juan Pérez",
  "role": "client" | "provider" | "mixto"
}
```

**Respuesta Exitosa (201):**
```json
{
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "fullName": "Juan Pérez",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login de Usuario
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123"
}
```

**Respuesta idéntica al registro.**

---

## 🏠 Endpoints Públicos (Sin Autenticación)

### Búsqueda de Proveedores
```http
GET /api/providers?[parametros]
```

**Parámetros de búsqueda disponibles:**
- `cityId` (number): ID de la ciudad
- `serviceIds` (array): IDs de servicios [1,2,3]
- `search` (string): Búsqueda por texto libre
- `minRating` (number): Rating mínimo (1-5)
- `availabilityStatusId` (number): ID de estado de disponibilidad
- `availabilityStatus` (string): "available" | "busy" | "unavailable"
- `page` (number, default: 1): Página para paginación
- `limit` (number, default: 10): Elementos por página

**Ejemplo:**
```http
GET /api/providers?cityId=1&serviceIds=1&serviceIds=2&search=plomero&page=1&limit=10
```

**Respuesta:**
```json
{
  "providers": [
    {
      "id": 1,
      "businessName": "Plomería ABC",
      "phoneNumber": "+541112345678",
      "profileImageUrl": "https://ejemplo.com/imagen.jpg",
      "cityName": "La Plata",
      "bio": "Especialistas en plomería...",
      "availabilityStatus": "available",
      "status": "approved",
      "services": [
        {"id": 1, "name": "Plomería"},
        {"id": 2, "name": "Gasista"}
      ],
      "averageRating": 4.5,
      "totalReviews": 23,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Perfil Público de Proveedor
```http
GET /api/providers/:id
```

**Respuesta:**
```json
{
  "id": 1,
  "businessName": "Plomería ABC",
  "phoneNumber": "+541112345678",
  "profileImageUrl": "https://ejemplo.com/imagen.jpg",
  "cityName": "La Plata",
  "bio": "Especialistas en plomería con más de 10 años...",
  "availabilityStatus": "available",
  "status": "approved",
  "services": [
    {"id": 1, "name": "Plomería"},
    {"id": 2, "name": "Gasista"}
  ],
  "portfolio": [
    {
      "id": 1,
      "imageUrl": "https://ejemplo.com/trabajo1.jpg",
      "description": "Instalación de cañerías",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 23,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Reseñas de Proveedor
```http
GET /api/providers/:id/reviews?page=1&limit=10
```

**Respuesta:**
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excelente trabajo, muy profesional",
      "photoUrl": "https://ejemplo.com/review1.jpg",
      "clientName": "María García",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "statistics": {
    "averageRating": 4.5,
    "totalReviews": 23,
    "ratingDistribution": {
      "5": 15,
      "4": 5,
      "3": 2,
      "2": 1,
      "1": 0
    }
  },
  "pagination": {
    "total": 23,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 👤 Endpoints de Cliente (Autenticación Requerida)

### Crear Reseña
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerProfileId": 1,
  "rating": 5,
  "comment": "Excelente trabajo, muy profesional",
  "photoUrl": "https://ejemplo.com/review.jpg"
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "providerProfileId": 1,
  "rating": 5,
  "comment": "Excelente trabajo, muy profesional",
  "photoUrl": "https://ejemplo.com/review.jpg",
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🔧 Endpoints de Proveedor (Autenticación Requerida)

**Nota**: Requiere rol `provider` o `mixto`

### Gestión de Perfil

#### Crear Perfil de Proveedor
```http
POST /api/provider/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Plomería ABC",
  "phoneNumber": "+541112345678",
  "profileImageUrl": "https://ejemplo.com/imagen.jpg",
  "cityId": 1,
  "bio": "Especialistas en plomería con más de 10 años de experiencia",
  "serviceIds": [1, 2]
}
```

#### Actualizar Perfil de Proveedor
```http
PUT /api/provider/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Plomería ABC Renovada",
  "bio": "Nueva descripción del negocio"
}
```

#### Obtener Perfil Propio
```http
GET /api/provider/profile
Authorization: Bearer <token>
```

### Gestión de Portfolio

#### Agregar Ítem al Portfolio
```http
POST /api/provider/portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://ejemplo.com/trabajo1.jpg",
  "description": "Instalación de cañerías completa"
}
```

#### Obtener Portfolio
```http
GET /api/provider/portfolio
Authorization: Bearer <token>
```

#### Eliminar Ítem del Portfolio
```http
DELETE /api/provider/portfolio/:id
Authorization: Bearer <token>
```

### Gestión de Disponibilidad

#### Actualizar Estado de Disponibilidad
```http
PUT /api/provider/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availabilityStatusId": 1
}
```

#### Obtener Estados de Disponibilidad
```http
GET /api/provider/availability/statuses
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {"id": 1, "name": "available"},
  {"id": 2, "name": "busy"},
  {"id": 3, "name": "unavailable"}
]
```

---

## 🛡️ Endpoints de Administración (Roles admin/superadmin)

### Dashboard de Administración
```http
GET /api/admin/dashboard?period=week
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "totalUsers": 150,
  "totalProviders": 45,
  "totalReviews": 234,
  "pendingProviders": 5,
  "pendingReviews": 8,
  "periodStats": {
    "newUsers": 12,
    "newProviders": 3,
    "newReviews": 15
  }
}
```

### Gestión de Proveedores

#### Listar Proveedores Pendientes
```http
GET /api/admin/providers/pending?page=1&limit=10&search=plomero
Authorization: Bearer <token>
```

#### Aprobar Proveedor
```http
PUT /api/admin/providers/:id/approve
Authorization: Bearer <token>
```

#### Rechazar Proveedor
```http
PUT /api/admin/providers/:id/reject
Authorization: Bearer <token>
```

#### Análisis de Validación de Proveedor
```http
GET /api/admin/providers/:id/analysis
Authorization: Bearer <token>
```

### Gestión de Reseñas

#### Listar Reseñas Pendientes
```http
GET /api/admin/reviews/pending?search=excelente&rating=5
Authorization: Bearer <token>
```

#### Aprobar Reseña
```http
PUT /api/admin/reviews/:id/approve
Authorization: Bearer <token>
```

#### Rechazar Reseña
```http
PUT /api/admin/reviews/:id/reject
Authorization: Bearer <token>
```

### Gestión de Usuarios

#### Listar Todos los Usuarios
```http
GET /api/admin/users?role=provider&isBanned=false&search=juan
Authorization: Bearer <token>
```

#### Banear Usuario
```http
PUT /api/admin/users/:id/ban
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Comportamiento inapropiado"
}
```

---

## 📊 Modelos de Datos

### Estructura de Base de Datos

#### Usuario (User)
```typescript
{
  id: number;
  email: string;
  fullName: string;
  role: string;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Perfil de Proveedor (ProviderProfile)
```typescript
{
  id: number;
  userId: number;
  businessName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  cityId: number;
  cityName: string;
  bio?: string;
  availabilityStatusId: number;
  availabilityStatusName: string;
  statusId: number;
  statusName: string;
  services: Array<{id: number, name: string}>;
  createdAt: string;
  updatedAt: string;
}
```

#### Reseña (Review)
```typescript
{
  id: number;
  providerProfileId: number;
  clientUserId: number;
  rating: number; // 1-5
  comment?: string;
  photoUrl?: string;
  status: string; // "pending" | "approved" | "rejected"
  createdAt: string;
  updatedAt: string;
}
```

#### Ítem de Portfolio (PortfolioItem)
```typescript
{
  id: number;
  providerProfileId: number;
  imageUrl: string;
  description?: string;
  createdAt: string;
}
```

### Catálogos de Datos

#### Roles
- `client` - Cliente
- `provider` - Proveedor
- `mixto` - Usuario híbrido
- `admin` - Administrador
- `superadmin` - Super administrador

#### Estados de Disponibilidad
- `available` - Disponible
- `busy` - Ocupado
- `unavailable` - No disponible

#### Estados de Perfil de Proveedor
- `pending` - Pendiente de aprobación
- `approved` - Aprobado
- `rejected` - Rechazado

#### Estados de Reseña
- `pending` - Pendiente de moderación
- `approved` - Aprobada
- `rejected` - Rechazada

#### Servicios (Ejemplos)
- Plomería
- Gasista
- Electricista
- Pintura
- Albañilería
- Carpintería

#### Ciudades
- La Plata (actualmente limitado a La Plata)

---

## 🔄 Códigos de Estado HTTP

### Códigos de Éxito
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente

### Códigos de Error
- `400 Bad Request` - Datos de solicitud inválidos
- `401 Unauthorized` - Token de autenticación requerido o inválido
- `403 Forbidden` - Permisos insuficientes
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email ya existe)
- `500 Internal Server Error` - Error del servidor

### Formato de Errores
```json
{
  "error": "Validation error",
  "message": "El email ya está registrado",
  "details": ["Campo específico con error"]
}
```

---

## 🗃️ Validaciones de Datos

### Validación de Teléfonos
- **Formato argentino**: `/^(\+54|0)?9?(11|221)[0-9]{7,8}$/`
- **Ejemplos válidos**:
  - `+541112345678`
  - `01112345678`
  - `2211234567`

### Validación de Emails
- Formato estándar de email
- Máximo 255 caracteres

### Validación de Contraseñas
- [Definir criterios específicos en backend]

### Validación de URLs
- URLs válidas para imágenes de perfil y portfolio
- Máximo 255 caracteres

---

## 🧪 Testing y Desarrollo

### Estado de Testing
- **324 tests pasando** (100% success rate)
- **19 test suites** exitosos
- **Cobertura**: 87.23% statements, 71.3% branches
- **CI/CD**: GitHub Actions completamente estable

### Herramientas Recomendadas para Frontend
- **API Client**: Axios o Fetch
- **Autenticación**: Interceptores para JWT
- **Estado**: Redux/Zustand para manejo de estado de usuario
- **Validación**: Formik/React Hook Form + Yup/Zod

### Consideraciones de Performance
- **Paginación**: Implementada en todos los listados
- **Caching**: Recomendado para catálogos (servicios, ciudades, etc.)
- **Optimización de imágenes**: Considerar CDN para imágenes

---

## 🚀 Próximas Funcionalidades (Roadmap)

### En Desarrollo
- Google OAuth 2.0 (autenticación social)
- Restricción geográfica a La Plata
- Optimizaciones de performance

### Futuras Implementaciones
- Sistema de notificaciones en tiempo real
- Chat entre clientes y proveedores
- Sistema de calificaciones más detallado
- Geolocalización y mapas

---

## 📞 Contacto y Soporte

Para consultas sobre la API o problemas técnicos:
- **Repositorio**: [GitHub Repository URL]
- **Documentación técnica**: `PRD.md` en el repositorio
- **Tests de API**: Directorio `/tests` para ejemplos de uso

---

**Última actualización**: 19 de Septiembre 2025
**Versión del documento**: 1.0
**Estado**: ✅ Listo para desarrollo de Frontend