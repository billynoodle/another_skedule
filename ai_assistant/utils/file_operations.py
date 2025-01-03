import os
from typing import List, Dict
from github import Github

class ProjectFileManager:
    def __init__(self, repo_path: str, github_token: str):
        self.repo_path = repo_path
        self.gh = Github(github_token)
        self.repo = self.gh.get_repo(repo_path)
    
    def scan_directory(self, path: str) -> List[str]:
        """Recursively scan directory and return file paths"""
        contents = self.repo.get_contents(path)
        return [content.path for content in contents if content.type == "file"]
    
    def read_file(self, file_path: str) -> str:
        """Read file content from repository"""
        content = self.repo.get_contents(file_path)
        return content.decoded_content.decode()
    
    def write_file(self, file_path: str, content: str):
        """Write content to a file in the repository"""
        try:
            existing_file = self.repo.get_contents(file_path)
            self.repo.update_file(
                file_path,
                f"Update {file_path}",
                content,
                existing_file.sha
            )
        except:
            self.repo.create_file(
                file_path,
                f"Create {file_path}",
                content
            )