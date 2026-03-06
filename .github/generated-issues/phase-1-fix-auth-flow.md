# [PHASE 1] Fix Auth Flow

## Phase Overview
- **Phase Number**: 1
- **Phase Title**: Shared Foundation
- **Estimated Duration**: Week 1-2
- **Dependencies**: None
- **Estimated Hours**: 12

## Task Description
Complete authentication flow implementation

## Detailed Requirements
- [ ] Fix deriveTenantId() - use WorkOS organization ID
- [ ] Fix deriveRole() - look up role from users table
- [ ] Build proper /auth/login/page.tsx
- [ ] Build proper /auth/callback/route.ts
- [ ] Add logout route
- [ ] Wire ConvexProvider in root layout

## Acceptance Criteria
- [ ] All backend functions implemented and tested
- [ ] All frontend pages created and responsive
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Code review approved

## Files to Create/Modify
`frontend/src/app/auth/login/page.tsx`, `frontend/src/app/auth/callback/route.ts`, `frontend/src/app/auth/logout/route.ts`, `frontend/src/app/layout.tsx`

## Testing Requirements
- [ ] Unit tests for all functions
- [ ] Integration tests for workflows
- [ ] E2E tests for critical user journeys
- [ ] Performance tests if applicable

## Technical Notes
This task is part of Phase 1: Shared Foundation and must be completed according to the implementation plan specifications.

## Dependencies
None

## Labels
`implementation`, `phase-1`, `backend`, `frontend`

## Assignee
To be assigned

## Project Board
Phase 1 Column
