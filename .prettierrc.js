// @ts-check

/**
 * @type {import('prettier').Config}
 */

const {
  getPrettierConfig,
} = require('@bibliotheca-dao/eslint-config-bases/helpers');

const { overrides = [], ...prettierConfig } = getPrettierConfig();

module.exports = {
  ...prettierConfig,
  overrides: [
    ...overrides,
    ...[
      {
        files: '*.md',
        options: {
          singleQuote: false,
          quoteProps: 'preserve',
        },
      },
    ],
  ],
};
