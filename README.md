# Gestión Biblioteca

Aplicación web de administración para gestionar inventario de libros, movimientos de entrada/salida y usuarios con roles diferenciados.

El proyecto realizado es un **Sistema de Gestión de Biblioteca**: los libros actúan como maestros del inventario y cada movimiento registra entradas o salidas de unidades.

## Tecnologías

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **Prisma 7** + **PostgreSQL** (Supabase)
- **NextAuth v5** (autenticación con credenciales)
- **Recharts** (gráficas de saldos)
- **Sonner** (notificaciones)

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Landing** | Página de inicio con acceso al login |
| **Transacciones** | Movimientos de inventario por libro, tabla y gráfica de saldos diarios |
| **Maestros** | Catálogo de libros con saldo y creador |
| **Usuarios** | Gestión de roles (solo administradores) |

### Roles

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso completo: transacciones, maestros, usuarios y creación de libros |
| **USER** | Transacciones y consulta de maestros. No puede crear libros ni gestionar usuarios |

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- Cuenta en [Supabase](https://supabase.com/) con un proyecto PostgreSQL creado
- Git

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/202601-Ingenieria-Web/MarianaGallego-GestionDeBiblioteca.git
cd Proyecto_2
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando también ejecuta `prisma generate` automáticamente (script `postinstall`).

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores con los datos de tu proyecto en Supabase:

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión pooled de Supabase (Transaction pooler, puerto 6543) |
| `DIRECT_URL` | URL de conexión directa de Supabase (puerto 5432) |
| `NEXTAUTH_SECRET` | Clave secreta para firmar sesiones. Generar con: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de la app en desarrollo: `http://localhost:3000` |

En Supabase: **Project Settings → Database → Connection string**.

### 4. Crear las tablas en la base de datos

```bash
npx prisma migrate dev
```

### 5. Cargar datos de prueba

```bash
npm run db:seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Credenciales de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `admin@biblioteca.com` | `admin123` |
| Usuario | `user@biblioteca.com` | `user123` |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run start` | Ejecutar build de producción |
| `npm run lint` | Verificar código con ESLint |
| `npm run db:seed` | Cargar datos iniciales en la BD |
| `npx prisma migrate dev` | Aplicar migraciones de base de datos |
| `npx prisma generate` | Regenerar el cliente Prisma |
```

## Modelos de datos

- **Usuario**: correo, contraseña (hash), nombre, rol (`ADMIN` | `USER`)
- **Libro** (maestro): nombre, saldo, creador
- **Movimiento**: tipo (`ENTRADA` | `SALIDA`), cantidad, libro, ejecutado por

## Notas

- El archivo `.env` **no se sube al repositorio**. Usa `.env.example` como referencia.
- La carpeta `src/generated/prisma` se genera automáticamente; no debe editarse manualmente.
- Si al clonar el proyecto aparecen errores de tipos de Prisma, ejecuta `npx prisma generate`.
- Solo debe haber **una instancia** de `npm run dev` corriendo a la vez (puerto 3000).
