import { RuleConfigCondition, RuleConfigSeverity, TargetCaseType } from '@commitlint/types'

export default {
  parserPreset: 'conventional-changelog-conventionalcommits',
  prompt: {
    questions: {
      body: {
        description: '提供更详细的修改说明',
      },
      breaking: {
        description: '请描述破坏性变更的具体内容',
      },
      breakingBody: {
        description: '包含 BREAKING CHANGE 的提交必须填写正文，请详细描述本次提交内容',
      },
      isBreaking: {
        description: '是否包含破坏性变更？',
      },
      isIssueAffected: {
        description: '本次修改是否影响任何未关闭的 Issue？',
      },
      issues: {
        description: '添加 Issue 引用（例如："fix #123"、"re #123"）',
      },
      issuesBody: {
        description: '如果关闭了 Issue，则必须填写正文，请详细描述本次提交内容',
      },
      scope: {
        description: '本次变更的影响范围（例如：组件名或文件名）',
      },
      subject: {
        description: '用简短的祈使语气描述本次修改',
      },
      type: {
        description: '请选择你本次提交的变更类型',
        enum: {
          build: {
            description: '影响构建系统或外部依赖的修改（例如：gulp、broccoli、npm）',
            emoji: '🛠',
            title: '构建',
          },
          chore: {
            description: '其他不修改 src 或 test 文件的变更',
            emoji: '♻️',
            title: '杂项',
          },
          ci: {
            description: '修改 CI 配置文件或脚本（例如：Travis、Circle、BrowserStack、SauceLabs）',
            emoji: '⚙️',
            title: '持续集成',
          },
          docs: {
            description: '仅文档相关的修改',
            emoji: '📚',
            title: '文档',
          },
          feat: {
            description: '新增功能',
            emoji: '✨',
            title: '功能',
          },
          fix: {
            description: '修复缺陷',
            emoji: '🐛',
            title: '缺陷修复',
          },
          perf: {
            description: '提升性能的代码修改',
            emoji: '🚀',
            title: '性能优化',
          },
          refactor: {
            description: '既不修复缺陷也不新增功能的代码调整',
            emoji: '📦',
            title: '代码重构',
          },
          revert: {
            description: '回滚之前的提交',
            emoji: '🗑',
            title: '回滚',
          },
          style: {
            description: '不影响代码含义的修改（如空格、格式化、缺失的分号等）',
            emoji: '💎',
            title: '代码风格',
          },
          test: {
            description: '新增测试或修正现有测试',
            emoji: '🚨',
            title: '测试',
          },
        },
      },
    },
  },
  rules: {
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'header-trim': [RuleConfigSeverity.Error, 'always'] as const,
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ] as [RuleConfigSeverity, RuleConfigCondition, TargetCaseType[]],
    'subject-empty': [RuleConfigSeverity.Error, 'never'] as const,
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'] as const,
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'] as const,
    'type-empty': [RuleConfigSeverity.Error, 'never'] as const,
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  },
}
