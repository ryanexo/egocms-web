import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

import {
  perfectionistConfig,
  prettierConfig,
  sortImportsConfig,
  tsConfig,
} from './config/eslint-config'

export default defineConfigWithVueTs(
  {
    files: ['**/*.{vue,ts,mts,tsx}'],
    name: 'app/files-to-lint',
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', './*.d.ts']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  skipFormatting,

  pluginOxlint.configs['flat/recommended'],

  sortImportsConfig,
  tsConfig,
  perfectionistConfig,
  prettierConfig,
)
