/**
 * Specific eslint rules for this app/package, extends the base rules
 * @see https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-linters.md
 */

// Workaround for https://github.com/eslint/eslint/issues/3458 (re-export of @rushstack/eslint-patch)
require('@bibliotheca-dao/eslint-config-bases/patch/modern-module-resolution');

const {
  getDefaultIgnorePatterns,
} = require('@bibliotheca-dao/eslint-config-bases/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns(), '/storybook-static'],
  extends: [
    '@bibliotheca-dao/eslint-config-bases/typescript',
    '@bibliotheca-dao/eslint-config-bases/regexp',
    '@bibliotheca-dao/eslint-config-bases/sonar',
    '@bibliotheca-dao/eslint-config-bases/jest',
    '@bibliotheca-dao/eslint-config-bases/rtl',
    '@bibliotheca-dao/eslint-config-bases/storybook',
    '@bibliotheca-dao/eslint-config-bases/react',
    // Apply prettier and disable incompatible rules
    '@bibliotheca-dao/eslint-config-bases/prettier',
  ],
  rules: {
    // optional overrides per project
  },
  overrides: [
    // optional overrides per project file match
  ],
};
