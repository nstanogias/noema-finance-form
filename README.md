## Project Overview

Financing Request Portal allows users to submit financing requests with validation rules and business logic, including special handling for OPEC countries and validity period requirements.

### Features

- **Form Validation**: Comprehensive validation using Zod schema
- **Country & Currency Selection**: Integration with external APIs
- **OPEC Country Rules**: Automatic USD currency selection for OPEC countries
- **Validity Period Controls**: Enforces business rules (1-3 year validity period)
- **Submission History**: Displays previously submitted requests
- **Responsive Design**: Mobile and desktop friendly interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Data Fetching**: TanStack React Query
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Structure

```
src/
  app/              # Next.js app router pages
  components/       # React components
  context/          # React Context providers
  hooks/            # Custom React hooks for data fetching
  services/         # API services
  types/            # TypeScript type definitions
  validation/       # Zod validation schemas
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration

The application integrates with the following APIs:

- Countries data: REST Countries API
- Currency data: Open Exchange Rates API
- Financing requests: Internal API (test endpoint)
