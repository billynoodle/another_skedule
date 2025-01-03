import os
from dotenv import load_dotenv
from utils.code_analyzer import CodeAnalyzer
from utils.git_helper import GitHelper
from typing import List, Dict

class AutonomousImprover:
    def __init__(self):
        load_dotenv()
        github_token = os.getenv('GITHUB_TOKEN')
        if not github_token:
            raise ValueError('GITHUB_TOKEN not found in .env file')
            
        self.git = GitHelper(github_token)
        self.analyzer = CodeAnalyzer()
    
    def scan_project(self):
        """Scan project for improvement opportunities"""
        issues = []
        contents = self.git.repo.get_contents('')
        
        while contents:
            file_content = contents.pop(0)
            if file_content.type == 'dir':
                contents.extend(self.git.repo.get_contents(file_content.path))
            elif file_content.path.endswith(('.ts', '.tsx', '.py')):
                content = file_content.decoded_content.decode()
                file_issues = self.analyzer.analyze_file(content, file_content.path)
                if file_issues:
                    issues.append({
                        'file': file_content.path,
                        'issues': file_issues
                    })
        
        return issues
    
    def improve_code(self):
        """Run the improvement process"""
        print('Scanning project for improvements...')
        issues = self.scan_project()
        
        if not issues:
            print('No issues found!')
            return
            
        print(f'Found {len(issues)} files with potential improvements')
        
        # Create improvement branch
        branch_name = f'auto-improvements-{os.urandom(4).hex()}'
        print(f'Creating branch: {branch_name}')
        self.git.create_branch(branch_name)
        
        # Apply improvements
        for file_issue in issues:
            print(f'Processing {file_issue["file"]}...')
            content = self.git.repo.get_contents(file_issue['file']).decoded_content.decode()
            updated_content = self._apply_improvements(content, file_issue['issues'])
            
            if updated_content != content:
                self.git.update_file(
                    file_issue['file'],
                    f'Improve {file_issue["file"]}',
                    updated_content,
                    branch_name
                )
        
        # Create pull request
        pr = self.git.create_pull_request(
            'Automated Code Improvements',
            self._generate_pr_description(issues),
            branch_name
        )
        
        print(f'Created pull request: {pr.html_url}')
    
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
    improver = AutonomousImprover()
    improver.improve_code()

if __name__ == '__main__':
    main()