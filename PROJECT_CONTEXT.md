# CenterGest Project Context

## Project Overview
- Name: CenterGest
- Type: Therapy Management System
- Tech Stack: React, TypeScript, Supabase, TailwindCSS

## Database Schema
Location: `/src/sql_database/database.txt`

### Core Tables & Relationships
1. User Management
   ```sql
   person
   ├── app_user
   │   ├── therapist
   │   └── caregiver
   └── client
   ```

2. Therapy Management
   ```sql
   therapy
   ├── therapy_plan
   └── therapist_therapy_plan
   ```

3. Appointments & Scheduling
   ```sql
   appointment
   ├── plan_purchase
   └── auth_authorization
   ```

4. Financial
   ```sql
   payment
   ├── currency
   └── insurance_coverage
   ```

### Key Constraints
- All tables include:
  - `created_at` and `updated_at` timestamps
  - Primary key `id` as SERIAL
- Foreign keys follow pattern: `{referenced_table}_id`
- Status fields use predefined values:
  - 'active', 'inactive', 'suspended' (for users)
  - 'pending', 'approved', 'rejected' (for authorizations)
  - 'scheduled', 'completed', 'cancelled' (for appointments)

## Architecture

### Authentication
- Uses Supabase Auth
- Custom AuthProvider with context
- Protected routes with role-based access

### Components Organization
```
src/
├── sql_database/
│   └── database.txt    # Complete SQL schema
├── app/
│   ├── auth/
│   ├── pages/
│   └── components/
├── lib/
└── types/
```

## Coding Patterns
1. Service Layer Pattern
   - Each entity has its own service class
   - Services handle API calls and data transformation
   - Must follow database schema constraints

2. Component Structure
   - Pages contain business logic
   - Components are presentational
   - Forms use controlled inputs

3. Data Fetching
   - Uses Supabase client
   - Pagination implemented where needed
   - Error handling standardized
   - Queries must respect table relationships

4. TypeScript Patterns
   - Interfaces must match database schema
   - Strict typing for API responses
   - Proper error handling types

## Common Database Operations

### User Creation Flow
1. Insert into `person`
2. Insert into `app_user`
3. Insert into role-specific table (`therapist`/`client`/`caregiver`)

### Appointment Creation Flow
1. Verify `plan_purchase` exists and has available sessions
2. Verify `auth_authorization` is valid
3. Insert into `appointment`
4. Update `plan_usage_summary`
5. Update `authorization_usage_summary`

## Environment
- Development: Local Supabase instance
- Production: Hosted Supabase instance
- Environment variables managed via .env files

## Common Issues & Solutions
1. Database Constraints
   - Check foreign key relationships before deletions
   - Validate status values against allowed enum values
   - Ensure date ranges are valid

2. Type Safety
   - Use database schema as source of truth for types
   - Implement proper null handling for optional fields

3. Authentication
   - Always use AuthProvider context
   - Check permissions before operations
   - Validate user status before operations