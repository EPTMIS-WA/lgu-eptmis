# EPTMIS-WA User Manual

Employee Progress Tracking Management Information System, or EPTMIS-WA, is the official web application for tracking LGU employee assignments, department workflows, task approvals, accomplishment reports, and Individual Performance Commitment and Review (IPCR) records.

This manual explains how each user role should use the system during daily operations.

## Table of Contents

- [Getting Started](#getting-started)
- [Quick Start by Role](#quick-start-by-role)
- [User Roles](#user-roles)
- [Dashboard](#dashboard)
- [Tasks](#tasks)
- [Daily Workflow Checklist](#daily-workflow-checklist)
- [Admin Guide](#admin-guide)
- [Mayor Guide](#mayor-guide)
- [Department Head Guide](#department-head-guide)
- [Employee Guide](#employee-guide)
- [IPCR Guide](#ipcr-guide)
- [Reports](#reports)
- [Notifications](#notifications)
- [Offline and Sync Status](#offline-and-sync-status)
- [Account and Profile Settings](#account-and-profile-settings)
- [Common Issues](#common-issues)
- [System Information Summary](#system-information-summary)

## Getting Started

Open the EPTMIS-WA portal in a browser:

```text
https://portal.lgu-eptmis.com
```

For local office deployments, use the local address provided by the system administrator.

### Sign In

1. Open the login page.
2. Enter your username and password.
3. Select **Sign In**.
4. The system opens the dashboard that matches your assigned role.

If the login fails, check that the username and password are correct. If the account is locked, inactive, missing a role, or assigned to the wrong department, contact the system administrator.

### Sign Out

Use the account menu or logout button before leaving a shared workstation.

## Quick Start by Role

Use this section when you only need to know where to begin.

| Role | Start Here | Do First |
| --- | --- | --- |
| Admin | Dashboard, Manage Users, Manage Departments, Manage Tasks | Confirm users and departments are correct before creating or reviewing organization-wide records. |
| Mayor | Dashboard, View Departments, View Tasks, Executive IPCR | Review department performance, task status, reports, and audited IPCR forms ready for executive action. |
| Department Head | Dashboard, Manage Users, Department Tasks, Team Reviews | Check pending clearances, department tasks, employee submissions, and department-scoped records. |
| Employee | My Tasks, My IPCR, My Reports, Notifications | Review assignments, submit required progress, upload proof of work, and check returned items. |

## Daily Workflow Checklist

For normal office use, follow this order:

1. Sign in and check the dashboard.
2. Open notifications for new assignments, returned work, approvals, or IPCR updates.
3. Review tasks by urgency, deadline, status, and priority.
4. Submit progress or review submitted work before handling lower-priority records.
5. Check reports only after filters are set to the correct date, department, employee, year, period, or status.
6. Confirm sync status before assuming cloud backup or cross-site updates are complete.

## User Roles

EPTMIS-WA uses role-based access. Each user only sees the pages and records allowed for their role.

| Role | Main Responsibility |
| --- | --- |
| Admin | Manages users, departments, tasks, reports, IPCR periods, HRMO-style IPCR audits, and system-wide monitoring. |
| Mayor | Reviews organization-wide progress, monitors department performance, and performs executive IPCR approval. |
| Department Head | Manages department work, reviews assignments, evaluates employee submissions, and rates department IPCR forms. |
| Employee | Receives assigned tasks, submits progress, uploads proof of work, checks notifications, and manages personal IPCR records. |

The active sidebar and route access are role-specific:

- Admin sees user management, department management, task management, task templates, IPCR management, reports, and settings.
- Mayor sees department viewing, task viewing, IPCR executive review, reports, and settings.
- Department Head sees department-scoped user management, department tasks, task templates, IPCR team reviews, department reports, and settings.
- Employee sees personal tasks, personal IPCR, personal reports, and settings.

## Dashboard

The dashboard is the first page after sign-in.

Use it to review:

- Total, pending, in-progress, for-approval, completed, failed, and reassigned tasks.
- Department or personal productivity indicators.
- Recent activity and upcoming work.
- Task status charts and performance summaries.
- IPCR and report summaries when available for your role.

Dashboard results may change when a date, month, department, or employee filter is selected.

## Tasks

Tasks are the main work records in the system.

### Task Statuses

| Status | Meaning |
| --- | --- |
| Pending | The task has been created but is not yet active for all assignees. |
| In Progress | Assignees may work on the task and submit progress. |
| For Approval | Submitted work is waiting for final review. |
| Completed | The task creator approved the submitted work. |
| Reassignment | The task needs changes, clarification, or reassignment. |
| Fail | The task was marked failed or not accepted. |

### Create a Task

Admin, Mayor, and Department Head users can create tasks.

1. Open the task page.
2. Select the create/add task action.
3. Enter the title, description, priority, deadline, and department details.
4. Select one or more assignees.
5. Attach reference files when needed.
6. Save the task.

If an assignee belongs to another department, the task may require department-head clearance before it becomes active.

Mayor-created tasks are restricted to active Department Heads or active employees under the Mayor's office.

### Review a Cross-Department Assignment

Department Heads review assignments that involve employees in their department.

1. Open the task review or task details page.
2. Check the task description, deadline, creator, and assignees.
3. Approve the assignment if the employee can accept the work.
4. Reject or return the assignment if it needs correction.

### Submit Task Progress

Employees submit progress from the task details page.

1. Open the assigned task.
2. Review the instructions and deadline.
3. Enter progress notes or accomplishment details.
4. Upload proof of work or output files if required.
5. Submit the progress.

When all required assignees have submitted progress, the task can move to **For Approval**.

### Approve, Reject, or Reassign Work

The task creator or authorized reviewer checks submitted work.

- Select **Approve** when the work is complete and acceptable.
- Select **Reject** when the work is not acceptable and must return to progress.
- Select **Reassign** when another employee or updated assignment is needed.

Task history and file actions are recorded in audit logs.

## Admin Guide

Admins manage the core records used by the organization.

### Manage Users

Use **Manage Users** to:

- Create user accounts.
- Assign roles.
- Link users to employee profiles.
- Update names, email addresses, departments, and account status.
- Reset or update account information when needed.

Use the correct role and department assignment. Incorrect role setup can expose the wrong pages or hide required workflows.

Department Heads also have access to **Manage Users**, but their access is department-scoped. They can see their own account and employee accounts in departments they manage. They cannot change system roles or move employees between departments.

### Manage Employees

Use employee management to maintain personnel records used in task assignment, reporting, dashboard filters, and IPCR forms.

Keep employee profile details current, especially department, position, and account linkage.

### Manage Departments

Use department management to:

- Create and update department records.
- Assign or update department heads.
- Keep department names consistent for reporting.

### Monitor Tasks

Admins can review organization-wide tasks, progress, approvals, and audit trails. Use filters to narrow records by department, employee, status, priority, or date.

### Manage IPCR Periods and Audit

Admins open IPCR rating periods and handle the HRMO-style audit stage before forms move to executive approval.

## Mayor Guide

The Mayor account is intended for executive monitoring and approval.

Use it to:

- View organization-wide dashboard metrics.
- Monitor department performance.
- Review task and report summaries.
- Review IPCR forms that already passed the required audit stage.
- Perform final executive IPCR approval when the form is ready.

The Mayor role should focus on final review and oversight, not routine task data entry.

## Department Head Guide

Department Heads manage department-level work.

Use the department head dashboard to:

- Monitor department task progress.
- Check employee productivity.
- Review upcoming work and overdue items.
- Track activity inside the department.

Department Heads can also:

- Review assignments involving department employees.
- Check submitted task progress.
- Evaluate department IPCR forms.
- Use filtered user management for employee records in their managed departments.

## Employee Guide

Employees use EPTMIS-WA for assigned work and personal performance records.

### View Assigned Tasks

Open the task page or dashboard to see active assignments, deadlines, priorities, and task details.

### Submit Work

For each assigned task:

1. Read the task details.
2. Complete the work.
3. Add progress notes.
4. Upload required output files.
5. Submit progress before the deadline.

### Track Status

After submission, check whether the task is:

- Waiting for approval.
- Approved as completed.
- Rejected for revision.
- Reassigned.

### View Personal Reports

Employees can view reports available to their account, including accomplishment and IPCR-related reports.

## IPCR Guide

IPCR means Individual Performance Commitment and Review.

The IPCR workspace supports target commitments, accomplishment review, rating, audit, and approval.

Current implementation note: the frontend exposes IPCR workspaces for Employee, Department Head, Admin, and Mayor roles, but the backend currently allows non-read IPCR API actions only for Admin accounts. Until backend IPCR permissions are expanded, Employee, Department Head, and Mayor IPCR submit/rate/approve buttons may fail even when the page is visible.

### IPCR Pages

```text
/ipcr/my-form          Employee IPCR workspace
/ipcr/evaluations      Department Head/Admin evaluation queue
/ipcr/admin/manage     Admin rating period and audit workspace
/ipcr/executive        Mayor executive approval workspace
/reports/ipcr          IPCR report and printable form preview
```

### IPCR Status Flow

```text
DRAFT
TARGETS_SUBMITTED
TARGETS_APPROVED
ACCOMPLISHMENTS_SUBMITTED
RATED
HR_AUDITED
MAYOR_APPROVED
```

Forms may also be marked:

```text
RETURNED
```

### Employee IPCR Steps

1. Open **My IPCR**.
2. Review the active form, period, categories, and status.
3. Enter target commitment details where the form allows it.
4. Submit targets when the backend permission for employee IPCR submission is enabled.
5. After target approval, enter accomplishments.
6. Submit accomplishments when the backend permission for employee IPCR submission is enabled.
7. Review final rating results when available.

### Department Head IPCR Steps

1. Open the IPCR evaluation queue.
2. Select an employee form.
3. Review targets and accomplishments.
4. Enter quality, efficiency, and timeliness ratings.
5. Submit the evaluation when backend permission for Department Head IPCR rating is enabled.

### Admin IPCR Steps

1. Open or manage rating periods.
2. Review IPCR records by status, department, year, or period.
3. Audit forms that are ready for HRMO review.
4. Return forms that need correction.
5. Forward audited forms to executive approval.

### Mayor IPCR Steps

1. Open the executive IPCR workspace.
2. Review HR-audited forms.
3. Approve forms that are ready for final approval when backend permission for Mayor IPCR approval is enabled.

### IPCR Rating Scale

| Numerical Rating | Adjectival Rating |
| --- | --- |
| 4.50 and above | Outstanding |
| 3.50 to 4.49 | Very Satisfactory |
| 2.50 to 3.49 | Satisfactory |
| 1.50 to 2.49 | Unsatisfactory |
| Below 1.50 | Poor |

## Reports

Reports help offices monitor accomplishments, productivity, and IPCR status.

Available reports may include:

- Accomplishment reports.
- Department productivity reports.
- IPCR summary reports.
- Printable IPCR official form previews.

Use report filters such as date, department, employee, year, period, and status to narrow the result.

When exporting or printing, check the preview first to confirm that the selected filters and records are correct.

Report access is role-scoped:

- Admin and Mayor can review organization-wide accomplishment and productivity reports.
- Department Heads can review accomplishment and productivity reports for their managed department scope.
- Employees can review personal accomplishment reports and IPCR reports exposed to their account.
- Productivity reports are limited to Admin, Mayor, and Department Head accounts.

## Notifications

Notifications alert users about important system events, including:

- New task assignments.
- Assignment approvals or rejections.
- Submitted work.
- Task approval, rejection, or reassignment.
- IPCR updates.
- System events.

Open notifications regularly so pending work is not missed.

## Offline and Sync Status

EPTMIS-WA can run in a local-first office setup. This means the local Django server and local database can continue operating even when optional cloud services are unavailable.

The browser must still be able to reach the local server to save work.

The sync or connectivity banner may show:

- Whether the local API is reachable.
- Whether the cloud service is reachable.
- Whether there are pending sync records.
- Whether manual or automatic synchronization is running.

If the system is offline, continue using the local office portal when available. Pending records can synchronize when the cloud connection returns.

## Account and Profile Settings

Use settings to manage account-related options available to your role.

Depending on role permissions, settings may include:

- Profile information.
- Password change.
- Display preferences.
- System logo or organization settings.

Some profile information is managed through **Manage Users** and may not appear in settings for management roles.

## Common Issues

### I cannot sign in.

Check the username and password. If the problem continues, contact the administrator to verify that the account is active and assigned to the correct role.

### I cannot see a page.

The page may not be available for your role. Contact the administrator if your role or department assignment is wrong.

### I cannot submit a task.

Check that the task is assigned to you, is active, and is not already completed or waiting for another approval step.

### I cannot upload a file.

Check the file size, file type, and internet or local network connection. If the problem continues, contact the administrator.

### A dashboard or report looks incomplete.

Check the selected date, month, department, employee, year, period, and status filters. Filters can limit what appears on dashboards and reports.

### Sync shows pending records.

The local system may be waiting for cloud connectivity. Continue local work if the office server is available, then run or wait for synchronization when the connection returns.

## System Information Summary

EPTMIS-WA is built for LGU offices that need one accountable place for employee assignments, department task coordination, progress evidence, approval history, accomplishment reporting, and IPCR evaluation.

The system has a React/Vite frontend and a Django REST Framework backend. The frontend provides role-based dashboards, task screens, reports, notifications, and IPCR workspaces. The backend manages authentication, permissions, task workflow rules, IPCR workflow rules, audit logs, notifications, file uploads, and local-to-cloud synchronization.

The default operating model is local-first. The application can run on an office server with SQLite for local use, while optional PostgreSQL/Supabase synchronization and S3-compatible media storage can support cloud backup and media transfer.

Hosted deployment uses the public frontend at:

```text
https://portal.lgu-eptmis.com
```

The backend API is intended to run separately, commonly through:

```text
https://api.lgu-eptmis.com/api
```

Main technologies:

- React 19 with Vite
- Django 6 and Django REST Framework
- JWT authentication with HTTP-only cookies
- SQLite for local operation
- Optional PostgreSQL/Supabase cloud database
- Optional S3-compatible media storage
- Cloudflare Pages or Workers for the frontend
- Railway for the Django backend
