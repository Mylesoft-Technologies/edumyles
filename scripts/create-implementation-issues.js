#!/usr/bin/env node

/**
 * Create Implementation Issues from Plans
 * 
 * This script extracts all tasks from both implementation plans and creates
 * comprehensive GitHub issues for the project board.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  projectNumber: 6,
  owner: 'Mylesoft-Technologies',
  repo: 'edumyles',
  issuesDir: path.join(__dirname, '..', '.github', 'generated-issues'),
  implementationPlanPath: path.join(__dirname, '..', 'docs', 'IMPLEMENTATION_PLAN.md'),
  mvpPlanPath: path.join(__dirname, '..', 'docs', 'MVP_IMPLEMENTATION_PLAN.md')
};

// Task extraction patterns
const TASK_PATTERNS = {
  phase: /### Phase (\d+): (.+)/g,
  task: /#### Task (\d+\.\d+): (.+)/g,
  mvpTask: /#### Task (\d+\.\d+): (.+)/g,
  file: /\*\*File:\*\* `([^`]+)`/g,
  implementation: /\*\*Implementation Steps:\*\*/g,
  outcome: /\*\*Expected Outcome:\*\*/g
};

/**
 * Extract tasks from implementation plan
 */
function extractImplementationTasks() {
  console.log('📋 Extracting tasks from Implementation Plan...');
  
  const content = fs.readFileSync(CONFIG.implementationPlanPath, 'utf8');
  const tasks = [];
  
  // Extract phases and their tasks
  let phaseMatch;
  const phaseRegex = /### Phase (\d+): (.+?)\n\n(.*?)(?=### Phase \d+|### \*\*Phase \d+\*\*|$)/gs;
  
  while ((phaseMatch = phaseRegex.exec(content)) !== null) {
    const phaseNumber = parseInt(phaseMatch[1]);
    const phaseTitle = phaseMatch[2];
    const phaseContent = phaseMatch[3];
    
    // Extract tasks from this phase
    const taskRegex = /#### (Task \d+\.\d+: .+?)\n\n(.*?)(?=####|###|$)/gs;
    let taskMatch;
    
    while ((taskMatch = taskRegex.exec(phaseContent)) !== null) {
      const taskTitle = taskMatch[1];
      const taskContent = taskMatch[2];
      
      // Extract file paths
      const fileMatch = taskContent.match(/\*\*File:\*\* `([^`]+)`/);
      const filePath = fileMatch ? fileMatch[1] : 'Multiple files';
      
      // Extract implementation steps
      const implementationMatch = taskContent.match(/\*\*Implementation Steps:\*\*\n([\s\S]*?)\n\n\*\*Expected Outcome/);
      const implementation = implementationMatch ? implementationMatch[1].trim() : '';
      
      // Extract expected outcome
      const outcomeMatch = taskContent.match(/\*\*Expected Outcome:\*\*\n([\s\S]*?)(?=####|###|$)/);
      const outcome = outcomeMatch ? outcomeMatch[1].trim() : '';
      
      tasks.push({
        title: `[Phase ${phaseNumber}] ${taskTitle}`,
        phase: phaseNumber,
        phaseTitle,
        filePath,
        implementation,
        outcome,
        type: 'implementation',
        priority: phaseNumber <= 3 ? 'high' : phaseNumber <= 7 ? 'medium' : 'low'
      });
    }
  }
  
  console.log(`✅ Extracted ${tasks.length} tasks from Implementation Plan`);
  return tasks;
}

/**
 * Extract tasks from MVP implementation plan
 */
function extractMVPTasks() {
  console.log('📋 Extracting tasks from MVP Implementation Plan...');
  
  const content = fs.readFileSync(CONFIG.mvpPlanPath, 'utf8');
  const tasks = [];
  
  // Extract MVP tasks by week
  const weekRegex = /### Day (\d+-?\d*): (.+?)\n\n(.*?)(?=### Day \d+|### 🎯 Week \d+|$)/gs;
  let weekMatch;
  
  while ((weekMatch = weekRegex.exec(content)) !== null) {
    const dayInfo = weekMatch[1];
    const taskTitle = weekMatch[2];
    const taskContent = weekMatch[3];
    
    // Extract file paths
    const fileMatch = taskContent.match(/\*\*File:\*\* `([^`]+)`/);
    const filePath = fileMatch ? fileMatch[1] : 'Multiple files';
    
    // Extract implementation steps
    const implementationMatch = taskContent.match(/\*\*Implementation Steps:\*\*\n([\s\S]*?)\n\n\*\*Expected Outcome/);
    const implementation = implementationMatch ? implementationMatch[1].trim() : '';
    
    // Extract expected outcome
    const outcomeMatch = taskContent.match(/\*\*Expected Outcome:\*\*\n([\s\S]*?)(?=####|###|$)/);
    const outcome = outcomeMatch ? outcomeMatch[1].trim() : '';
    
    // Determine week from day info
    const weekNumber = dayInfo.includes('1-2') || dayInfo.includes('1') ? 1 :
                      dayInfo.includes('3-4') || dayInfo.includes('3') ? 2 :
                      dayInfo.includes('5') ? 3 : 4;
    
    tasks.push({
      title: `[MVP Week ${weekNumber}] ${taskTitle}`,
      week: weekNumber,
      dayInfo,
      filePath,
      implementation,
      outcome,
      type: 'mvp',
      priority: weekNumber <= 2 ? 'high' : 'medium'
    });
  }
  
  console.log(`✅ Extracted ${tasks.length} tasks from MVP Implementation Plan`);
  return tasks;
}

/**
 * Create GitHub issue from task
 */
async function createIssue(task) {
  try {
    // Create issue body
    const body = `## Task Details\n\n` +
      `**Type**: ${task.type === 'mvp' ? 'MVP Implementation' : 'Phase Implementation'}\n` +
      `**Priority**: ${task.priority}\n` +
      `**File(s)**: \`${task.filePath}\`\n\n` +
      
      `## Implementation Steps\n\n` +
      (task.implementation || 'Implementation steps to be defined.') + '\n\n' +
      
      `## Expected Outcome\n\n` +
      (task.outcome || 'Expected outcomes to be defined.') + '\n\n' +
      
      `## Acceptance Criteria\n\n` +
      `- [ ] All implementation steps completed\n` +
      `- [ ] Code review approved\n` +
      `- [ ] Tests passing\n` +
      `- [ ] Documentation updated\n` +
      `- [ ] User acceptance verified\n\n` +
      
      `## Dependencies\n\n` +
      `- Related implementation plan tasks\n` +
      `- Cross-team coordination if needed\n\n` +
      
      `## Notes\n\n` +
      `This task is part of the EduMyles implementation roadmap.\n` +
      `Refer to the implementation plan documents for additional context.\n\n` +
      
      `---\n` +
      `*Automatically generated from implementation plan*`;
    
    // Create issue using GitHub CLI
    const command = `gh issue create --repo ${CONFIG.owner}/${CONFIG.repo} --title "${task.title}" --body "${body}" --label "implementation,${task.type},priority-${task.priority}" --json number,url`;
    
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
 * Create all issues and add to project board
 */
async function createAllIssues() {
  console.log('🚀 Creating implementation issues from plans...\n');
  
  // Ensure issues directory exists
  if (!fs.existsSync(CONFIG.issuesDir)) {
    fs.mkdirSync(CONFIG.issuesDir, { recursive: true });
  }
  
  // Extract tasks from both plans
  const implementationTasks = extractImplementationTasks();
  const mvpTasks = extractMVPTasks();
  
  // Combine all tasks
  const allTasks = [...implementationTasks, ...mvpTasks];
  
  console.log(`\n📊 Total tasks to process: ${allTasks.length}`);
  console.log(`- Implementation Plan: ${implementationTasks.length} tasks`);
  console.log(`- MVP Plan: ${mvpTasks} tasks\n`);
  
  // Create issues for each task
  const createdIssues = [];
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    
    console.log(`\n[${i + 1}/${allTasks.length}] Processing: ${task.title}`);
    
    const issue = await createIssue(task);
    if (issue) {
      createdIssues.push(issue);
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save summary
  const summary = {
    generated: new Date().toISOString(),
    totalTasks: allTasks.length,
    successCount,
    failureCount,
    implementationTasks: implementationTasks.length,
    mvpTasks: mvpTasks.length,
    createdIssues: createdIssues.map(issue => ({
      number: issue.number,
      url: issue.url
    }))
  };
  
  const summaryPath = path.join(CONFIG.issuesDir, 'implementation-issues-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('\n🎉 Issue Creation Complete!');
  console.log(`✅ Successfully created: ${successCount} issues`);
  console.log(`❌ Failed to create: ${failureCount} issues`);
  console.log(`📊 Summary saved to: ${summaryPath}`);
  console.log(`📋 Project board: https://github.com/orgs/Mylesoft-Technologies/projects/6`);
  
  return summary;
}

/**
 * Link existing issues to project board
 */
async function linkExistingIssues() {
  console.log('\n🔗 Linking existing issues to project board...');
  
  try {
    // Get existing issues
    const issuesOutput = execSync(`gh issue list --repo ${CONFIG.owner}/${CONFIG.repo} --limit 50 --json number,title`, { encoding: 'utf8' });
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
EduMyles Implementation Issue Creator

Usage:
  node scripts/create-implementation-issues.js create    Create issues from implementation plans
  node scripts/create-implementation-issues.js link      Link existing issues to project board
  node scripts/create-implementation-issues.js all       Create issues and link existing ones

This script will:
1. Extract all tasks from IMPLEMENTATION_PLAN.md and MVP_IMPLEMENTATION_PLAN.md
2. Create comprehensive GitHub issues for each task
3. Add all issues to the project board
4. Link existing issues to the project board

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
  extractImplementationTasks,
  extractMVPTasks
};
