const { HTMLTheme } = require('fliegdoc');

module.exports = {
    baseUrl: './server',
    outDir: './docs/server',
    readme: './README.md',
    modules: [
        {
            package: './package.json',
            tsconfig: './server/tsconfig.json',
            mainFile: './server/index.ts'
        }
    ],
    title: 'Esx Next Server Documentation',
    externalLinks: {}, // e.g.: { "GitHub": "https://github.com/fliegwerk/fliegdoc" }
    hidePrivateMembers: true,
    theme: HTMLTheme
};