# EduMyles — Project Documentation

This folder contains all core project documentation for the EduMyles platform.

---

## 📄 Documents

### Root
| File | Description |
|------|-------------|
| [`01_PRD.pdf`](./01_PRD.pdf) | Product Requirements Document — full feature requirements, user stories, and success metrics |
| [`05_Feature_Specification.pdf`](./05_Feature_Specification.pdf) | Detailed feature specifications for all 12 modules |

### `/architecture`
| File | Description |
|------|-------------|
| [`02_System_Architecture.pdf`](./architecture/02_System_Architecture.pdf) | System architecture — tech stack, multi-tenancy, offline strategy, payment flows, CI/CD |
| [`03_Database_Design.pdf`](./architecture/03_Database_Design.pdf) | Full Convex database schema — all tables, indexes, relationships |

### `/api`
| File | Description |
|------|-------------|
| [`04_API_Specification.pdf`](./api/04_API_Specification.pdf) | Complete API specification — all Convex queries, mutations, actions, and HTTP endpoints |

### `/guides`
| File | Description |
|------|-------------|
| [`User_Flows.pdf`](./guides/User_Flows.pdf) | End-to-end user flow diagrams for all 12 roles |
| [`Agent_Build_Prompt.md`](./guides/Agent_Build_Prompt.md) | AI agent build prompt — full platform context for LLM-assisted development |
| [`Agent_Action_Plan.md`](./guides/Agent_Action_Plan.md) | Prioritised implementation action plan with file-level task breakdown |

### `/compliance`
| File | Description |
|------|-------------|
| [`Pricing_Guide.pdf`](./compliance/Pricing_Guide.pdf) | Subscription tiers, pricing model, and feature access matrix |

---

## 🗂️ Reading Order

If you're new to the project, read in this order:

1. **PRD** — understand what we're building and why
2. **System Architecture** — understand how it's built
3. **Database Design** — understand the data model
4. **API Specification** — understand the backend surface area
5. **Feature Specification** — understand module-level detail
6. **User Flows** — understand how users move through the system
7. **Agent Action Plan** — understand what to build next and in what order

---

> 📌 These documents are the source of truth for EduMyles.  
> All code must conform to the architecture and data models defined here.  
> If you find a discrepancy between code and docs, raise it as an issue.
