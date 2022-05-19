require('esbuild').build({
    entryPoints: ['server/dist/server/src/index.js'],
    bundle: true,
    platform: 'node',
    target: ['node16'],
    outfile: 'server/out/index.js',
    sourcemap: "inline",
    keepNames: true,
    minifySyntax: false
}).catch(err => console.log("build error", err))

require('esbuild').build({
    entryPoints: ['client/dist/client/src/client.js'],
    bundle: true,
    platform: 'node',
    target: ['node16'],
    outfile: 'client/out/index.js',
    sourcemap: "inline",
    keepNames: true,
    minifySyntax: false
}).catch(err => console.log("build error", err))