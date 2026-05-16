# Real Estate Platform

A modern real estate platform built with Next.js 15, featuring authentication, broker management, and property listings.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.17 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Docker Desktop**
   - **Windows**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - **macOS**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**: Follow instructions at [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)
   - Verify installation:
     ```bash
     docker --version
     docker-compose --version
     ```

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation:
     ```bash
     git --version
     ```

4. **Code Editor** (Recommended: [VS Code](https://code.visualstudio.com/))

## Getting Started

Follow these steps to set up and run the project locally.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd real-estate-platform
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, NextAuth, Material-UI, and other dependencies.

### Step 3: Set Up Docker Containers

The project uses Docker Compose to run MySQL database and phpMyAdmin. Start the containers:

```bash
docker-compose up -d
```

This command will:

- Start MySQL 8.0 container on port `3306`
- Start phpMyAdmin container on port `8080`
- Create a persistent volume for database data

**Database Credentials** (from `docker-compose.yaml`):

- **Database Name**: `nextjs_db`
- **Username**: `nextjs_user`
- **Password**: `nextjs_password`
- **Root Password**: `secret`

**Access Points**:

- **MySQL**: `localhost:3306`
- **phpMyAdmin**: [http://localhost:8080](http://localhost:8080)

**Useful Docker Commands**:

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View container logs
docker-compose logs -f

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

### Step 4: Configure Environment Variables

Copy the example environment file and update it with your actual values:

**Windows (PowerShell)**:

```powershell
Copy-Item .env.example .env
```

**macOS/Linux**:

```bash
cp .env.example .env
```

Edit the `.env` file and replace all placeholder values with your actual credentials:

**Important Notes**:

- Replace all placeholder values with your actual credentials
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32` (or use an online generator)
- For Google OAuth, create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- For SMTP, use your email provider's SMTP settings (Gmail, SendGrid, etc.)
- **Never commit your `.env` file to version control** - it contains sensitive information

### Step 5: Set Up Database with Prisma

1. **Generate Prisma Client**:

   ```bash
   npx prisma generate
   ```

2. **Run Database Migrations**:

   ```bash
   npx prisma migrate dev
   ```

   This will:
   - Apply all pending migrations to create database tables
   - Generate Prisma Client with updated schema

3. **Verify Database Connection** (Optional):

   ```bash
   npx prisma studio
   ```

   This opens Prisma Studio at [http://localhost:5555](http://localhost:5555) where you can view and manage your database.

### Step 6: Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Open your browser and navigate to the URL to see the application running.

## Environment Variables Reference

| Variable               | Description                            | Required | Example                                       |
| ---------------------- | -------------------------------------- | -------- | --------------------------------------------- |
| `DATABASE_URL`         | MySQL connection string for Prisma     | Yes      | `mysql://user:password@localhost:3306/dbname` |
| `NEXTAUTH_URL`         | Base URL for NextAuth callbacks        | Yes      | `http://localhost:3000`                       |
| `NEXTAUTH_SECRET`      | Secret for NextAuth session encryption | Yes      | Random string (32+ chars)                     |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                 | Optional | From Google Cloud Console                     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret             | Optional | From Google Cloud Console                     |
| `JWT_SALT_KEY_ADMIN`   | JWT secret for admin tokens            | Yes      | Random string                                 |
| `JWT_SALT_KEY_BUYER`   | JWT secret for buyer tokens            | Yes      | Random string                                 |
| `SMTP_USER`            | Email service username                 | Yes      | `your-email@example.com`                      |
| `SMTP_PASS`            | Email service password                 | Yes      | Your email password                           |

## Available Scripts

| Command                | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `npm run dev`          | Start development server on [http://localhost:3000](http://localhost:3000) |
| `npm run build`        | Build the application for production                                       |
| `npm run start`        | Start the production server                                                |
| `npm run lint`         | Run ESLint to check for code issues                                        |
| `npm run lint:fix`     | Run ESLint and automatically fix issues                                    |
| `npm run format`       | Format code using Prettier                                                 |
| `npm run format:check` | Check if code is formatted correctly                                       |

## Project Structure

```
real-estate-platform/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/         # NextAuth authentication routes
│   │   ├── broker/       # Broker management endpoints
│   │   ├── company/      # Company management endpoints
│   │   └── user/         # User management endpoints
│   └── page.tsx          # Home page
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema definition
│   └── migrations/       # Database migration files
├── src/
│   ├── components/       # React components
│   │   ├── Header/       # Header component
│   │   ├── LoginDialog/  # Login dialog component
│   │   └── Providers/    # Context providers
│   └── lib/              # Utility libraries
│       ├── prisma.js     # Prisma client instance
│       └── uploadFile.js # File upload utilities
├── docker-compose.yaml    # Docker Compose configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Database Schema

The project uses Prisma ORM with MySQL. Key models include:

- **User**: User accounts with authentication
- **Broker**: Real estate broker profiles
- **Company**: Brokerage companies
- **Account**: OAuth account links (NextAuth)
- **Session**: User sessions (NextAuth)
- **ContactUs**: Contact form submissions
- **Testimonial**: Customer testimonials
- **Newsletter**: Newsletter subscriptions
- **Demographics**: Demographic data

View the complete schema in `prisma/schema.prisma`.

## Troubleshooting

### Docker Issues

**Problem**: Docker containers won't start

- **Solution**: Ensure Docker Desktop is running and ports 3306 and 8080 are not in use
- Check with: `docker ps` to see running containers

**Problem**: Port already in use

- **Solution**: Stop the conflicting service or change ports in `docker-compose.yaml`

**Problem**: Database connection refused

- **Solution**: Wait a few seconds after starting containers for MySQL to initialize, then verify with `docker-compose logs mysql`

### Prisma Issues

**Problem**: `PrismaClient is not configured`

- **Solution**: Run `npx prisma generate` to generate the Prisma Client

**Problem**: Migration errors

- **Solution**: Ensure Docker containers are running and `DATABASE_URL` in `.env` matches docker-compose credentials
- Reset database: `npx prisma migrate reset` (⚠️ This deletes all data)

**Problem**: Schema out of sync

- **Solution**: Run `npx prisma migrate dev` to sync schema with database

### Environment Variables

**Problem**: `NEXTAUTH_SECRET` error

- **Solution**: Ensure `.env` file exists and contains `NEXTAUTH_SECRET` with a valid random string

**Problem**: Database connection error

- **Solution**: Verify `DATABASE_URL` format matches: `mysql://username:password@host:port/database`
- Ensure Docker MySQL container is running

### Next.js Issues

**Problem**: Module not found errors

- **Solution**: Delete `node_modules` and `.next` folders, then run `npm install` again

**Problem**: Port 3000 already in use

- **Solution**: Change port: `npm run dev -- -p 3001` or kill the process using port 3000

### Authentication Issues

**Problem**: Google OAuth not working

- **Solution**:
  - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
  - Ensure authorized redirect URI in Google Cloud Console includes `http://localhost:3000/api/auth/callback/google`
  - Check that `NEXTAUTH_URL` matches your development URL

## Development Workflow

1. **Start Docker containers**: `docker-compose up -d`
2. **Start development server**: `npm run dev`
3. **Make changes**: Edit files in `app/` or `src/`
4. **Database changes**: Update `prisma/schema.prisma`, then run `npx prisma migrate dev`
5. **View database**: Run `npx prisma studio` for a visual database browser

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Material-UI Documentation](https://mui.com/)

## Support

If you encounter any issues not covered in this guide, please check:

1. Docker logs: `docker-compose logs`
2. Next.js console output in terminal
3. Browser console for client-side errors
4. Prisma Studio for database state verification

## License

[Add your license information here]

new structure

app/api
│
├───admin
│ ├───broker
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───city
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───company
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───contactus
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───demography
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───listing
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───newsletter
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───property-type
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───role
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───state
│ │ ├───[id]/route.js
│ │ └───route.js
│ ├───testimonial
│ │ ├───[id]/route.js
│ │ └───route.js
│ └───user
│ ├───[id]/route.js
│ └───route.js
│
├───auth
│ └───[...nextauth]/route.js
│
├───public
│ ├───broker/[id]/route.js
│ ├───city/route.js
│ ├───company/route.js
│ ├───demography/route.js
│ ├───listing/route.js
│ ├───property-type/route.js
│ ├───state/route.js
│ ├───testimonial/route.js
│ ├───search/route.js
│ ├───location-suggest/route.js
│ └───publicprop/route.js
│
├───owner
│ └───dashboard
│ ├───banner/route.js
│ ├───broker-detail/route.js
│ └───kpi/route.js
│
├───user
│ ├───login/route.js
│ ├───registration/route.js
│ ├───forgot/route.js
│ └───[id]/route.js
│
├───profile/route.js
├───wishlist/route.js
├───reaction
│ ├───like/route.js
│ └───visit/route.js
│
├───verify-email
│ ├───allow/route.js
│ ├───deny/route.js
│ └───resend/route.js
│
└───other
└───stats/route.js
