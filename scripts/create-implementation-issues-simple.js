#!/usr/bin/env node

/**
 * Simple Implementation Issue Creator
 * 
 * Creates issues based on predefined task lists from implementation plans
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  projectNumber: 6,
  owner: 'Mylesoft-Technologies',
  repo: 'edumyles'
};

// Predefined tasks from MVP Implementation Plan
const MVP_TASKS = [
  {
    title: "[MVP Week 1] Task 1.1: Fix Merge Conflicts in Portal Files",
    files: "convex/modules/portal/student/queries.ts, convex/modules/portal/student/mutations.ts, convex/modules/portal/parent/queries.ts, convex/modules/portal/parent/mutations.ts",
    implementation: "1. Review conflict markers in each file\n2. Identify correct implementation between HEAD and main branches\n3. Resolve conflicts preserving working functionality\n4. Test each resolved function individually\n5. Run full test suite to verify no regressions",
    outcome: "All merge conflicts resolved, Student and parent portal functions work correctly, No git conflict markers remain in codebase",
    priority: "high",
    week: 1
  },
  {
    title: "[MVP Week 1] Task 1.2: Fix Failing Authentication Tests",
    files: "frontend/src/test/auth-flow.test.ts",
    implementation: "1. Analyze failing test cases\n2. Review session management in convex/sessions.ts\n3. Fix token refresh logic in auth helpers\n4. Validate tenant isolation enforcement\n5. Run complete test suite",
    outcome: "All 12 authentication tests pass, Session management works reliably, Token refresh functions correctly, Cross-tenant data leaks prevented",
    priority: "high",
    week: 1
  },
  {
    title: "[MVP Week 1] Task 1.3: Student Enrollment Form",
    files: "frontend/src/app/admin/students/create/page.tsx",
    implementation: "1. Add comprehensive form validation\n2. Implement guardian relationship management\n3. Create admission number auto-generation\n4. Add file upload for student photos\n5. Integrate with backend createStudent mutation\n6. Add success/error handling with toast notifications",
    outcome: "Complete student enrollment form, Validated data submission, Guardian information captured, Automatic admission number assignment, Student photos stored and displayed",
    priority: "high",
    week: 1
  },
  {
    title: "[MVP Week 1] Task 1.4: Bulk Student Import",
    files: "frontend/src/app/admin/students/import/page.tsx",
    implementation: "1. Create CSV upload interface\n2. Implement CSV template download\n3. Add data validation for bulk import\n4. Show import preview with errors\n5. Process bulk import with progress tracking\n6. Handle duplicate admission numbers",
    outcome: "CSV bulk import functionality, Data validation and error reporting, Progress tracking for large imports, Duplicate handling logic",
    priority: "medium",
    week: 1
  },
  {
    title: "[MVP Week 1] Task 1.5: Fee Payment Interface",
    files: "frontend/src/app/portal/parent/fees/pay/page.tsx",
    implementation: "1. Display outstanding invoices for selected child\n2. Implement payment method selection (M-Pesa, Card, Bank)\n3. Integrate M-Pesa STK Push API\n4. Add payment status tracking\n5. Create receipt generation\n6. Handle payment failures and retries",
    outcome: "Working fee payment interface, M-Pesa integration functional, Payment status tracking, Receipt generation and display",
    priority: "high",
    week: 1
  },
  {
    title: "[MVP Week 2] Task 2.1: Grade Entry Interface",
    files: "frontend/src/app/(portal)/teacher/classes/[classId]/grades/page.tsx",
    implementation: "1. Create spreadsheet-like grade entry interface\n2. Populate with students in selected class\n3. Add subject and term selection\n4. Implement grade validation (A-F, 0-100)\n5. Add bulk grade save functionality\n6. Create grade calculation logic (averages, GPA)",
    outcome: "Intuitive grade entry interface, Real-time grade calculations, Bulk grade operations, Grade validation and error prevention",
    priority: "high",
    week: 2
  },
  {
    title: "[MVP Week 2] Task 2.2: Gradebook Dashboard",
    files: "frontend/src/app/(portal)/teacher/gradebook/page.tsx",
    implementation: "1. Create comprehensive gradebook view\n2. Filter by class, subject, term\n3. Show class performance statistics\n4. Add individual student grade details\n5. Export gradebook functionality\n6. Grade trend analysis",
    outcome: "Complete gradebook dashboard, Performance analytics, Export capabilities, Historical grade tracking",
    priority: "medium",
    week: 2
  },
  {
    title: "[MVP Week 2] Task 2.3: Assignment Creation",
    files: "frontend/src/app/(portal)/teacher/assignments/create/page.tsx",
    implementation: "1. Create assignment creation form\n2. Add file attachment support\n3. Set due dates and submission guidelines\n4. Assign to multiple classes\n5. Add rubric creation\n6. Schedule assignment publishing",
    outcome: "Comprehensive assignment creation, File attachment support, Flexible scheduling, Rubric integration",
    priority: "high",
    week: 2
  },
  {
    title: "[MVP Week 2] Task 2.4: Assignment Submission & Grading",
    files: "frontend/src/app/(portal)/student/assignments/[assignmentId]/page.tsx, frontend/src/app/(portal)/teacher/assignments/[assignmentId]/submissions/page.tsx",
    implementation: "1. Student submission interface with file upload\n2. Submission status tracking\n3. Teacher grading interface with rubric\n4. Feedback and annotation system\n5. Grade release scheduling\n6. Plagiarism detection integration",
    outcome: "Complete assignment submission flow, Efficient grading interface, Rich feedback capabilities, Academic integrity features",
    priority: "high",
    week: 2
  },
  {
    title: "[MVP Week 2] Task 2.5: Attendance Tracking",
    files: "frontend/src/app/(portal)/teacher/attendance/page.tsx",
    implementation: "1. Create attendance marking interface\n2. Class and date selection\n3. Bulk attendance marking (present/absent/late)\n4. Add attendance notes and reasons\n5. Attendance history tracking\n6. Attendance reporting and analytics",
    outcome: "Efficient attendance marking, Comprehensive attendance records, Attendance analytics and reporting, Parent notification integration",
    priority: "medium",
    week: 2
  },
  {
    title: "[MVP Week 3] Task 3.1: Teacher Dashboard Enhancement",
    files: "frontend/src/app/(portal)/teacher/page.tsx",
    implementation: "1. Create comprehensive teacher dashboard\n2. Show today's classes and schedule\n3. Display pending grades and assignments\n4. Add student performance summaries\n5. Include attendance statistics\n6. Add quick action buttons",
    outcome: "Informative teacher dashboard, At-a-glance classroom insights, Quick access to common tasks, Performance metrics display",
    priority: "medium",
    week: 3
  },
  {
    title: "[MVP Week 3] Task 3.2: Class Management",
    files: "frontend/src/app/(portal)/teacher/classes/[classId]/page.tsx",
    implementation: "1. Create class overview page\n2. Student roster with photos\n3. Class performance metrics\n4. Recent activities and updates\n5. Quick links to grades, assignments, attendance\n6. Class announcements",
    outcome: "Complete class management interface, Student information at fingertips, Performance insights, Centralized class operations",
    priority: "medium",
    week: 3
  },
  {
    title: "[MVP Week 3] Task 3.3: Parent Dashboard",
    files: "frontend/src/app/(portal)/parent/page.tsx",
    implementation: "1. Create comprehensive parent dashboard\n2. Display all children's summaries\n3. Show fee balances and due dates\n4. Recent grades and attendance\n5. School announcements\n6. Quick payment links",
    outcome: "Informative parent dashboard, Multi-child overview, Financial status visibility, Academic progress tracking",
    priority: "high",
    week: 3
  },
  {
    title: "[MVP Week 3] Task 3.4: Child Progress Monitoring",
    files: "frontend/src/app/(portal)/parent/children/[studentId]/page.tsx",
    implementation: "1. Create detailed child progress view\n2. Grade trends and subject performance\n3. Attendance calendar visualization\n4. Assignment status and feedback\n5. Teacher communication history\n6. Fee payment status",
    outcome: "Comprehensive child progress tracking, Visual performance indicators, Communication history, Financial status integration",
    priority: "medium",
    week: 3
  },
  {
    title: "[MVP Week 3] Task 3.5: Student Portal Completion",
    files: "frontend/src/app/(portal)/student/page.tsx",
    implementation: "1. Create student dashboard with GPA\n2. Show upcoming assignments\n3. Display attendance percentage\n4. eWallet balance and transactions\n5. Recent grades and feedback\n6. School announcements",
    outcome: "Engaging student dashboard, Academic performance overview, Financial awareness, Assignment tracking",
    priority: "high",
    week: 3
  },
  {
    title: "[MVP Week 3] Task 3.6: Basic Communication System",
    files: "frontend/src/app/(portal)/parent/messages/page.tsx, frontend/src/app/admin/communications/page.tsx",
    implementation: "1. Create messaging interface\n2. Teacher-parent communication\n3. School-wide announcements\n4. Message templates\n5. Delivery tracking\n6. SMS/email integration",
    outcome: "Functional messaging system, School-wide announcements, Template-based communications, Multi-channel delivery",
    priority: "medium",
    week: 3
  },
  {
    title: "[MVP Week 4] Task 4.1: Finance Dashboard",
    files: "frontend/src/app/admin/finance/page.tsx",
    implementation: "1. Create comprehensive finance dashboard\n2. Revenue collection metrics\n3. Outstanding fees tracking\n4. Payment method analytics\n5. Class-wise fee collection\n6. Monthly/annual reporting",
    outcome: "Complete financial overview, Revenue tracking and analytics, Collection efficiency metrics, Comprehensive reporting",
    priority: "high",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.2: Fee Structure Management",
    files: "frontend/src/app/admin/finance/fees/page.tsx",
    implementation: "1. Create fee structure builder\n2. Class-wise fee configuration\n3. Term-based fee setup\n4. Discount and scholarship management\n5. Bulk fee adjustments\n6. Fee approval workflows",
    outcome: "Flexible fee structure management, Automated fee calculations, Discount and scholarship handling, Approval workflows",
    priority: "medium",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.3: Timetable Builder",
    files: "frontend/src/app/admin/timetable/page.tsx",
    implementation: "1. Create visual timetable builder\n2. Drag-and-drop scheduling\n3. Conflict detection (teacher, room, subject)\n4. Substitute teacher management\n5. Timetable publishing and sharing\n6. Export functionality",
    outcome: "Intuitive timetable creation, Automated conflict detection, Substitute management system, Multi-format timetable export",
    priority: "medium",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.4: HR Management Basics",
    files: "frontend/src/app/admin/hr/page.tsx",
    implementation: "1. Staff directory with profiles\n2. Contract management\n3. Leave request system\n4. Basic payroll calculations\n5. Performance tracking\n6. Staff communication",
    outcome: "Complete staff management, Contract and leave tracking, Basic payroll operations, Performance monitoring",
    priority: "low",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.5: Library Management",
    files: "frontend/src/app/admin/library/page.tsx",
    implementation: "1. Book catalog with search\n2. Borrow/return tracking\n3. Overdue management and fines\n4. Inventory management\n5. Library analytics\n6. Digital resource integration",
    outcome: "Complete library management, Automated circulation tracking, Fine calculation system, Comprehensive reporting",
    priority: "low",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.6: Comprehensive Testing",
    files: "Multiple test files",
    implementation: "1. Run complete test suite\n2. End-to-end user journey testing\n3. Performance optimization\n4. Security audit\n5. Load testing\n6. Cross-browser compatibility",
    outcome: "All tests passing, Performance optimized, Security audited, Cross-browser compatible",
    priority: "high",
    week: 4
  },
  {
    title: "[MVP Week 4] Task 4.7: Documentation & Deployment",
    files: "docs/, deployment scripts",
    implementation: "1. Update API documentation\n2. Create user guides\n3. Prepare deployment scripts\n4. Environment configuration\n5. Backup and recovery procedures\n6. Monitoring setup",
    outcome: "Complete documentation, Deployment prepared, Monitoring configured, Backup procedures ready",
    priority: "medium",
    week: 4
  }
];

/**
 * Create GitHub issue from task
 */
async function createIssue(task) {
  try {
    // Create issue body
    const body = `## Task Details\n\n` +
      `**Type**: MVP Implementation\n` +
      `**Week**: ${task.week}\n` +
      `**Priority**: ${task.priority}\n` +
      `**File(s)**: \`${task.files}\`\n\n` +
      
      `## Implementation Steps\n\n` +
      task.implementation + '\n\n' +
      
      `## Expected Outcome\n\n` +
      task.outcome + '\n\n' +
      
      `## Acceptance Criteria\n\n` +
      `- [ ] All implementation steps completed\n` +
      `- [ ] Code review approved\n` +
      `- [ ] Tests passing\n` +
      `- [ ] Documentation updated\n` +
      `- [ ] User acceptance verified\n\n` +
      
      `## Dependencies\n\n` +
      `- Previous week tasks completed\n` +
      `- Cross-team coordination if needed\n` +
      `- Backend API availability\n\n` +
      
      `## Notes\n\n` +
      `This task is part of the 4-week MVP implementation roadmap.\n` +
      `Refer to the MVP_IMPLEMENTATION_PLAN.md document for additional context.\n\n` +
      
      `---\n` +
      `*Automatically generated from MVP implementation plan*`;
    
    // Create issue using GitHub CLI
    const command = `gh issue create --repo ${CONFIG.owner}/${CONFIG.repo} --title "${task.title}" --body "${body}" --label "mvp,implementation,week-${task.week},priority-${task.priority}" --json number,url`;
    
    const result = execSync(command, { encoding: 'utf8' });
    const issue = JSON.parse(result);
    
    console.log(`✅ Created issue #${issue.number}: ${task.title}`);
    
    // Add to project board
    try {
      execSync(`gh project item-add ${CONFIG.projectNumber} --owner ${CONFIG.owner} --url ${issue.url}`, { encoding: 'utf8' });
      console.log(`📋 Added issue #${issue.number} to project board`);
    } catch (error) {
      console.log(`⚠️ Could not add issue to project board: ${error.message}`);
    }
    
    return issue;
    
  } catch (error) {
    console.error(`❌ Failed to create issue for ${task.title}:`, error.message);
    return null;
  }
}

/**
 * Create all MVP issues
 */
async function createAllIssues() {
  console.log('🚀 Creating MVP implementation issues...\n');
  
  console.log(`📊 Total tasks to process: ${MVP_TASKS.length}`);
  console.log(`📋 Week 1: ${MVP_TASKS.filter(t => t.week === 1).length} tasks`);
  console.log(`📋 Week 2: ${MVP_TASKS.filter(t => t.week === 2).length} tasks`);
  console.log(`📋 Week 3: ${MVP_TASKS.filter(t => t.week === 3).length} tasks`);
  console.log(`📋 Week 4: ${MVP_TASKS.filter(t => t.week === 4).length} tasks\n`);
  
  const createdIssues = [];
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < MVP_TASKS.length; i++) {
    const task = MVP_TASKS[i];
    
    console.log(`[${i + 1}/${MVP_TASKS.length}] Processing: ${task.title}`);
    
    const issue = await createIssue(task);
    if (issue) {
      createdIssues.push(issue);
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n🎉 MVP Issue Creation Complete!');
  console.log(`✅ Successfully created: ${successCount} issues`);
  console.log(`❌ Failed to create: ${failureCount} issues`);
  console.log(`📋 Project board: https://github.com/orgs/Mylesoft-Technologies/projects/6`);
  
  return { successCount, failureCount, createdIssues };
}

/**
 * Link existing issues to project board
 */
async function linkExistingIssues() {
  console.log('\n🔗 Linking existing issues to project board...');
  
  try {
    // Get existing issues
    const issuesOutput = execSync(`gh issue list --repo ${CONFIG.owner}/${CONFIG.repo} --limit 100 --json number,title,labels`, { encoding: 'utf8' });
    const issues = JSON.parse(issuesOutput);
    
    let linkedCount = 0;
    
    for (const issue of issues) {
      try {
        execSync(`gh project item-add ${CONFIG.projectNumber} --owner ${CONFIG.owner} --url https://github.com/${CONFIG.owner}/${CONFIG.repo}/issues/${issue.number}`, { encoding: 'utf8' });
        console.log(`📋 Linked issue #${issue.number}: ${issue.title}`);
        linkedCount++;
      } catch (error) {
        // Issue might already be on board
        console.log(`⚠️ Issue #${issue.number} already on board or failed to link`);
      }
    }
    
    console.log(`✅ Linked ${linkedCount} existing issues to project board`);
    
  } catch (error) {
    console.error('❌ Failed to link existing issues:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      await createAllIssues();
      break;
      
    case 'link':
      await linkExistingIssues();
      break;
      
    case 'all':
      await createAllIssues();
      await linkExistingIssues();
      break;
      
    default:
      console.log(`
EduMyles MVP Implementation Issue Creator

Usage:
  node scripts/create-implementation-issues-simple.js create    Create MVP implementation issues
  node scripts/create-implementation-issues-simple.js link      Link existing issues to project board
  node scripts/create-implementation-issues-simple.js all       Create issues and link existing ones

This script will:
1. Create 22 comprehensive MVP implementation issues
2. Add all issues to the project board
3. Link existing repository issues to the project board

Project Board: https://github.com/orgs/Mylesoft-Technologies/projects/6
      `);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createAllIssues,
  linkExistingIssues,
  MVP_TASKS
};
