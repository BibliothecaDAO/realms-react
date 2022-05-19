/**
 * Specific eslint rules for this app/package, extends the base rules
 * @see https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-linters.md
 */

const {
  getDefaultIgnorePatterns,
} = require('@bibliotheca-dao/eslint-config-bases/helpers');

module.exports = {
  root: true,
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: [
    '@bibliotheca-dao/eslint-config-bases/typescript',
    '@bibliotheca-dao/eslint-config-bases/sonar',
    '@bibliotheca-dao/eslint-config-bases/regexp',
    '@bibliotheca-dao/eslint-config-bases/jest',
    '@bibliotheca-dao/eslint-config-bases/rtl',
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
