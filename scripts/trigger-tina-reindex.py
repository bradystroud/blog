#!/usr/bin/env python3

import os
from pathlib import Path

"""
Script to trigger TinaCMS to reindex content files
Makes a minimal change (adds a space) to each markdown/MDX file
"""

def get_all_markdown_files(directory):
    """Recursively find all .md and .mdx files in a directory"""
    markdown_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                markdown_files.append(os.path.join(root, file))
    return markdown_files

def trigger_reindex():
    print('🔍 Finding all markdown and MDX files...\n')
    
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    content_dir = project_root / 'content'
    
    # Find all markdown files
    files = get_all_markdown_files(content_dir)
    
    print(f'📝 Found {len(files)} files to process\n')
    
    success_count = 0
    error_count = 0
    
    for file_path in files:
        try:
            # Get relative path for display
            relative_path = os.path.relpath(file_path, project_root)
            
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Add a space at the end (minimal change)
            updated_content = content + ' '
            
            # Write back to the file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print(f'✅ Updated: {relative_path}')
            success_count += 1
            
        except Exception as error:
            print(f'❌ Error processing {file_path}: {error}')
            error_count += 1
    
    print('\n' + '=' * 50)
    print('✨ Reindex trigger complete!')
    print(f'   Success: {success_count}')
    print(f'   Errors: {error_count}')
    print('=' * 50)

if __name__ == '__main__':
    try:
        trigger_reindex()
    except Exception as error:
        print(f'Fatal error: {error}')
        exit(1)
