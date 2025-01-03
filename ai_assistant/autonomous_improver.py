import os
from dotenv import load_dotenv
from utils.code_analyzer import CodeAnalyzer
from utils.git_helper import GitHelper
from typing import List, Dict
import time

class AutonomousImprover:
    def __init__(self):
        load_dotenv()
        github_token = os.getenv('GITHUB_TOKEN')
        if not github_token:
            raise ValueError('GITHUB_TOKEN not found in .env file')
            
        print('Initializing Git helper...')
        self.git = GitHelper(github_token)
        print('Initializing Code analyzer...')
        self.analyzer = CodeAnalyzer()
    
    def scan_project(self):
        """Scan project for improvement opportunities"""
        issues = []
        print('Getting repository contents...')
        contents = self.git.repo.get_contents('')
        file_count = 0
        
        while contents:
            file_content = contents.pop(0)
            if file_content.type == 'dir':
                print(f'Scanning directory: {file_content.path}')
                contents.extend(self.git.repo.get_contents(file_content.path))
            elif file_content.path.endswith(('.ts', '.tsx', '.py')):
                print(f'Analyzing file: {file_content.path}')
                file_count += 1
                content = file_content.decoded_content.decode()
                file_issues = self.analyzer.analyze_file(content, file_content.path)
                if file_issues:
                    print(f'Found {len(file_issues)} issues in {file_content.path}')
                    issues.append({
                        'file': file_content.path,
                        'issues': file_issues
                    })
        
        print(f'Completed analysis of {file_count} files')
        return issues
    
    def improve_code(self):
        """Run the improvement process"""
        print('Starting code improvement process...')
        issues = self.scan_project()
        
        if not issues:
            print('No issues found!')
            return
            
        print(f'Found issues in {len(issues)} files')
        for file_issue in issues:
            print(f'\nIssues in {file_issue["file"]}:')
            for issue in file_issue['issues']:
                print(f'- {issue["message"]} (Severity: {issue["severity"]})')
        
        # Create improvement branch
        timestamp = int(time.time())
        branch_name = f'auto-improvements-{timestamp}'
        print(f'\nCreating branch: {branch_name}')
        self.git.create_branch(branch_name)
        
        # Apply improvements
        improvements_made = False
        for file_issue in issues:
            print(f'Processing {file_issue["file"]}...')
            content = self.git.repo.get_contents(file_issue['file']).decoded_content.decode()
            updated_content = self._apply_improvements(content, file_issue['issues'])
            
            if updated_content != content:
                improvements_made = True
                print(f'Updating {file_issue["file"]}...')
                self.git.update_file(
                    file_issue['file'],
                    f'Improve {file_issue["file"]}',
                    updated_content,
                    branch_name
                )
        
        if improvements_made:
            # Create pull request
            print('Creating pull request...')
            pr = self.git.create_pull_request(
                'Automated Code Improvements',
                self._generate_pr_description(issues),
                branch_name
            )
            print(f'Created pull request: {pr.html_url}')
        else:
            print('No improvements were necessary')
    
    def _apply_improvements(self, content: str, issues: List[Dict]) -> str:
        """Apply improvements to content based on issues"""
        # Start with simple improvements
        for issue in issues:
            if issue['type'] == 'type_safety':
                content = content.replace(': any', ': unknown')
            elif issue['type'] == 'react_hook':
                content = content.replace('useEffect(() => {', 'useEffect(() => {\n  // Add dependencies here\n}, []);')
        return content
    
    def _generate_pr_description(self, issues: List[Dict]) -> str:
        """Generate pull request description"""
        description = '# Automated Code Improvements\n\n'
        description += 'This PR contains the following improvements:\n\n'
        
        for file_issue in issues:
            description += f'## {file_issue["file"]}\n'
            for issue in file_issue['issues']:
                description += f'- {issue["message"]} ({issue["severity"]})\n'
        
        return description

def main():
    print('Initializing Autonomous Improver...')
    improver = AutonomousImprover()
    improver.improve_code()

if __name__ == '__main__':
    main()