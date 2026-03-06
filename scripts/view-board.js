#!/usr/bin/env node

/**
 * View Project Board
 * 
 * Simple script to display the project board contents
 */

const { execSync } = require('child_process');

function viewProjectBoard() {
  console.log('📋 EduMyles Implementation Project Board\n');
  
  try {
    // Get project details
    const projectInfo = execSync(
      'gh project view 6 --owner Mylesoft-Technologies --json title,url,itemCount',
      { encoding: 'utf8' }
    );
    
    const project = JSON.parse(projectInfo);
    
    console.log(`📊 ${project.title}`);
    console.log(`🔗 ${project.url}`);
    console.log(`📝 ${project.itemCount} items\n`);
    
    // Get items in the project
    const items = execSync(
      'gh api graphql -f query=\'query { organization(login: "Mylesoft-Technologies") { projectV2(number: 6) { items(first: 20) { nodes { content { ... on Issue { title number url state } } } } } } }\'',
      { encoding: 'utf8' }
    );
    
    const data = JSON.parse(items);
    const projectItems = data.data.organization.projectV2.items.nodes;
    
    if (projectItems.length === 0) {
      console.log('No items found in project board');
      return;
    }
    
    console.log('📋 Issues in Project Board:\n');
    
    projectItems.forEach(item => {
      if (item.content) {
        const issue = item.content;
        const status = issue.state === 'OPEN' ? '🔴 Open' : '✅ Closed';
        console.log(`#${issue.number} ${issue.title} ${status}`);
        console.log(`   ${issue.url}\n`);
      }
    });
    
    console.log(`\n🎯 View the full project board: ${project.url}`);
    
  } catch (error) {
    console.error('❌ Failed to view project board:', error.message);
    
    // Fallback to simple URL display
    console.log('\n📋 Project Board Information:');
    console.log('🔗 URL: https://github.com/orgs/Mylesoft-Technologies/projects/6');
    console.log('📊 Title: EduMyles Implementation');
    console.log('👥 Organization: Mylesoft-Technologies');
  }
}

// Run the script
if (require.main === module) {
  viewProjectBoard();
}

module.exports = { viewProjectBoard };
