#!/usr/bin/env node

/**
 * EduMyles Project Board Automation
 * 
 * This script manages GitHub project boards, automatically updating task status
 * based on PR commits, issue closures, and other project events.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  projectName: 'EduMyles Implementation',
  owner: process.env.GITHUB_OWNER || 'Mylesoft-Technologies',
  repo: process.env.GITHUB_REPO || 'edumyles',
  token: process.env.GITHUB_TOKEN,
  projectId: process.env.GITHUB_PROJECT_ID || 'PVT_kwDODSjJ2c4BQxFH',
  projectNumber: 6,
  columns: {
    backlog: 'Todo',
    ready: 'Ready for Development',
    inProgress: 'In Progress',
    review: 'In Review',
    testing: 'Testing',
    done: 'Done',
    blocked: 'Blocked'
  }
};

// Phase and module tracking
const phaseMapping = {
  1: 'Shared Foundation',
  2: 'Module Marketplace', 
  3: 'Master Admin & Super Admin',
  4: 'School Admin Panel',
  5: 'Teacher Panel',
  6: 'Parent Panel',
  7: 'Student Panel',
  8: 'Alumni Panel',
  9: 'Partner Panel',
  10: 'Remaining Modules Backend',
  11: 'Payment Webhooks & Integrations',
  12: 'Admin Pages for Remaining Modules',
  13: 'Testing'
};

const moduleMapping = {
  sis: 'Student Information System',
  admissions: 'Admissions & Enrollment',
  academics: 'Academics & Gradebook',
  hr: 'HR & Payroll',
  finance: 'Fee & Finance',
  timetable: 'Timetable & Scheduling',
  library: 'Library Management',
  transport: 'Transport Management',
  communications: 'Communications',
  ewallet: 'eWallet',
  ecommerce: 'eCommerce'
};

/**
 * GitHub API helper functions
 */
class GitHubAPI {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://api.github.com';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GitHub API request failed: ${error.message}`);
      throw error;
    }
  }

  async getProjectBoard() {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/projects`);
  }

  async getProjectColumns(projectId) {
    return this.request(`/projects/${projectId}/columns`);
  }

  async getColumnCards(columnId) {
    return this.request(`/projects/columns/${columnId}/cards`);
  }

  async moveCard(cardId, columnId) {
    return this.request(`/projects/columns/cards/${cardId}/moves`, {
      method: 'POST',
      body: JSON.stringify({
        column_id: columnId,
        position: 'top'
      })
    });
  }

  async getIssue(issueNumber) {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${issueNumber}`);
  }

  async getPullRequest(pullNumber) {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/pulls/${pullNumber}`);
  }

  async getCommits(pullNumber) {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/pulls/${pullNumber}/commits`);
  }

  async createIssueComment(issueNumber, body) {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${issueNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body })
    });
  }

  async updateIssue(issueNumber, updates) {
    return this.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
}

/**
 * Project Board Manager
 */
class ProjectBoardManager {
  constructor() {
    this.github = new GitHubAPI(CONFIG.token);
    this.cache = new Map();
  }

  /**
   * Initialize project board if it doesn't exist
   */
  async initializeBoard() {
    console.log('🚀 Initializing project board...');
    
    try {
      const projects = await this.github.getProjectBoard();
      let project = projects.find(p => p.name === CONFIG.projectName);

      if (!project) {
        console.log('Creating new project board...');
        project = await this.github.request(`/repos/${CONFIG.owner}/${CONFIG.repo}/projects`, {
          method: 'POST',
          body: JSON.stringify({
            name: CONFIG.projectName,
            body: 'Automated project board for EduMyles implementation tracking'
          })
        });
      }

      // Setup columns
      const columns = await this.github.getProjectColumns(project.id);
      const existingColumns = columns.map(c => c.name);

      for (const [key, name] of Object.entries(CONFIG.columns)) {
        if (!existingColumns.includes(name)) {
          console.log(`Creating column: ${name}`);
          await this.github.request(`/projects/${project.id}/columns`, {
            method: 'POST',
            body: JSON.stringify({ name })
          });
        }
      }

      console.log('✅ Project board initialized');
      return project;
    } catch (error) {
      console.error('Failed to initialize project board:', error.message);
      throw error;
    }
  }

  /**
   * Get all cards from the project board
   */
  async getAllCards() {
    try {
      const project = await this.initializeBoard();
      const columns = await this.github.getProjectColumns(project.id);
      const allCards = new Map();

      for (const column of columns) {
        const cards = await this.github.getColumnCards(column.id);
        cards.forEach(card => {
          allCards.set(card.id, {
            ...card,
            columnName: column.name,
            columnId: column.id
          });
        });
      }

      return allCards;
    } catch (error) {
      console.error('Failed to get cards:', error.message);
      return new Map();
    }
  }

  /**
   * Move issue card to appropriate column based on status
   */
  async moveIssueCard(issueNumber, targetColumn) {
    try {
      const cards = await this.getAllCards();
      const project = await this.initializeBoard();
      const columns = await this.github.getProjectColumns(project.id);

      // Find the issue card
      let issueCard = null;
      for (const card of cards.values()) {
        if (card.content_url && card.content_url.includes(`/issues/${issueNumber}`)) {
          issueCard = card;
          break;
        }
      }

      if (!issueCard) {
        console.log(`Issue #${issueNumber} not found on project board`);
        return false;
      }

      // Find target column
      const targetColumnObj = columns.find(c => c.name === targetColumn);
      if (!targetColumnObj) {
        console.log(`Target column '${targetColumn}' not found`);
        return false;
      }

      // Move card if not already in target column
      if (issueCard.columnName !== targetColumn) {
        await this.github.moveCard(issueCard.id, targetColumnObj.id);
        console.log(`Moved issue #${issueNumber} to '${targetColumn}'`);
        
        // Add comment about the move
        await this.github.createIssueComment(issueNumber, 
          `🔄 **Automated Board Update**: Moved to '${targetColumn}' column`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to move issue #${issueNumber}:`, error.message);
      return false;
    }
  }

  /**
   * Analyze PR and update related issues
   */
  async processPullRequest(pullNumber) {
    console.log(`📋 Processing PR #${pullNumber}...`);
    
    try {
      const pr = await this.github.getPullRequest(pullNumber);
      const commits = await this.github.getCommits(pullNumber);

      // Extract issue numbers from PR title and body
      const issueNumbers = this.extractIssueNumbers(pr.title + ' ' + (pr.body || ''));

      if (issueNumbers.length === 0) {
        console.log('No issue numbers found in PR');
        return;
      }

      // Analyze commit messages for additional context
      const commitMessages = commits.map(c => c.commit.message).join('\n');
      const analysis = this.analyzeCommits(commitMessages);

      // Update each related issue
      for (const issueNumber of issueNumbers) {
        await this.updateIssueFromPR(issueNumber, pullNumber, pr, analysis);
      }

    } catch (error) {
      console.error(`Failed to process PR #${pullNumber}:`, error.message);
    }
  }

  /**
   * Extract issue numbers from text
   */
  extractIssueNumbers(text) {
    const matches = text.match(/#(\d+)/g);
    return matches ? [...new Set(matches.map(m => parseInt(m.slice(1))))] : [];
  }

  /**
   * Analyze commit messages for progress indicators
   */
  analyzeCommits(commitMessages) {
    const analysis = {
      filesAdded: 0,
      filesModified: 0,
      testsAdded: false,
      docsUpdated: false,
      backendChanges: false,
      frontendChanges: false,
      completionIndicators: []
    };

    // Count file changes and detect patterns
    const lines = commitMessages.split('\n');
    lines.forEach(line => {
      if (line.includes('feat:') || line.includes('fix:')) {
        analysis.filesModified++;
      }
      if (line.includes('test:') || line.includes('spec:')) {
        analysis.testsAdded = true;
      }
      if (line.includes('docs:')) {
        analysis.docsUpdated = true;
      }
      if (line.includes('backend') || line.includes('convex/')) {
        analysis.backendChanges = true;
      }
      if (line.includes('frontend') || line.includes('src/')) {
        analysis.frontendChanges = true;
      }
      if (line.includes('complete') || line.includes('finish') || line.includes('implement')) {
        analysis.completionIndicators.push(line.trim());
      }
    });

    return analysis;
  }

  /**
   * Update issue based on PR analysis
   */
  async updateIssueFromPR(issueNumber, pullNumber, pr, analysis) {
    try {
      const issue = await this.github.getIssue(issueNumber);
      
      // Determine appropriate column based on PR status and analysis
      let targetColumn = CONFIG.columns.backlog;

      if (pr.state === 'merged') {
        // Check if this looks like completion
        if (analysis.completionIndicators.length > 0 || 
            (analysis.testsAdded && analysis.docsUpdated)) {
          targetColumn = CONFIG.columns.testing;
        } else {
          targetColumn = CONFIG.columns.review;
        }
      } else if (pr.state === 'open') {
        if (analysis.filesAdded > 0 || analysis.filesModified > 0) {
          targetColumn = CONFIG.columns.inProgress;
        } else {
          targetColumn = CONFIG.columns.ready;
        }
      }

      // Move the card
      await this.moveIssueCard(issueNumber, targetColumn);

      // Update issue with progress information
      const progressComment = this.generateProgressComment(pullNumber, pr, analysis);
      await this.github.createIssueComment(issueNumber, progressComment);

      // Update issue labels if needed
      await this.updateIssueLabels(issueNumber, analysis);

    } catch (error) {
      console.error(`Failed to update issue #${issueNumber}:`, error.message);
    }
  }

  /**
   * Generate progress comment for issue
   */
  generateProgressComment(pullNumber, pr, analysis) {
    let comment = `## 🔄 Progress Update from PR #${pullNumber}\n\n`;
    comment += `**Status**: ${pr.state === 'merged' ? '✅ Merged' : '🔄 Open'}\n`;
    comment += `**Title**: ${pr.title}\n\n`;

    if (analysis.filesAdded > 0 || analysis.filesModified > 0) {
      comment += `**Changes**:\n`;
      if (analysis.filesAdded > 0) comment += `- 📁 Files added: ${analysis.filesAdded}\n`;
      if (analysis.filesModified > 0) comment += `- ✏️ Files modified: ${analysis.filesModified}\n`;
    }

    if (analysis.backendChanges) comment += `- 🔧 Backend changes\n`;
    if (analysis.frontendChanges) comment += `- 🎨 Frontend changes\n`;
    if (analysis.testsAdded) comment += `- ✅ Tests added\n`;
    if (analysis.docsUpdated) comment += `- 📚 Documentation updated\n`;

    if (analysis.completionIndicators.length > 0) {
      comment += `\n**Completion Indicators**:\n`;
      analysis.completionIndicators.forEach(indicator => {
        comment += `- ${indicator}\n`;
      });
    }

    comment += `\n---\n*This comment was generated automatically by the project board automation.*`;
    return comment;
  }

  /**
   * Update issue labels based on analysis
   */
  async updateIssueLabels(issueNumber, analysis) {
    try {
      const issue = await this.github.getIssue(issueNumber);
      const currentLabels = issue.labels.map(l => l.name);
      const newLabels = [...currentLabels];

      // Add or remove labels based on analysis
      if (analysis.backendChanges && !newLabels.includes('backend')) {
        newLabels.push('backend');
      }
      if (analysis.frontendChanges && !newLabels.includes('frontend')) {
        newLabels.push('frontend');
      }
      if (analysis.testsAdded && !newLabels.includes('tests-added')) {
        newLabels.push('tests-added');
      }
      if (analysis.docsUpdated && !newLabels.includes('docs-updated')) {
        newLabels.push('docs-updated');
      }

      // Update if labels changed
      if (newLabels.length !== currentLabels.length) {
        await this.github.updateIssue(issueNumber, { labels: newLabels });
        console.log(`Updated labels for issue #${issueNumber}`);
      }

    } catch (error) {
      console.error(`Failed to update labels for issue #${issueNumber}:`, error.message);
    }
  }

  /**
   * Generate progress report
   */
  async generateProgressReport() {
    console.log('📊 Generating progress report...');
    
    try {
      const cards = await this.getAllCards();
      const report = {
        totalIssues: cards.size,
        byColumn: {},
        byPhase: {},
        byModule: {},
        lastUpdated: new Date().toISOString()
      };

      // Count by column
      for (const [key, name] of Object.entries(CONFIG.columns)) {
        report.byColumn[key] = 0;
      }

      // Analyze each card
      for (const card of cards.values()) {
        // Count by column
        const columnKey = Object.keys(CONFIG.columns).find(key => 
          CONFIG.columns[key] === card.columnName
        );
        if (columnKey) {
          report.byColumn[columnKey]++;
        }

        // Extract phase and module information from issue
        if (card.content_url) {
          const issueNumber = parseInt(card.content_url.match(/\/issues\/(\d+)/)?.[1]);
          if (issueNumber) {
            try {
              const issue = await this.github.getIssue(issueNumber);
              const analysis = this.analyzeIssueContent(issue);
              
              if (analysis.phase) {
                report.byPhase[analysis.phase] = (report.byPhase[analysis.phase] || 0) + 1;
              }
              if (analysis.module) {
                report.byModule[analysis.module] = (report.byModule[analysis.module] || 0) + 1;
              }
            } catch (error) {
              // Skip if issue can't be analyzed
            }
          }
        }
      }

      // Save report
      const reportPath = path.join(__dirname, '..', 'docs', 'progress-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log('✅ Progress report generated');
      return report;

    } catch (error) {
      console.error('Failed to generate progress report:', error.message);
      return null;
    }
  }

  /**
   * Analyze issue content for phase and module information
   */
  analyzeIssueContent(issue) {
    const content = (issue.title + ' ' + (issue.body || '')).toLowerCase();
    
    // Detect phase
    let phase = null;
    for (const [phaseNum, phaseName] of Object.entries(phaseMapping)) {
      if (content.includes(`phase ${phaseNum}`) || content.includes(phaseName.toLowerCase())) {
        phase = `phase-${phaseNum}`;
        break;
      }
    }

    // Detect module
    let module = null;
    for (const [moduleId, moduleName] of Object.entries(moduleMapping)) {
      if (content.includes(moduleId) || content.includes(moduleName.toLowerCase())) {
        module = moduleId;
        break;
      }
    }

    return { phase, module };
  }
}

/**
 * CLI interface
 */
async function main() {
  const command = process.argv[2];
  const manager = new ProjectBoardManager();

  switch (command) {
    case 'init':
      await manager.initializeBoard();
      break;
      
    case 'process-pr':
      const prNumber = parseInt(process.argv[3]);
      if (!prNumber) {
        console.error('Please provide a PR number: npm run board:process-pr <number>');
        process.exit(1);
      }
      await manager.processPullRequest(prNumber);
      break;
      
    case 'report':
      const report = await manager.generateProgressReport();
      if (report) {
        console.log('\n📊 Progress Report:');
        console.log(`Total Issues: ${report.totalIssues}`);
        console.log('\nBy Column:');
        for (const [key, count] of Object.entries(report.byColumn)) {
          console.log(`  ${CONFIG.columns[key]}: ${count}`);
        }
        console.log('\nBy Phase:');
        for (const [phase, count] of Object.entries(report.byPhase)) {
          console.log(`  ${phase}: ${count}`);
        }
        console.log('\nBy Module:');
        for (const [module, count] of Object.entries(report.byModule)) {
          console.log(`  ${module}: ${count}`);
        }
      }
      break;
      
    case 'move':
      const issueNumber = parseInt(process.argv[3]);
      const targetColumn = process.argv[4];
      if (!issueNumber || !targetColumn) {
        console.error('Please provide issue number and target column: npm run board:move <issue> <column>');
        process.exit(1);
      }
      await manager.moveIssueCard(issueNumber, targetColumn);
      break;
      
    default:
      console.log(`
EduMyles Project Board Automation

Usage:
  npm run board:init                    Initialize project board
  npm run board:process-pr <number>     Process a pull request
  npm run board:report                  Generate progress report
  npm run board:move <issue> <column>   Move issue to column

Available columns:
  ${Object.values(CONFIG.columns).join(', ')}
      `);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  ProjectBoardManager,
  GitHubAPI,
  CONFIG
};
