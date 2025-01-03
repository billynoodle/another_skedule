from typing import List, Dict
from .agents import ProjectManager, ReactSpecialist, SupabaseSpecialist, UISpecialist, CodeAnalyzerAgent
from .utils import ProjectFileManager, GitManager
import os
from dotenv import load_dotenv

load_dotenv()

class AIOrchestrator:
    def __init__(self):
        github_token = os.getenv('GITHUB_TOKEN')
        repo_path = 'billynoodle/another_skedule'
        
        self.file_manager = ProjectFileManager(repo_path, github_token)
        self.git_manager = GitManager(repo_path, github_token)
        self.agents = {
            'analyzer': CodeAnalyzerAgent(),
            'project_manager': ProjectManager(),
            'react': ReactSpecialist(),
            'supabase': SupabaseSpecialist(),
            'ui': UISpecialist()
        }
    
    async def run_improvement_cycle(self):
        """Run a complete improvement cycle"""
        # 1. Scan codebase
        files = self.file_manager.scan_directory('/')
        
        # 2. Analyze files
        issues = []
        for file_path in files:
            content = self.file_manager.read_file(file_path)
            file_issues = await self.agents['analyzer'].analyze_code(content, file_path)
            issues.extend(file_issues)
        
        # 3. Prioritize issues
        prioritized_issues = await self.agents['project_manager'].prioritize_issues(issues)
        
        # 4. Generate fixes
        for issue in prioritized_issues:
            specialist = self._get_specialist_for_issue(issue)
            fix = await specialist.generate_fix(issue)
            if fix:
                self._implement_fix(fix)
    
    def _get_specialist_for_issue(self, issue: Dict) -> BaseAgent:
        """Get the appropriate specialist for an issue"""
        if issue['type'] in ['react_component', 'performance']:
            return self.agents['react']
        elif issue['type'] in ['database', 'supabase']:
            return self.agents['supabase']
        elif issue['type'] in ['ui', 'css']:
            return self.agents['ui']
        return self.agents['project_manager']
    
    def _implement_fix(self, fix: Dict):
        """Implement a fix and create a pull request"""
        branch_name = f"auto-fix/{fix['id']}"
        self.git_manager.create_branch(branch_name)
        
        # Apply changes
        for file_change in fix['changes']:
            self.file_manager.write_file(file_change['path'], file_change['content'])
        
        # Create PR
        files_changed = [c['path'] for c in fix['changes']]
        self.git_manager.commit_changes(
            files_changed,
            f"Auto-fix: {fix['description']}"
        )
        self.git_manager.push_changes()
        
        self.git_manager.create_pull_request(
            title=f"Auto-fix: {fix['description']}",
            body=f"Automated fix for issue:\n\n{fix['description']}\n\nChanges made:\n" +
                 '\n'.join([f"- {path}" for path in files_changed])
        )