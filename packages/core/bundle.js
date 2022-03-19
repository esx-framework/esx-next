require('esbuild').build({
    entryPoints: ['dist/server/server.js'],
    bundle: true,
    platform: 'node',
    target: ['node16'],
    outfile: 'dist/server.js',
    sourcemap: "inline",
    keepNames: true,
    minifySyntax: false
}).catch(err => console.log("build error", err))

require('esbuild').build({
    entryPoints: ['dist/client/client.js'],
    bundle: true,
    platform: 'node',
    target: ['node16'],
    outfile: 'dist/client.js',
    sourcemap: "inline",
    keepNames: true,
    minifySyntax: false
}).catch(err => console.log("build error", err))