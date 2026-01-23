import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

import sortImports from './config/eslint-config/imports'
import perfectionist from './config/eslint-config/perfectionist'
import prettierEslintConfig from './config/eslint-config/prettier'
import tsConfig from './config/eslint-config/typescript'

export default defineConfigWithVueTs(
  {
    files: ['**/*.{vue,ts,mts,tsx}'],
    name: 'app/files-to-lint',
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  skipFormatting,

  pluginOxlint.configs['flat/recommended'],

  sortImports,
  tsConfig,
  perfectionist,
  prettierEslintConfig,
)
