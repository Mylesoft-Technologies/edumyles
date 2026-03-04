#!/usr/bin/env node

/**
 * Populate Project Board with Issues
 * 
 * This script adds the generated issues to the GitHub project board
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  projectId: 'PVT_kwDODSjJ2c4BQxFH',
  owner: 'Mylesoft-Technologies',
  repo: 'edumyles'
};

async function addIssuesToBoard() {
  console.log('🚀 Adding issues to project board...');
  
  try {
    // Get all generated issue files
    const issuesDir = path.join(__dirname, '..', '.github', 'generated-issues');
    const issueFiles = fs.readdirSync(issuesDir).filter(file => file.endsWith('.md'));
    
    console.log(`Found ${issueFiles.length} issue files to process`);
    
    // Process first 10 issues as a demo
    const demoFiles = issueFiles.slice(0, 10);
    
    for (const file of demoFiles) {
      const filePath = path.join(issuesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from markdown
      const titleMatch = content.match(/^# (.+)$/m);
      if (!titleMatch) continue;
      
      const title = titleMatch[1];
      const body = content.replace(/^# .+$/m, '').trim();
      
      console.log(`Creating issue: ${title}`);
      
      try {
        // Create the issue
        const result = execSync(
          `gh issue create --title "${title}" --body "${body}" --repo ${CONFIG.owner}/${CONFIG.repo} --label "automated,implementation" --json number,url`,
          { encoding: 'utf8' }
        );
        
        const issue = JSON.parse(result);
        console.log(`✅ Created issue #${issue.number}: ${issue.url}`);
        
        // Add issue to project board
        execSync(
          `gh project item-add ${CONFIG.projectId} --owner ${CONFIG.owner} --issue ${issue.number}`,
          { encoding: 'utf8' }
        );
        
        console.log(`📋 Added issue #${issue.number} to project board`);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to create issue for ${file}:`, error.message);
      }
    }
    
    console.log('\n✅ Demo complete! Added first 10 issues to the project board.');
    console.log(`📊 View the project board: https://github.com/orgs/Mylesoft-Technologies/projects/6`);
    
  } catch (error) {
    console.error('❌ Failed to populate board:', error.message);
  }
}

// Run the script
if (require.main === module) {
  addIssuesToBoard();
}

module.exports = { addIssuesToBoard };
