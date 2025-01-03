from typing import List, Dict
import ast
from .base_agent import BaseAgent

class CodeAnalyzerAgent(BaseAgent):
    def analyze_code(self, file_content: str, file_path: str) -> Dict:
        """Analyze code for potential improvements"""
        issues = []
        
        if file_path.endswith('.ts') or file_path.endswith('.tsx'):
            issues.extend(self._analyze_typescript(file_content))
        elif file_path.endswith('.py'):
            issues.extend(self._analyze_python(file_content))
        
        return {"issues": issues}

    def _analyze_typescript(self, content: str) -> List[Dict]:
        """Analyze TypeScript code"""
        issues = []
        
        # Check for missing type annotations
        if 'any' in content:
            issues.append({
                "type": "type_safety",
                "severity": "medium",
                "message": "Consider replacing 'any' with more specific types"
            })
            
        # Check for potential React performance issues
        if 'useEffect(' in content and not 'useCallback(' in content:
            issues.append({
                "type": "performance",
                "severity": "low",
                "message": "Consider using useCallback for effect dependencies"
            })
            
        return issues

    def _analyze_python(self, content: str) -> List[Dict]:
        """Analyze Python code"""
        issues = []
        try:
            tree = ast.parse(content)
            
            # Check for error handling
            has_try = False
            for node in ast.walk(tree):
                if isinstance(node, ast.Try):
                    has_try = True
                    break
            
            if not has_try:
                issues.append({
                    "type": "error_handling",
                    "severity": "medium",
                    "message": "Consider adding error handling with try/except"
                })
                
        except Exception as e:
            issues.append({
                "type": "syntax_error",
                "severity": "high",
                "message": str(e)
            })
            
        return issues