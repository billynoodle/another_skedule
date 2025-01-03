from git import Repo
from github import Github
from typing import List
import os

class GitManager:
    def __init__(self, repo_path: str, github_token: str):
        self.repo = Repo(repo_path)
        self.gh = Github(github_token)
        self.remote_repo = self.gh.get_repo(repo_path)
    
    def create_branch(self, branch_name: str):
        current = self.repo.active_branch
        new_branch = self.repo.create_head(branch_name)
        new_branch.checkout()
        
    def commit_changes(self, files: List[str], message: str):
        self.repo.index.add(files)
        self.repo.index.commit(message)
        
    def push_changes(self):
        origin = self.repo.remote(name='origin')
        origin.push()
        
    def create_pull_request(self, title: str, body: str, base_branch: str = 'main'):
        return self.remote_repo.create_pull(
            title=title,
            body=body,
            head=self.repo.active_branch.name,
            base=base_branch
        )