# 🚀 Team Management System

A modern, full-stack team management application built with Next.js 14, TypeScript, and MongoDB. Features a beautiful UI with drag-and-drop reordering, real-time search, optimistic updates, and comprehensive CRUD operations.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## ✨ Features

### Core Functionality

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete teams and members
- 🔍 **Real-time Search** - Search across team names, managers, directors, and members
- 🎯 **Drag & Drop Reordering** - Intuitive team ordering with visual feedback
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Optimistic Updates** - Instant UI feedback with automatic rollback on errors
- 🎨 **Beautiful UI** - Modern design with smooth animations and transitions

### Advanced Features

- 🔄 **Multi-Select Operations** - Bulk delete teams with confirmation
- ✅ **Three-State Approval System** - Manager and Director approval workflows
- 👥 **Member Management** - Add, edit, delete team members inline
- 🎯 **Form Validation** - Comprehensive validation with error messages
- 🌓 **Theme Support** - Built-in theme system ready for dark mode
- 🔔 **Toast Notifications** - User-friendly feedback for all operations

### Technical Highlights

- 🏗️ **Clean Architecture** - Separation of concerns with custom hooks and API layer
- 🎭 **Optimistic UI** - Immediate feedback with automatic error recovery
- 🔒 **Type Safety** - Full TypeScript coverage
- ♿ **Accessibility** - ARIA labels and keyboard navigation
- 🎨 **Component Library** - 15+ reusable components
- 📦 **Custom Hooks** - 5 specialized hooks for state management

## 📸 Screenshots

### Desktop View

- Team list with drag-and-drop reordering
- Expandable team rows showing member details
- Approval status management with three-state checkboxes

### Mobile View

- Fully responsive card-based layout
- Touch-optimized interactions
- Mobile-friendly forms and modals

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **UI Components:** Custom components with Radix UI primitives
- **State Management:** React Hooks + Custom Hooks
- **Form Handling:** Client-side validation

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** MongoDB with Mongoose ODM
- **Validation:** TypeScript + Runtime validation

### Development Tools

- **Package Manager:** npm
- **Linting:** ESLint
- **Code Formatting:** Prettier (via ESLint)
- **Type Checking:** TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **MongoDB** 7.0 or higher (local or Atlas)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd team-management-crud_v7
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/team-management

# Optional: MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-management?retryWrites=true&w=majority

# Application
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
team-management-crud_v7/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── teams/                # Team API endpoints
│   │       ├── [id]/             # Individual team operations
│   │       │   ├── route.ts      # GET, PUT, DELETE team
│   │       │   ├── status/       # Update approval status
│   │       │   └── members/      # Member CRUD operations
│   │       ├── bulk-delete/      # Bulk operations
│   │       ├── reorder/          # Drag & drop reordering
│   │       └── route.ts          # GET all, POST new team
│   ├── teams/                    # Team pages
│   │   ├── new/                  # Create team page
│   │   └── [id]/                 # Edit team page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (main list)
│   └── globals.css               # Global styles
│
├── components/                   # Reusable components
│   ├── ui/                       # UI primitives
│   │   ├── toast.tsx             # Toast notifications
│   │   └── toaster.tsx           # Toast container
│   ├── confirmation-modal.tsx    # Confirmation dialogs
│   ├── empty-state.tsx           # Empty state display
│   ├── expanded-members-section.tsx # Team members view
│   ├── form-actions.tsx          # Form buttons
│   ├── form-field.tsx            # Form input
│   ├── icon.tsx                  # SVG icon loader
│   ├── loading-spinner.tsx       # Loading indicator
│   ├── member-card-mobile.tsx    # Mobile member card
│   ├── member-table-row.tsx      # Desktop member row
│   ├── page-header.tsx           # Page header
│   ├── search-bar.tsx            # Search input
│   ├── select-all-checkbox.tsx   # Multi-select checkbox
│   ├── team-member-row.tsx       # Team member input
│   ├── team-members-section.tsx  # Members form section
│   ├── team-row.tsx              # Team table row
│   ├── theme-provider.tsx        # Theme context
│   └── three-state-checkbox.tsx  # Approval checkbox
│
├── hooks/                        # Custom React hooks
│   ├── use-confirmation.ts       # Confirmation modal hook
│   ├── use-mobile.ts             # Mobile detection
│   ├── use-optimistic-update.ts  # Optimistic updates
│   ├── use-team-drag.ts          # Drag & drop logic
│   ├── use-team-search.ts        # Search functionality
│   ├── use-team-selection.ts     # Multi-select logic
│   ├── use-teams.ts              # Team operations hook
│   └── use-toast.ts              # Toast notifications
│
├── lib/                          # Utility functions
│   ├── api/                      # API service layer
│   │   └── teams.ts              # Team API client
│   ├── mongodb.ts                # MongoDB connection
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
│
├── public/                       # Static assets
│   └── icons/                    # SVG icons
│       ├── chevron-right.svg
│       ├── drag-handle.svg
│       ├── empty-state.svg
│       ├── search.svg
│       └── team-members.svg
│
├── styles/                       # Additional styles
│   └── globals.css               # Global CSS
│
├── .env.local                    # Environment variables (create this)
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── components.json               # Shadcn/UI config
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Teams

##### Get All Teams

```http
GET /api/teams
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "teamName": "Engineering Team",
    "manager": "John Doe",
    "director": "Jane Smith",
    "managerApprovalStatus": "approved",
    "directorApprovalStatus": "pending",
    "members": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Alice Johnson"
      }
    ],
    "order": 0
  }
]
```

##### Get Single Team

```http
GET /api/teams/:id
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "teamName": "Engineering Team",
  "manager": "John Doe",
  "director": "Jane Smith",
  "managerApprovalStatus": "approved",
  "directorApprovalStatus": "pending",
  "members": [...]
}
```

##### Create Team

```http
POST /api/teams
Content-Type: application/json
```

**Request Body:**

```json
{
  "teamName": "Engineering Team",
  "manager": "John Doe",
  "director": "Jane Smith",
  "members": [
    {
      "_id": "unique-id",
      "name": "Alice Johnson"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

##### Update Team

```http
PUT /api/teams/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "teamName": "Updated Team Name",
  "manager": "John Doe",
  "director": "Jane Smith",
  "members": [...]
}
```

**Response:**

```json
{
  "success": true
}
```

##### Delete Team

```http
DELETE /api/teams/:id
```

**Response:**

```json
{
  "success": true
}
```

##### Bulk Delete Teams

```http
POST /api/teams/bulk-delete
Content-Type: application/json
```

**Request Body:**

```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response:**

```json
{
  "success": true,
  "deletedCount": 2
}
```

##### Reorder Teams

```http
POST /api/teams/reorder
Content-Type: application/json
```

**Request Body:**

```json
{
  "teams": [
    { "_id": "...", "teamName": "...", "order": 0 },
    { "_id": "...", "teamName": "...", "order": 1 }
  ]
}
```

**Response:**

```json
{
  "success": true
}
```

#### Approval Status

##### Update Approval Status

```http
PATCH /api/teams/:id/status
Content-Type: application/json
```

**Request Body:**

```json
{
  "field": "managerApprovalStatus",
  "status": "approved"
}
```

**Valid statuses:** `pending`, `approved`, `not-approved`

**Response:**

```json
{
  "success": true
}
```

#### Members

##### Delete Member

```http
DELETE /api/teams/:teamId/members/:memberId
```

**Response:**

```json
{
  "success": true
}
```

##### Update Member

```http
PATCH /api/teams/:teamId/members/:memberId
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Name"
}
```

**Response:**

```json
{
  "success": true
}
```

## 🎨 Component Architecture

### API Service Layer

**Location:** `lib/api/teams.ts`

Centralized API client with methods for all operations:

- `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- `bulkDelete()`, `updateStatus()`, `reorder()`
- `deleteMember()`, `updateMember()`

### Custom Hooks

#### `useTeams`

Main hook for team management with optimistic updates and error handling.

#### `useTeamSearch`

Real-time search across all team fields.

#### `useTeamSelection`

Multi-select functionality for bulk operations.

#### `useTeamDrag`

Drag and drop reordering with persistence.

#### `useConfirmation`

Reusable confirmation modal system.

### Reusable Components

All components are fully typed, responsive, and follow atomic design principles:

- **Atoms:** Icon, FormField, LoadingSpinner
- **Molecules:** SearchBar, EmptyState, SelectAllCheckbox
- **Organisms:** TeamRow, PageHeader, ExpandedMembersSection
- **Templates:** Page layouts with consistent structure

## 🔧 Configuration

### Tailwind CSS

Custom theme configuration in `tailwind.config.ts` includes:

- Custom colors for success, destructive, muted states
- Responsive breakpoints
- Animation utilities
- Border radius scales

### TypeScript

Strict mode enabled with:

- Path aliases (`@/` for root imports)
- Full type checking
- No implicit any

### ESLint

Next.js recommended rules with:

- TypeScript support
- React hooks validation
- Import order optimization

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new team with members
- [ ] Edit team details
- [ ] Add/remove team members
- [ ] Delete individual team
- [ ] Bulk delete multiple teams
- [ ] Drag and drop to reorder teams
- [ ] Search functionality
- [ ] Approval status changes
- [ ] Mobile responsiveness
- [ ] Form validation
- [ ] Error handling

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** Cannot connect to MongoDB

**Solution:**

```bash
# Check MongoDB is running
mongo --version

# Restart MongoDB service
# Windows: net start MongoDB
# macOS: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**

```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found

**Problem:** Cannot find module errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

| Variable      | Description               | Default       | Required |
| ------------- | ------------------------- | ------------- | -------- |
| `MONGODB_URI` | MongoDB connection string | -             | Yes      |
| `NODE_ENV`    | Environment mode          | `development` | No       |

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t team-management .
docker run -p 3000:3000 team-management
```

---

<p align="center">Made with ❤️ by Abdullah An-Noor</p>
