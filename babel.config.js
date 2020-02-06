module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: { node: '10' },
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        shippedProposals: true,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
