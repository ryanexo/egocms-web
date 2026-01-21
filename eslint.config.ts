import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

import sortImports from './packages/eslint-config/imports'
import prettierEslintConfig from './packages/eslint-config/prettier'
import tsConfig from './packages/eslint-config/typescript'

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
  prettierEslintConfig,
)
