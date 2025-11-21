# Learning Notes

This file is organized by GitHub branches to track learning progress and notes for each branch.

---

## 📋 Table of Contents

- [main](#main)
- [How to Use](#how-to-use)
- [Database](#database)
- [tRPC](#trpc)
- [Auth](#Auth)

---

## main

**Branch:** `main`  
**Last Updated:** _Add date when you make changes_

### Notes

- _Add your notes here_

### Changes Made

- _List any changes or implementations here_

### Learning Points

- _Document what you learned while working on this branch_

### Questions / TODOs

- _Any questions or things to follow up on_

---

## How to Use

### Adding a New Branch Section

Copy the template below and add it above this "How to Use" section:

```markdown
## branch-name

**Branch:** `branch-name`
**Last Updated:** _YYYY-MM-DD_

### Notes
- _Add your notes here_

### Changes Made
- _List any changes or implementations here_

### Learning Points
- _Document what you learned while working on this branch_

### Questions / TODOs
- _Any questions or things to follow up on_
```

### Tips

- Update the "Last Updated" date when you make changes
- Be specific about what you learned or changed
- Use bullet points for easy scanning
- Add code snippets or examples if helpful
- Link to relevant commits or PRs if needed

---

## Database

**Branch** `Database`
**Last Updated** 2025 11 18 7:26 AM

### Notes

- Implemented Neon with 2 branches one for development and one for production
- Slight change in the `navigation-menu.tsx` file
- Implemented Simple tables just to test the config

### Changes Made

### Learning Points

## Questions / TODOs

---

## tRPC

**Branch** `trpc`
**Last Updated** 2025/11/18 7:32 AM

### Notes

- The command to install all the needed packages is `npm i @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-only`

### Changes Made

### Learning Points

## Questions / TODOs

---

## Auth

**Branch** `auth`

**Last Updated** 2025/11/18 7:32 AM

### Notes

- Middleware in Next.js is more like a proxy rather than a security layer
- It can be used be many packages got comporomised using the middleware for security
- The best page access control is page driven, meaning to add to your page a (check/session validton) in the top of your page/layout
- Make sure to have at least 2 layers of access layer
  - Data access layer (Main security layer)
  - Page access layer (More of UX Enhancment for the user)

### Changes Made

- Added Better Auth libaray for authentication
- Based on this I think it is better than auth js
- It gives you better documentation better integration and easily integrable with different providers
- Made a new protected procedure for the authinticated users
- Added resend to send email verfication link to verify users email
- Implementing page driven access control meaing that each page has its access control (There is no big of a difference from adding the access control in a layout or the page it self)
- Added a simple email verification system with resend
- The problem that resend only allows emails to be sent for the registered user any other user I need to have a custom domain

### Learning Points

- Next.js middleware is more like a proxy rather than a security layer
- Data access should be composte of 2 layers at least
  - API/Backend Layer
  - Frontend Layer
- The frontend layer if broken will not lead to data being exposed

## Questions / TODOs

- In Future I want to implement a simple framework/concept to be used with other non-js frameworks
- The way that the better auth server function uses the header of the Next.js navigation need to searched more and learned from

  ```typescript
    await auth.api.signOut({
        headers: await headers(),
    });
  ```

- Using the same methodolgy that Better Auth uses is the best way to acheive authentication in your app
