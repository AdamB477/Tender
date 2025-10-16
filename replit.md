# Tender - B2B Tender Matching Platform

## Overview

Tender is a B2B marketplace platform that connects tenderers (businesses issuing work) with qualified contractors (businesses bidding on work). The platform uses AI-powered matching algorithms to rank contractors based on skills, location, compliance status, and reliability. Key features include crew member management with individual compliance tracking, explainable matching scores, bid comparison tools, and document management with expiry tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Design System**: Material Design (Enterprise Variant) with Linear-inspired refinements, focusing on data-dense B2B workflows with professional aesthetics. The design emphasizes information hierarchy, efficient workflows, and status clarity through color-coded badges and progress indicators.

**State Management**: TanStack Query (React Query) for server state management with optimistic updates and background refetching disabled by default

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**Theme System**: Custom theme provider with light/dark mode support using CSS custom properties. Color palette designed for trust and transparency with distinct status colors (success/warning/error) for compliance and availability states.

**Key Design Patterns**:
- List-driven UX (no swiping) with ranked results showing match scores and explanatory chips
- Card-based layouts for tenders, bids, contractors, and crew members
- Drawer/sheet components for detailed views without navigation
- Comparison panels for side-by-side bid analysis
- Badge system for status indication (available/busy, valid/expired/expiring, pending/awarded)

### Backend Architecture

**Runtime**: Node.js with Express.js server

**Language**: TypeScript with ES modules

**API Design**: RESTful API with route handlers in `/server/routes.ts`

**Storage Layer**: Abstracted through `IStorage` interface in `/server/storage.ts` allowing for implementation flexibility

**Key Endpoints**:
- Organizations: GET/PATCH for profiles and availability
- Tenders: CRUD operations with status lifecycle management
- Bids: Creation and status updates with contractor nomination
- Crew Members: Management with individual compliance tracking
- Compliance Documents: Upload and expiry tracking per entity
- Matching: `/api/match/contractors/:tenderId` and `/api/match/tenders/:contractorId` for ranked results
- Messages: Communication between tenderers and contractors
- Reviews: Bidirectional rating system

**Matching Engine**: Explainable scoring algorithm combining:
- Skills/industry fit (cosine similarity on embeddings)
- Location proximity (Haversine/PostGIS distance)
- Compliance validity (hard gate requirement)
- Availability status (hard gate requirement)
- Reliability score (historical performance)

### Database Design

**ORM**: Drizzle ORM configured for PostgreSQL

**Schema Location**: `/shared/schema.ts` with Zod validation schemas

**Key Tables**:
- `organizations`: Both tenderer and contractor profiles with type enum, capabilities array, geolocation, ratings, and availability toggle
- `users`: Authentication and role-based access control tied to organizations
- `tenders`: Job postings with status enum (draft/open/awarded/closed), budget range, location, skills required
- `bids`: Contractor submissions with status enum (pending/shortlisted/awarded/rejected) and crew nominations
- `crewMembers`: Individual worker profiles owned by contractor organizations
- `complianceDocs`: Document vault with entity polymorphism (org-level or crew-level), expiry tracking, verification status
- `messages`: Communication threads linked to tenders
- `reviews`: Bidirectional ratings between tenderers and contractors

**Enums**: PostgreSQL native enums for user types, tender status, bid status, and compliance status ensuring data integrity

**Data Patterns**:
- Soft deletes via status changes rather than hard deletes
- JSONB fields for flexible metadata (budget ranges, capability tags)
- Array fields for multi-value attributes (capabilities, regions)
- Real/float types for geolocation (latitude/longitude)
- Timestamp tracking (createdAt) for audit trails

### Authentication & Authorization

**Authentication**: Email + password with magic link support planned

**Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

**Authorization**: Role-based access control (RBAC) with organization membership model
- Users belong to organizations
- Roles: tenderer, contractor, admin
- Organization-level permissions for crew and compliance data

**Privacy Controls**: Crew member profiles default to org-internal visibility, shared only upon nomination or award to streamline site pass approvals

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud database with WebSocket support for serverless environments
- **Drizzle Kit**: Database migrations and schema management

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production bundling for server code
- **Wouter**: Lightweight routing library

### Data & State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with Zod validation
- **Zod**: Runtime type validation and schema definition

### Third-Party Services (Planned/Potential)
- **Document Storage**: File uploads for compliance documents (S3/CloudStorage)
- **Geolocation Services**: Maps and distance calculations (Google Maps API/MapBox)
- **Embeddings/ML**: Vector similarity for skills matching (OpenAI/Anthropic)
- **Email Service**: Transactional emails and magic links (SendGrid/Postmark)
- **Real-time Communication**: WebSocket support for live messaging (Socket.io)