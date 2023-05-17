# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# DOCUMENTATION

[Visual Doc](https://excalidraw.com/#json=3_Fallr3G5LHhB8gC_JgA,wsfBFIfCq-7W3ACxB3u0Og)

## Docker run on local machine
docker run --name <container_name> -e POSTGRES_USER=<user_name> -e  POSTGRES_PASSWORD=<passwd_name> -p 5432:5432 -d <image_name>

Add more libs.
- [Framer-motion](https://www.framer.com/motion/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Lucide-React](https://lucide.dev/)

## TODOS:
- [x] Create Drawer
- [x] Create Event Organizer Form (Admin Access):
  - [x] Redirect pages into `settings/create-eo` if user has no eoID
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
  - [x]  adminProcedure
  - [x]  editorProcedure
  - [x]  operatorProcedure
- [x] CRUD Editor and Operator Users (Admin Access)
  -[x] Create-Team API & Create Dialog Form
  -[x] Fetch all Teams based on EO-ID API & Setup Table list
  -[x] API Update-Team & Update Dialog Form
  -[x] Delete-Team API & Delete Dialog Form
- [x] Loading Configuration (UI)
- [x] Image Uploader
  - [ ] How to set upload button on top of the user avatar itself
  - [ ] Add tooltip whenever user hovering the user avatar
- [x] Breakpoint Layout (Mobile - Tablet - Desktop) (UI)
  - [x] Home
  - [x] Dashboard
  - [x] Event
  - [x] Visitor
  - [x] Settings
- [ ] Setup DB on Planet Scale
- [ ] Deploy on Vercel