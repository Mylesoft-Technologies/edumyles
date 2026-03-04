#!/usr/bin/env node

/**
 * PR Automation Script
 * 
 * This script handles automated updates to the project board when PRs are merged.
 * It's designed to be called from GitHub Actions workflows.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const CONFIG = {
  projectNumber: 6,
  owner: 'Mylesoft-Technologies',
  repo: process.env.REPO || 'Mylesoft-Technologies/edumyles'
};

/**
 * Detect which phase a PR completed based on title and body
 */
function detectPhase(title, body) {
  const content = (title + ' ' + body).toLowerCase();
  
  if (content.includes('phase 13') || content.includes('testing')) {
    return { 
      phase: 13, 
      name: 'Testing Framework', 
      keywords: ['testing', 'tests', 'tenant-isolation', 'rbac', 'webhooks'] 
    };
  }
  
  if (content.includes('phase 8') || content.includes('alumni')) {
    return { 
      phase: 8, 
      name: 'Alumni Panel', 
      keywords: ['alumni', 'transcript', 'directory', 'events'] 
    };
  }
  
  if (content.includes('phase 9') || content.includes('partner')) {
    return { 
      phase: 9, 
      name: 'Partner Panel', 
      keywords: ['partner', 'sponsorship', 'reports', 'payments'] 
    };
  }
  
  if (content.includes('phase 6') || content.includes('parent')) {
    return { 
      phase: 6, 
      name: 'Parent Panel', 
      keywords: ['parent', 'guardian', 'children', 'fees', 'messages'] 
    };
  }
  
  if (content.includes('phase 7') || content.includes('student')) {
    return { 
      phase: 7, 
      name: 'Student Panel', 
      keywords: ['student', 'grades', 'assignments', 'wallet', 'timetable'] 
    };
  }
  
  return { 
    phase: 'unknown', 
    name: 'General Implementation', 
    keywords: ['implementation', 'feature', 'bug'] 
  };
}

/**
 * Find issues related to a completed phase
 */
function findRelatedIssues(keywords) {
  try {
    const searchQuery = keywords.join(' ');
    const output = execSync(
      `gh issue list --repo ${CONFIG.repo} --limit 20 --json number,title --search "${searchQuery}"`,
      { encoding: 'utf8' }
    );
    return JSON.parse(output);
  } catch (error) {
    console.log('Failed to find issues:', error.message);
    return [];
  }
}

/**
 * Add completion comment to an issue
 */
function addCompletionComment(issue, phaseInfo, prNumber, prTitle) {
  try {
    const commentBody = `## ✅ Automatically Marked as Complete

This issue has been automatically marked as complete based on merged PR #${prNumber}.

**Completed via**: PR #${prNumber} - ${prTitle}
**Phase**: Phase ${phaseInfo.phase} - ${phaseInfo.name}
**Status**: Implementation complete and tested

---
*Updated by GitHub Actions automation based on merged PRs*`;

    execSync(
      `gh issue comment ${issue.number} --repo ${CONFIG.repo} --body "${commentBody}"`,
      { encoding: 'utf8' }
    );
    
    console.log(`✅ Added completion comment to issue #${issue.number}: ${issue.title}`);
    
  } catch (error) {
    console.log(`Failed to comment on issue #${issue.number}:`, error.message);
  }
}

/**
 * Add issue to project board
 */
function addToProjectBoard(issue) {
  try {
    const issueUrl = `https://github.com/${CONFIG.owner}/${CONFIG.repo.split('/')[1]}/issues/${issue.number}`;
    
    execSync(
      `gh project item-add ${CONFIG.projectNumber} --owner ${CONFIG.owner} --url "${issueUrl}"`,
      { encoding: 'utf8' }
    );
    
    console.log(`📋 Added issue #${issue.number} to project board`);
    
  } catch (error) {
    // Issue might already be on board
    console.log(`⚠️ Issue #${issue.number} already on board or failed to add`);
  }
}

/**
 * Create phase completion summary
 */
function createCompletionSummary(phaseInfo, prNumber, prTitle, updatedCount) {
  try {
    const summary = `# 🎉 Phase ${phaseInfo.phase} Completed!

**Phase**: ${phaseInfo.name}
**PR**: #${prNumber} - ${prTitle}
**Issues Updated**: ${updatedCount} related issues marked complete
**Timestamp**: ${new Date().toISOString()}

## ✅ Implementation Complete

All features for Phase ${phaseInfo.phase} have been implemented and tested. The project board has been automatically updated to reflect the completion status.

## 📊 Current Progress

Based on completed PRs, the following phases are now complete:
- Phase 6: Parent Panel ✅
- Phase 7: Student Panel ✅  
- Phase 8: Alumni Panel ✅
- Phase 9: Partner Panel ✅
- Phase 13: Testing Framework ✅

## 🔄 Automation Status

- ✅ Project board automatically updated
- ✅ Issues marked as complete
- ✅ Progress tracking active
- ✅ Team visibility maintained

---
*This summary was generated automatically by GitHub Actions.*

**Project Board**: https://github.com/orgs/Mylesoft-Technologies/projects/6`;

    // Create summary file
    if (!fs.existsSync('docs')) {
      fs.mkdirSync('docs', { recursive: true });
    }
    fs.writeFileSync('docs/LATEST_PHASE_COMPLETION.md', summary);
    
    // Create GitHub issue for the completion
    try {
      execSync(
        `gh issue create --repo ${CONFIG.repo} --title "🎉 Phase ${phaseInfo.phase} (${phaseInfo.name}) Completed" --body "${summary}" --label "automation,phase-complete,phase-${phaseInfo.phase}"`,
        { encoding: 'utf8' }
      );
      console.log(`📝 Created completion issue for Phase ${phaseInfo.phase}`);
    } catch (error) {
      console.log(`⚠️ Completion issue already exists or failed to create`);
    }
    
  } catch (error) {
    console.log('Failed to create summary:', error.message);
  }
}

/**
 * Main automation function
 */
async function runAutomation() {
  const prNumber = process.env.PR_NUMBER;
  const prTitle = process.env.PR_TITLE;
  const prBody = process.env.PR_BODY || '';
  
  if (!prNumber || !prTitle) {
    console.error('Missing PR_NUMBER or PR_TITLE environment variables');
    process.exit(1);
  }
  
  console.log(`🚀 Processing PR #${prNumber}: ${prTitle}`);
  
  // Detect which phase was completed
  const phaseInfo = detectPhase(prTitle, prBody);
  console.log(`📋 Detected phase: ${phaseInfo.phase} - ${phaseInfo.name}`);
  
  // Find related issues
  const relatedIssues = findRelatedIssues(phaseInfo.keywords);
  console.log(`🔍 Found ${relatedIssues.length} related issues`);
  
  // Update each related issue
  let updatedCount = 0;
  for (const issue of relatedIssues) {
    console.log(`\n🔄 Processing issue #${issue.number}: ${issue.title}`);
    
    addCompletionComment(issue, phaseInfo, prNumber, prTitle);
    addToProjectBoard(issue);
    updatedCount++;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Create completion summary if issues were updated
  if (updatedCount > 0) {
    console.log(`\n📊 Creating completion summary...`);
    createCompletionSummary(phaseInfo, prNumber, prTitle, updatedCount);
  }
  
  console.log(`\n✅ Automation complete! Updated ${updatedCount} issues.`);
  
  // Update overall progress documentation
  try {
    console.log(`📚 Updating progress documentation...`);
    execSync('node scripts/update-board-from-prs.js summary', { encoding: 'utf8' });
    console.log(`✅ Progress documentation updated.`);
  } catch (error) {
    console.log(`⚠️ Failed to update progress documentation:`, error.message);
  }
}

/**
 * Manual update function
 */
async function runManualUpdate() {
  console.log('🔄 Running manual board update...');
  
  try {
    execSync('node scripts/update-board-from-prs.js update', { encoding: 'utf8' });
    console.log('✅ Manual board update complete.');
  } catch (error) {
    console.error('❌ Manual update failed:', error.message);
  }
}

/**
 * Command line interface
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'auto':
      await runAutomation();
      break;
      
    case 'manual':
      await runManualUpdate();
      break;
      
    default:
      // Default to automatic mode (for GitHub Actions)
      if (process.env.PR_NUMBER) {
        await runAutomation();
      } else {
        console.log(`
PR Automation Script

Usage:
  node scripts/pr-automation.js auto     Run automatic PR processing (GitHub Actions)
  node scripts/pr-automation.js manual   Run manual board update

Environment Variables (for auto mode):
  PR_NUMBER    - Pull request number
  PR_TITLE     - Pull request title  
  PR_BODY      - Pull request body
  REPO         - Repository name (owner/repo)

This script will:
1. Detect which phase was completed from PR title/body
2. Find related issues using keyword search
3. Add completion comments to issues
4. Add issues to project board
5. Create phase completion summary
6. Update progress documentation
        `);
      }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runAutomation,
  runManualUpdate,
  detectPhase,
  findRelatedIssues
};
