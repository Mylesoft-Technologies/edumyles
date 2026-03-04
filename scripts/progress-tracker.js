#!/usr/bin/env node

/**
 * EduMyles Progress Tracker
 * 
 * This script tracks implementation progress across all phases and modules,
 * generating comprehensive reports and updating documentation automatically.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  repoPath: path.resolve(__dirname, '..'),
  docsPath: path.resolve(__dirname, '..', 'docs'),
  reportsPath: path.resolve(__dirname, '..', 'docs', 'reports'),
  progressFile: path.resolve(__dirname, '..', 'docs', 'implementation-progress.json'),
  cacheFile: path.resolve(__dirname, '..', '.cache', 'progress-cache.json')
};

// Phase definitions (matching implementation plan)
const PHASES = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Shared Foundation',
    duration: 'Week 1-2',
    weight: 5, // Relative importance weight
    components: [
      { name: 'shadcn/ui components', files: ['frontend/src/components/ui'], weight: 1 },
      { name: 'Layout components', files: ['frontend/src/components/layout'], weight: 2 },
      { name: 'Shared components', files: ['frontend/src/components/shared'], weight: 2 },
      { name: 'Core hooks', files: ['frontend/src/hooks'], weight: 2 },
      { name: 'Utility library', files: ['frontend/src/lib'], weight: 1 },
      { name: 'Auth flow', files: ['frontend/src/app/auth'], weight: 3 },
      { name: 'Middleware', files: ['frontend/src/middleware.ts'], weight: 1 }
    ]
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Module Marketplace',
    duration: 'Week 2-3',
    weight: 8,
    components: [
      { name: 'Marketplace backend', files: ['convex/modules/marketplace'], weight: 3 },
      { name: 'Module guard', files: ['convex/helpers/moduleGuard.ts'], weight: 1 },
      { name: 'Marketplace frontend', files: ['frontend/src/app/(admin)/marketplace'], weight: 2 },
      { name: 'Module settings', files: ['frontend/src/app/(admin)/settings/modules'], weight: 1 },
      { name: 'Platform marketplace', files: ['frontend/src/app/(platform)/marketplace'], weight: 1 }
    ]
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Master Admin & Super Admin Panels',
    duration: 'Week 3-4',
    weight: 10,
    components: [
      { name: 'Platform backend', files: ['convex/platform'], weight: 4 },
      { name: 'Master admin frontend', files: ['frontend/src/app/(platform)'], weight: 4 },
      { name: 'Super admin restrictions', files: ['frontend/src/app/(platform)'], weight: 2 }
    ]
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'School Admin Panel',
    duration: 'Week 4-5',
    weight: 12,
    components: [
      { name: 'School management backend', files: ['convex/modules/sis', 'convex/modules/admissions', 'convex/modules/hr'], weight: 6 },
      { name: 'School admin frontend', files: ['frontend/src/app/(admin)'], weight: 6 }
    ]
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Teacher Panel',
    duration: 'Week 5-6',
    weight: 8,
    components: [
      { name: 'Teacher backend', files: ['convex/modules/academics'], weight: 3 },
      { name: 'Teacher frontend', files: ['frontend/src/app/(portal)/teacher'], weight: 5 }
    ]
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'Parent Panel',
    duration: 'Week 6-7',
    weight: 8,
    components: [
      { name: 'Parent backend', files: ['convex/modules/portal/parent'], weight: 3 },
      { name: 'Parent frontend', files: ['frontend/src/app/(portal)/parent'], weight: 5 }
    ]
  },
  {
    id: 'phase-7',
    number: 7,
    title: 'Student Panel',
    duration: 'Week 7-8',
    weight: 8,
    components: [
      { name: 'Student backend', files: ['convex/modules/portal/student'], weight: 3 },
      { name: 'Student frontend', files: ['frontend/src/app/(portal)/student'], weight: 5 }
    ]
  },
  {
    id: 'phase-8',
    number: 8,
    title: 'Alumni Panel',
    duration: 'Week 8-9',
    weight: 6,
    components: [
      { name: 'Alumni backend', files: ['convex/modules/portal/alumni'], weight: 3 },
      { name: 'Alumni frontend', files: ['frontend/src/app/(portal)/alumni'], weight: 3 }
    ]
  },
  {
    id: 'phase-9',
    number: 9,
    title: 'Partner Panel',
    duration: 'Week 9-10',
    weight: 6,
    components: [
      { name: 'Partner backend', files: ['convex/modules/portal/partner'], weight: 3 },
      { name: 'Partner frontend', files: ['frontend/src/app/(portal)/partner'], weight: 3 }
    ]
  },
  {
    id: 'phase-10',
    number: 10,
    title: 'Remaining Modules Backend',
    duration: 'Week 10-13',
    weight: 15,
    components: [
      { name: 'Finance module', files: ['convex/modules/finance'], weight: 2 },
      { name: 'Timetable module', files: ['convex/modules/timetable'], weight: 1.5 },
      { name: 'HR module', files: ['convex/modules/hr'], weight: 2 },
      { name: 'Library module', files: ['convex/modules/library'], weight: 1.5 },
      { name: 'Transport module', files: ['convex/modules/transport'], weight: 1.5 },
      { name: 'Communications module', files: ['convex/modules/communications'], weight: 2 },
      { name: 'eWallet module', files: ['convex/modules/ewallet'], weight: 1.5 },
      { name: 'eCommerce module', files: ['convex/modules/ecommerce'], weight: 1.5 }
    ]
  },
  {
    id: 'phase-11',
    number: 11,
    title: 'Payment Webhooks & Integrations',
    duration: 'Week 13-14',
    weight: 8,
    components: [
      { name: 'API routes', files: ['frontend/src/app/api'], weight: 3 },
      { name: 'Payment actions', files: ['convex/actions/payments'], weight: 3 },
      { name: 'Communication actions', files: ['convex/actions/communications'], weight: 2 }
    ]
  },
  {
    id: 'phase-12',
    number: 12,
    title: 'Admin Pages for Remaining Modules',
    duration: 'Week 14-16',
    weight: 12,
    components: [
      { name: 'Finance admin pages', files: ['frontend/src/app/(admin)/finance'], weight: 2 },
      { name: 'Timetable admin pages', files: ['frontend/src/app/(admin)/timetable'], weight: 1.5 },
      { name: 'HR admin pages', files: ['frontend/src/app/(admin)/hr'], weight: 2 },
      { name: 'Library admin pages', files: ['frontend/src/app/(admin)/library'], weight: 1.5 },
      { name: 'Transport admin pages', files: ['frontend/src/app/(admin)/transport'], weight: 1.5 },
      { name: 'Communications admin pages', files: ['frontend/src/app/(admin)/communications'], weight: 1.5 },
      { name: 'eWallet admin pages', files: ['frontend/src/app/(admin)/ewallet'], weight: 1 },
      { name: 'eCommerce admin pages', files: ['frontend/src/app/(admin)/ecommerce'], weight: 1 }
    ]
  },
  {
    id: 'phase-13',
    number: 13,
    title: 'Testing',
    duration: 'Week 16-17',
    weight: 10,
    components: [
      { name: 'Testing setup', files: ['vitest.config.ts', 'tests/setup'], weight: 2 },
      { name: 'Critical tests', files: ['tests/critical'], weight: 4 },
      { name: 'Module tests', files: ['tests/modules'], weight: 4 }
    ]
  }
];

// Module definitions
const MODULES = [
  { id: 'sis', name: 'Student Information System', weight: 10 },
  { id: 'admissions', name: 'Admissions & Enrollment', weight: 8 },
  { id: 'academics', name: 'Academics & Gradebook', weight: 10 },
  { id: 'hr', name: 'HR & Payroll', weight: 8 },
  { id: 'finance', name: 'Fee & Finance', weight: 12 },
  { id: 'timetable', name: 'Timetable & Scheduling', weight: 6 },
  { id: 'library', name: 'Library Management', weight: 4 },
  { id: 'transport', name: 'Transport Management', weight: 4 },
  { id: 'communications', name: 'Communications', weight: 6 },
  { id: 'ewallet', name: 'eWallet', weight: 5 },
  { id: 'ecommerce', name: 'eCommerce', weight: 5 }
];

/**
 * Progress Tracker Class
 */
class ProgressTracker {
  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [CONFIG.reportsPath, path.dirname(CONFIG.cacheFile)];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Check if files exist for a component
   */
  checkFilesExist(filePatterns) {
    let exists = false;
    let fileCount = 0;
    let totalSize = 0;

    for (const pattern of filePatterns) {
      const fullPath = path.join(CONFIG.repoPath, pattern);
      
      if (fs.existsSync(fullPath)) {
        exists = true;
        fileCount++;
        
        if (fs.statSync(fullPath).isFile()) {
          totalSize += fs.statSync(fullPath).size;
        } else if (fs.statSync(fullPath).isDirectory()) {
          // Count files in directory
          try {
            const files = fs.readdirSync(fullPath);
            fileCount += files.length;
            files.forEach(file => {
              const filePath = path.join(fullPath, file);
              if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
              }
            });
          } catch (error) {
            // Directory might be empty or inaccessible
          }
        }
      }
    }

    return { exists, fileCount, totalSize };
  }

  /**
   * Analyze component completion
   */
  analyzeComponent(component) {
    const fileCheck = this.checkFilesExist(component.files);
    
    let completionPercentage = 0;
    if (fileCheck.exists) {
      // Basic heuristic: if files exist, assume at least 50% complete
      // Add more based on file count and size
      completionPercentage = Math.min(100, 50 + (fileCheck.fileCount * 5) + (fileCheck.totalSize / 1000));
    }

    return {
      name: component.name,
      weight: component.weight,
      exists: fileCheck.exists,
      fileCount: fileCheck.fileCount,
      totalSize: fileCheck.totalSize,
      completionPercentage: Math.round(completionPercentage),
      status: this.getCompletionStatus(completionPercentage)
    };
  }

  /**
   * Get status based on completion percentage
   */
  getCompletionStatus(percentage) {
    if (percentage === 0) return 'not-started';
    if (percentage < 25) return 'just-started';
    if (percentage < 50) return 'in-progress';
    if (percentage < 75) return 'mostly-complete';
    if (percentage < 100) return 'nearly-complete';
    return 'complete';
  }

  /**
   * Analyze phase progress
   */
  analyzePhase(phase) {
    const components = phase.components.map(comp => this.analyzeComponent(comp));
    
    // Calculate weighted completion percentage
    let totalWeight = 0;
    let weightedCompletion = 0;
    
    components.forEach(comp => {
      totalWeight += comp.weight;
      weightedCompletion += comp.completionPercentage * comp.weight;
    });
    
    const phaseCompletion = totalWeight > 0 ? Math.round(weightedCompletion / totalWeight) : 0;
    
    return {
      ...phase,
      components,
      completionPercentage: phaseCompletion,
      status: this.getCompletionStatus(phaseCompletion),
      completedComponents: components.filter(c => c.status === 'complete').length,
      totalComponents: components.length
    };
  }

  /**
   * Analyze module progress
   */
  analyzeModule(module) {
    const backendFiles = [`convex/modules/${module.id}`];
    const frontendFiles = [`frontend/src/app/(admin)/${module.id}`];
    
    const backendCheck = this.checkFilesExist(backendFiles);
    const frontendCheck = this.checkFilesExist(frontendFiles);
    
    // Calculate completion based on backend and frontend presence
    let completionPercentage = 0;
    if (backendCheck.exists) completionPercentage += 50;
    if (frontendCheck.exists) completionPercentage += 50;
    
    return {
      ...module,
      backend: {
        exists: backendCheck.exists,
        fileCount: backendCheck.fileCount,
        totalSize: backendCheck.totalSize
      },
      frontend: {
        exists: frontendCheck.exists,
        fileCount: frontendCheck.fileCount,
        totalSize: frontendCheck.totalSize
      },
      completionPercentage,
      status: this.getCompletionStatus(completionPercentage)
    };
  }

  /**
   * Get git statistics
   */
  getGitStats() {
    try {
      const totalCommits = execSync('git rev-list --count HEAD', { 
        cwd: CONFIG.repoPath, 
        encoding: 'utf8' 
      }).trim();
      
      const contributors = execSync('git shortlog -sn', { 
        cwd: CONFIG.repoPath, 
        encoding: 'utf8' 
      }).trim().split('\n').length;
      
      const lastCommit = execSync('git log -1 --format=%ci', { 
        cwd: CONFIG.repoPath, 
        encoding: 'utf8' 
      }).trim();
      
      return {
        totalCommits: parseInt(totalCommits),
        contributors,
        lastCommit: new Date(lastCommit)
      };
    } catch (error) {
      return {
        totalCommits: 0,
        contributors: 0,
        lastCommit: null
      };
    }
  }

  /**
   * Generate comprehensive progress report
   */
  generateProgressReport() {
    console.log('📊 Generating comprehensive progress report...');
    
    const timestamp = new Date().toISOString();
    const gitStats = this.getGitStats();
    
    // Analyze all phases
    const phases = PHASES.map(phase => this.analyzePhase(phase));
    
    // Analyze all modules
    const modules = MODULES.map(module => this.analyzeModule(module));
    
    // Calculate overall progress
    const totalPhaseWeight = phases.reduce((sum, phase) => sum + phase.weight, 0);
    const weightedPhaseCompletion = phases.reduce((sum, phase) => 
      sum + (phase.completionPercentage * phase.weight), 0);
    const overallPhaseCompletion = Math.round(weightedPhaseCompletion / totalPhaseWeight);
    
    const totalModuleWeight = modules.reduce((sum, module) => sum + module.weight, 0);
    const weightedModuleCompletion = modules.reduce((sum, module) => 
      sum + (module.completionPercentage * module.weight), 0);
    const overallModuleCompletion = Math.round(weightedModuleCompletion / totalModuleWeight);
    
    const overallCompletion = Math.round((overallPhaseCompletion + overallModuleCompletion) / 2);
    
    const report = {
      metadata: {
        generated: timestamp,
        version: '1.0.0',
        gitStats
      },
      summary: {
        overallCompletion,
        phaseCompletion: overallPhaseCompletion,
        moduleCompletion: overallModuleCompletion,
        totalPhases: phases.length,
        completedPhases: phases.filter(p => p.status === 'complete').length,
        totalModules: modules.length,
        completedModules: modules.filter(m => m.status === 'complete').length
      },
      phases,
      modules,
      recommendations: this.generateRecommendations(phases, modules),
      nextMilestones: this.getNextMilestones(phases)
    };
    
    // Save report
    fs.writeFileSync(CONFIG.progressFile, JSON.stringify(report, null, 2));
    
    // Generate markdown report
    this.generateMarkdownReport(report);
    
    console.log('✅ Progress report generated');
    return report;
  }

  /**
   * Generate recommendations based on progress
   */
  generateRecommendations(phases, modules) {
    const recommendations = [];
    
    // Check for blocked phases
    const blockedPhases = phases.filter(p => 
      p.status === 'not-started' && phases.find(prev => 
        prev.number === p.number - 1 && prev.status !== 'complete'
      )
    );
    
    if (blockedPhases.length > 0) {
      recommendations.push({
        type: 'blocking',
        priority: 'high',
        message: `${blockedPhases.length} phase(s) are blocked by incomplete dependencies`,
        phases: blockedPhases.map(p => `Phase ${p.number}`)
      });
    }
    
    // Check for high-priority modules not started
    const highPriorityModules = modules.filter(m => 
      m.weight >= 8 && m.status === 'not-started'
    );
    
    if (highPriorityModules.length > 0) {
      recommendations.push({
        type: 'priority',
        priority: 'medium',
        message: `${highPriorityModules.length} high-priority module(s) not started`,
        modules: highPriorityModules.map(m => m.name)
      });
    }
    
    // Check for nearly complete items
    const nearlyComplete = [...phases, ...modules].filter(item => 
      item.status === 'nearly-complete'
    );
    
    if (nearlyComplete.length > 0) {
      recommendations.push({
        type: 'completion',
        priority: 'low',
        message: `${nearlyComplete.length} item(s) are nearly complete`,
        items: nearlyComplete.map(item => item.title || item.name)
      });
    }
    
    return recommendations;
  }

  /**
   * Get next milestones
   */
  getNextMilestones(phases) {
    const nextPhases = phases
      .filter(p => p.status !== 'complete')
      .sort((a, b) => a.number - b.number)
      .slice(0, 3);
    
    return nextPhases.map(phase => ({
      phase: phase.number,
      title: phase.title,
      completionPercentage: phase.completionPercentage,
      estimatedDaysRemaining: this.estimateDaysRemaining(phase)
    }));
  }

  /**
   * Estimate days remaining for a phase
   */
  estimateDaysRemaining(phase) {
    // Simple estimation based on completion percentage and duration
    const durationWeeks = parseInt(phase.duration.match(/Week (\d+)/)?.[1] || '1');
    const totalDays = durationWeeks * 7;
    const remainingPercentage = 100 - phase.completionPercentage;
    return Math.round((remainingPercentage / 100) * totalDays);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report) {
    const markdownPath = path.join(CONFIG.reportsPath, `progress-${new Date().toISOString().split('T')[0]}.md`);
    
    let markdown = `# EduMyles Implementation Progress Report\n\n`;
    markdown += `**Generated**: ${new Date(report.metadata.generated).toLocaleString()}\n\n`;
    
    // Summary section
    markdown += `## 📊 Summary\n\n`;
    markdown += `- **Overall Completion**: ${report.summary.overallCompletion}%\n`;
    markdown += `- **Phase Completion**: ${report.summary.phaseCompletion}%\n`;
    markdown += `- **Module Completion**: ${report.summary.moduleCompletion}%\n`;
    markdown += `- **Completed Phases**: ${report.summary.completedPhases}/${report.summary.totalPhases}\n`;
    markdown += `- **Completed Modules**: ${report.summary.completedModules}/${report.summary.totalModules}\n\n`;
    
    // Progress bar
    const progressBar = this.createProgressBar(report.summary.overallCompletion);
    markdown += `### Overall Progress\n${progressBar}\n\n`;
    
    // Phases section
    markdown += `## 🏗️ Phase Progress\n\n`;
    report.phases.forEach(phase => {
      const phaseBar = this.createProgressBar(phase.completionPercentage);
      markdown += `### Phase ${phase.number}: ${phase.title}\n`;
      markdown += `${phaseBar} ${phase.completionPercentage}%\n`;
      markdown += `**Status**: ${phase.status} | **Components**: ${phase.completedComponents}/${phase.totalComponents}\n\n`;
      
      if (phase.components.length > 0) {
        markdown += `#### Components:\n`;
        phase.components.forEach(comp => {
          const compBar = this.createProgressBar(comp.completionPercentage, 20);
          markdown += `- ${comp.name}: ${compBar} ${comp.completionPercentage}%\n`;
        });
        markdown += `\n`;
      }
    });
    
    // Modules section
    markdown += `## 🔧 Module Progress\n\n`;
    report.modules.forEach(module => {
      const moduleBar = this.createProgressBar(module.completionPercentage);
      markdown += `### ${module.name}\n`;
      markdown += `${moduleBar} ${module.completionPercentage}%\n`;
      markdown += `**Backend**: ${module.backend.exists ? '✅' : '❌'} | `;
      markdown += `**Frontend**: ${module.frontend.exists ? '✅' : '❌'}\n\n`;
    });
    
    // Recommendations section
    if (report.recommendations.length > 0) {
      markdown += `## 💡 Recommendations\n\n`;
      report.recommendations.forEach(rec => {
        const emoji = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : '💭';
        markdown += `### ${emoji} ${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}\n`;
        markdown += `${rec.message}\n\n`;
      });
    }
    
    // Next milestones section
    if (report.nextMilestones.length > 0) {
      markdown += `## 🎯 Next Milestones\n\n`;
      report.nextMilestones.forEach(milestone => {
        markdown += `### Phase ${milestone.phase}: ${milestone.title}\n`;
        markdown += `- **Current Progress**: ${milestone.completionPercentage}%\n`;
        markdown += `- **Estimated Remaining**: ${milestone.estimatedDaysRemaining} days\n\n`;
      });
    }
    
    // Git stats section
    markdown += `## 📈 Repository Statistics\n\n`;
    markdown += `- **Total Commits**: ${report.metadata.gitStats.totalCommits}\n`;
    markdown += `- **Contributors**: ${report.metadata.gitStats.contributors}\n`;
    markdown += `- **Last Commit**: ${report.metadata.gitStats.lastCommit ? new Date(report.metadata.gitStats.lastCommit).toLocaleString() : 'N/A'}\n\n`;
    
    fs.writeFileSync(markdownPath, markdown);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);
  }

  /**
   * Create progress bar
   */
  createProgressBar(percentage, width = 30) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  /**
   * Update documentation with latest progress
   */
  updateDocumentation() {
    console.log('📚 Updating documentation...');
    
    const report = this.generateProgressReport();
    
    // Update main progress analysis file
    const progressAnalysisPath = path.join(CONFIG.docsPath, 'PROJECT_PROGRESS_ANALYSIS.md');
    
    let content = `# EduMyles Project Progress Analysis\n\n`;
    content += `> Updated: ${new Date().toLocaleDateString()}\n\n`;
    
    content += `## Current Status\n\n`;
    content += `**Overall Completion**: ${report.summary.overallCompletion}%\n\n`;
    
    content += `### Phase Progress\n\n`;
    report.phases.forEach(phase => {
      const status = phase.status === 'complete' ? '✅' : 
                     phase.status === 'nearly-complete' ? '🟡' : 
                     phase.status === 'not-started' ? '❌' : '🔄';
      content += `- ${status} **Phase ${phase.number}**: ${phase.title} (${phase.completionPercentage}%)\n`;
    });
    
    content += `\n### Module Progress\n\n`;
    report.modules.forEach(module => {
      const status = module.status === 'complete' ? '✅' : 
                     module.status === 'nearly-complete' ? '🟡' : 
                     module.status === 'not-started' ? '❌' : '🔄';
      content += `- ${status} **${module.name}** (${module.completionPercentage}%)\n`;
    });
    
    content += `\n## Recent Activity\n\n`;
    content += `- Last analyzed: ${new Date().toLocaleString()}\n`;
    content += `- Total commits: ${report.metadata.gitStats.totalCommits}\n`;
    content += `- Contributors: ${report.metadata.gitStats.contributors}\n\n`;
    
    content += `## Next Steps\n\n`;
    report.nextMilestones.slice(0, 3).forEach(milestone => {
      content += `1. **Phase ${milestone.phase}**: ${milestone.title}\n`;
      content += `   - Current: ${milestone.completionPercentage}%\n`;
      content += `   - Estimated: ${milestone.estimatedDaysRemaining} days remaining\n\n`;
    });
    
    fs.writeFileSync(progressAnalysisPath, content);
    console.log('✅ Documentation updated');
  }
}

/**
 * CLI interface
 */
async function main() {
  const command = process.argv[2];
  const tracker = new ProgressTracker();

  switch (command) {
    case 'report':
      const report = tracker.generateProgressReport();
      console.log('\n📊 Progress Summary:');
      console.log(`Overall Completion: ${report.summary.overallCompletion}%`);
      console.log(`Phases Complete: ${report.summary.completedPhases}/${report.summary.totalPhases}`);
      console.log(`Modules Complete: ${report.summary.completedModules}/${report.summary.totalModules}`);
      break;
      
    case 'update-docs':
      tracker.updateDocumentation();
      break;
      
    case 'analyze':
      const analysis = tracker.generateProgressReport();
      console.log('\n🔍 Detailed Analysis:');
      console.log('\nPhases:');
      analysis.phases.forEach(phase => {
        console.log(`  Phase ${phase.number}: ${phase.title} - ${phase.completionPercentage}% (${phase.status})`);
      });
      console.log('\nModules:');
      analysis.modules.forEach(module => {
        console.log(`  ${module.name}: ${module.completionPercentage}% (${module.status})`);
      });
      break;
      
    default:
      console.log(`
EduMyles Progress Tracker

Usage:
  npm run progress:report          Generate progress report
  npm run progress:update-docs    Update documentation
  npm run progress:analyze        Show detailed analysis

The tracker analyzes file system presence and git history to estimate
completion percentages for all phases and modules in the implementation plan.
      `);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  ProgressTracker,
  PHASES,
  MODULES,
  CONFIG
};
