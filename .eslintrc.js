module.exports = {
  plugins: ['prettier','react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'no-param-reassign': 0,
    'prefer-promise-reject-errors': 0,
    'no-restricted-syntax': 0,
    'no-restricted-properties': 0,
    'no-plusplus': 0,
    'no-restricted-globals': 0,
    'no-obj-calls': 0,
    'react/react-in-jsx-scope': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  extends: [require.resolve('@umijs/fabric/dist/eslint'),'plugin:react-hooks/recommended'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
};
