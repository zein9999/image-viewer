# Development Guide

This document describes the workflow, conventions, and procedures for contributing to the Image Viewer project.

## Gitflow Branching Model

We strictly follow the **Gitflow** branching model. Never commit directly to the `main` branch.

### Branches in Use

- **`main`**: Production releases only.
- **`develop`**: Default integration branch. All features are merged here.
- **`feature/*`**: Features or enhancements. Create from `develop`, merge back to `develop`.
- **`release/*`**: Release preparations. Create from `develop`, merge to `main` and `develop`.
- **`hotfix/*`**: Emergency production patches. Create from `main`, merge to `main` and `develop`.

---

## Commit Guidelines

We use **Conventional Commits** format. Commits must look like:

```
<type>: <description>
```

Common types:

- `feat`: A new feature
- `fix`: A bug fix
- `test`: Adding or correcting tests
- `ci`: Changes to GitHub Actions workflows or scripts
- `docs`: Documentation changes
- `chore`: Refactoring or package updates

---

## Pull Request Policy

Every Pull Request targeting `develop` or `main` runs a GitHub Actions workflow that verifies:

1. Lint rules (`npm run lint`)
2. Formatting standards (`prettier`)
3. TypeScript compiler check (`npm run typecheck`)
4. All unit tests pass (`npm run test:run`)
5. Successful production build (`npm run build`)
6. Manifest permissions compliance (`node scripts/check-permissions.js`)

A Pull Request cannot be merged if any check in the CI pipeline fails.
