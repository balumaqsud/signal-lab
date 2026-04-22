---
name: frontend-form
description: Builds frontend forms with React Hook Form, TanStack Query mutations, and shadcn-style UI feedback patterns. Use when implementing or extending user input workflows.
---

# Frontend Form Skill

## When to Use

- Creating new user forms in frontend pages/components.
- Replacing ad-hoc state handling with RHF + mutation patterns.
- Adding loading, toast/error, and result list UX around API writes.

## Step-by-step instructions

1. Define typed form values and default values.
2. Build fields with React Hook Form (`register`, `handleSubmit`).
3. Use UI primitives from `components/ui` for consistent appearance.
4. Connect submit to TanStack Query `useMutation`.
5. On success:
   - show success feedback,
   - reset form if appropriate,
   - invalidate related queries.
6. On error:
   - map backend message to user-friendly text,
   - show clear error state.
7. Add explicit loading/disabled states on submit actions.
8. Ensure list/query sections handle loading, empty, error, and success states.
