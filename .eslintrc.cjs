module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    curly: ['error', 'multi-line'],
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-template': 'error', // 엄격도 상승. autofix 자동 치환 활성화
    'prefer-const': ['error', { destructuring: 'all' }],
    'arrow-parens': ['error', 'as-needed'],
    'no-restricted-globals': [
      'error',
      'name', 'status', 'origin', // 브라우저엔 존재하나 노드에는 존재하지 않는 전역 변수. 치명적 에러 야기
    ],
    'one-var': 'off',
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_(\\d+)?$' }],
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: true,
      after: true,
      overrides: { colon: { before: false, after: true } },
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
    'vue/multi-word-component-names': 'off', // 한단어 컴포넌트 허용
    'vue/no-multiple-template-root': 'off',
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 4, multiline: 4 }], // 4개 정도까진 한줄에 봐줄만 함
    'vue/first-attribute-linebreak': ['error', { singleline: 'beside', multiline: 'ignore' }],
    'vue/singleline-html-element-content-newline': 'off', // 한줄에 나와야 가독성 좋은 경우 많음
    'vue/multiline-html-element-content-newline': 'off', // 한줄에 나와야 가독성 좋은 경우 많음
    'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }], // 가독성을 해침
    'vue/require-name-property': 'error', // 컴포넌트 이름 표기 필수
  },
}
