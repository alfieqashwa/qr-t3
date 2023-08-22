# QR T3 App

## DOCUMENTATION

[Visual Doc](https://excalidraw.com/#json=3_Fallr3G5LHhB8gC_JgA,wsfBFIfCq-7W3ACxB3u0Og)

## Docker run on local machine

docker run --name <container_name> -e POSTGRES_USER=<user_name> -e POSTGRES_PASSWORD=<passwd_name> -p 5432:5432 -d <image_name>

Add more libs.

- [Framer-motion](https://www.framer.com/motion/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Lucide-React](https://lucide.dev/)

## TODOS

- [x] Create Drawer
- [x] Create Event Organizer Form (Admin Access):
  - [x] Redirect pages into `settings/create-eo` if user doesn't have eoID
  - [x] Redirect nto `/dashboard` page if user has eoID
  - [x] Delete new user from DB if signed-out before fill createEO form
  - [x] Error handling
  - [x] Success handling
  - [x] Setup UI Form
  - [x] Config RBAC
  - [x] Config User Role as Admin after success created Event Organizer
- [x] Setup userRole API to configure specific authorization
- [x] Setting Profile:
  - [x] Fetch Profile Information
  - [x] Fetch EO Information (All Auth Access of eo-user's list)
  - [x] Create User Avatar Menu List
  - [x] Create Logout Button
  - [x] Update EO Information Dialog Form (Admin Access)
  - [x] Delete EO Information Dialog Form (Admin Access)
  - [x] Update User Role back to USER after success deleted Event Organizer
- [x] Deactivate (Admin Access):
- [x] Create custom procedure:
  - [x] adminProcedure
  - [x] editorProcedure
  - [x] operatorProcedure
- [x] CRUD Editor and Operator Users (Admin Access)
  - [x] Create-Team API & Create Dialog Form
  - [x] Fetch all Teams based on EO-ID API & Setup Table list
  - [x] API Update-Team & Update Dialog Form
  - [x] Delete-Team API & Delete Dialog Form
- [x] Loading Configuration (UI)
- [x] Breakpoint Layout (Mobile - Tablet - Desktop) (UI)
  - [x] Home
  - [x] Dashboard
  - [x] Event
  - [x] Visitor
  - [x] Settings
- [x] Store Addresses [PROVINCES, REGENCIES, DISTRICTS, VILLAGES] into database using prisma db seed
- [x] Image Uploader

  - [x] Upload and remove user avatar
  - [ ] Add tooltip whenever user hovering the user avatar

- [x] Setup Event Page

  - [x] Configure Event CRUD
    - [x] Setup Table
    - [x] Setup Search
    - [x] Setup Filter
    - [x] Setup Pagination
    - [x] Delete Selected // All
  - [x] Configure Ticket CRUD
    - [x] Setup Table
    - [x] Setup Search
    - [x] Setup Filter
    - [x] Setup Pagination
    - [x] Automatic Update Status (Sale Config)
    - [x] Delete Selected // All
    - [x] Filter based on Category
  - [x] Dark / Light mode
    - [x] Setup toggle dark mode
    - [x] Setup colors (light && dark)

- [x] Setup Visitor Page (name, phone, isCheckIn, checkInDate, event, tickets)

  - [x] Configure Visitor CRUD
  - [x] Setup Table
  - [x] Setup Search
  - [x] Setup Filter
  - [x] Setup Pagination
  - [x] Delete Selected // All

- [x] Setup QRCode

  - [x] Create QRCode Generator
  - [x] Create QRCode Svg & Canvas option list
  - [x] Download Button for QRCode Svg & Canvas
  - [x] Setup Source Link content for QRCode
  - [x] Create Dynamic Page based on QRCode Source Link
  - [x] Operator Access Level Configuration
  - [x] QRCode Scanner Configuration

- [ ] Testing QRCode

  - [x] Add Check-[In/Out] Toggle Button
  - [ ] Configure Check-In Date
  - [ ] Testing Operator Access Level
  - [ ] Testing Scanning QRCode on mobile-view

## Upgrade Version

- [ ] Setup Dashboard Page

  - [ ] Setup Charts
  - [ ] Setup Table
  - [ ] Setup Search
  - [ ] Setup Filter
  - [ ] Setup Pagination

- [ ] Setup DB on Planet Scale
- [ ] Deploy on Vercel

## Future Planning for DayDreamer

- [ ] Convert App into Turbopack
- [ ] Create Documentation Web
- [ ] Setup React-Native (QR-Code Reader/Validator)
