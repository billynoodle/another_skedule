from github import Github
import os

class GitHelper:
    def __init__(self, token: str):
        self.gh = Github(token)
        self.repo = self.gh.get_repo('billynoodle/another_skedule')
    
    def create_branch(self, branch_name: str):
        """Create a new branch"""
        source = self.repo.get_branch(self.repo.default_branch)
        self.repo.create_git_ref(f"refs/heads/{branch_name}", source.commit.sha)
    
    def update_file(self, file_path: str, content: str, branch: str, message: str):
        """Update or create a file"""
        try:
            file = self.repo.get_contents(file_path, ref=branch)
            self.repo.update_file(
                file_path,
                message,
                content,
                file.sha,
                branch=branch
            )
        except Exception:
            self.repo.create_file(
                file_path,
                message,
                content,
                branch=branch
            )
    
    def create_pull_request(self, title: str, body: str, head: str):
        """Create a pull request"""
        return self.repo.create_pull(
            title=title,
            body=body,
            head=head,
            base=self.repo.default_branch
        )