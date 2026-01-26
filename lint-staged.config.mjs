export default {
  '*.md': ['prettier --cache --ignore-unknown --write'],
  '*.vue': ['prettier --write', 'eslint --cache --fix'],
  '*.{js,jsx,ts,tsx}': ['prettier --cache --ignore-unknown  --write', 'eslint --cache --fix'],
  'package.json': ['prettier --cache --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'prettier --cache --write--parser json',
  ],
}
