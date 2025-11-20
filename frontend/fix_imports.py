import os
import re

def fix_imports(directory):
    # Regex to match imports with version numbers like @1.2.3
    # Matches: import ... from "pkg@1.2.3"
    # We want to remove the @1.2.3 part
    # Updated regex to handle package names starting with @
    pattern = re.compile(r'(from\s+[\'"])(.+?)(@\d+\.\d+\.\d+)([\'"])')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = pattern.sub(r'\1\2\4', content)
                
                if new_content != content:
                    print(f"Fixing {filepath}")
                    with open(filepath, 'w') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_imports('/Users/kai/Desktop/cisc 320/clubr/Clubr/frontend/src')
