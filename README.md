# Consent Management App

This project is a consent management app built with **Next.js 15** and **Material UI (MUI)**. It demonstrates scalable, real-world patterns for data fetching, state management, SSR, and mobile responsiveness.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Run the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

3. **Run tests:**
   ```bash
   yarn test
   # or
   npm test
   ```

4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture & Key Decisions

### 1. **SSR for Initial Data**
- **Decision:** The first page of consents is fetched server-side for fast load and SEO.
- **Alternative:** Client-only fetching would be simpler but slower and less SEO-friendly and there is a flicker.

### 2. **React Context for Pagination, Caching, and Refresh**
- **Decision:** A custom `ConsentsContext` manages pagination state, page cache, loading/error, and refresh logic.
- **Alternative:**
  - *Redux/Zustand/Jotai:* Overkill for this scale; context is lighter.
  - *Page-level state:* Would require prop-drilling and duplicate logic across components.
- **Justification:** Context centralizes logic, avoids prop-drilling, and is easily extensible.

### 3. **Service Layer for API Calls**
- **Decision:** All API calls are abstracted in a `/services/consents.ts` file.
- **Alternative:** Direct fetch calls in components.
  - Leads to duplicated logic across components.
  - Makes testing and mocking harder.
  - Tightly couples data fetching to UI, making refactoring and reuse difficult.
  - Makes future backend/API changes more painful and error-prone.
- **Justification:** Service layer enables easier testing, mocking, and future backend changes.

### 4. **Mock API with In-Memory Storage**
- **Decision:** The backend is a Next.js API route using in-memory storage for consents.
- **Alternative:** Real database or external mock server.
- **Justification:** In-memory API is fast, simple, and sufficient for the challenge.

### 5. **Mobile Responsiveness**
- **Decision:**
  - Table hides the email column on mobile, enables horizontal scroll, and adapts column widths.
  - Sidebar collapses to a drawer with a hamburger menu on mobile.
  - Form fields stack vertically and adjust padding/font size on mobile.
- **Alternative:** Non-responsive design.
- **Justification:** Mobile-first is a must for real-world apps.

### 6. **Testing**
- **Decision:**
  - Logic and UI are covered by tests using Jest and React Testing Library.

---

## 🧩 Main Features
- **Give Consent Form:** Validates input, submits to the API, and refreshes the consents list.
- **Consents Table:** Paginated, responsive, and caches pages for fast navigation.
- **SSR:** First page of consents is server-rendered for speed and SEO.
- **Context:** Centralizes pagination, caching, and refresh logic.
- **Mock API:** Fast, in-memory backend for local development.
- **Mobile Responsive:** Looks great on all devices.

---

## 🧪 Testing
- Run all tests:
  ```bash
  yarn test
  # or
  npm test
  ```
- Tests are located in `__tests__/`.

---

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
