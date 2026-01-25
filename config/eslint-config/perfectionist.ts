import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  perfectionist.configs['recommended-natural'],
  { rules: { 'no-debugger': 'off', 'perfectionist/sort-modules': 'off' } },
])
