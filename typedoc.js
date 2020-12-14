module.exports = {
  out: 'docs',

  readme: 'README.md',
  includes: 'src',
  exclude: [
    '**/{__mocks__,.github,.rpt2_cache,.vscode,assets,cache,coverage,data,dist,node_modules,tests,tools}/**/*',
    '**/grammar.ts',
  ],

  mode: 'file',
  includeDeclarations: true,
  excludeExternals: true,
  // excludeNotExported: true,
  excludePrivate: true,
}
