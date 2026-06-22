/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'Fix', section: 'Bug Fixes' },
            { type: 'doc', hidden: false, section: 'Documentation' },
            { type: 'docs', hidden: false, section: 'Documentation' },
            { type: 'chore', hidden: true, section: 'Chores' },
          ],
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      // Build the bundle (with the freshly bumped version) so that the
      // gitignored dist/*.js exists for @semantic-release/github to attach.
      '@semantic-release/exec',
      {
        prepareCmd: 'yarn build',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.js',
      },
    ],
  ],
  preset: 'conventionalcommits',
  branches: [{ name: 'main' }, { name: 'dev', channel: 'beta', prerelease: true }],
};
