from typing import Dict, List
import ast

class CodeAnalyzer:
    def analyze_file(self, content: str, file_path: str) -> List[Dict]:
        """Analyze a single file for potential improvements"""
        issues = []
        
        if file_path.endswith(('.ts', '.tsx')):
            issues.extend(self._analyze_typescript(content))
        elif file_path.endswith('.py'):
            issues.extend(self._analyze_python(content))
            
        return issues
    
    def _analyze_typescript(self, content: str) -> List[Dict]:
        issues = []
        
        # Check for any types
        if 'any' in content:
            issues.append({
                'type': 'type_safety',
                'severity': 'medium',
                'message': 'Consider replacing "any" with more specific types'
            })
            
        # Check for useEffect without dependencies array
        if 'useEffect(' in content and '], []);' not in content:
            issues.append({
                'type': 'react_hook',
                'severity': 'high',
                'message': 'useEffect is missing dependencies array'
            })
            
        return issues
    
    def _analyze_python(self, content: str) -> List[Dict]:
        issues = []
        
        try:
            tree = ast.parse(content)
            
            # Check error handling
            has_try = False
            for node in ast.walk(tree):
                if isinstance(node, ast.Try):
                    has_try = True
                    break
                    
            if not has_try:
                issues.append({
                    'type': 'error_handling',
                    'severity': 'medium',
                    'message': 'Consider adding error handling with try/except'
                })
                
        except Exception as e:
            issues.append({
                'type': 'syntax_error',
                'severity': 'high',
                'message': str(e)
            })
            
        return issues