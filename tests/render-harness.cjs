/**
 * Minimal server-side render harness for component tests — no extra dependencies.
 *
 * Transpiles .ts/.tsx on require with the project's own TypeScript, resolves the
 * "@/..." path alias, and renders with react-dom/server.
 */
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')

for (const ext of ['.ts', '.tsx']) {
    Module._extensions[ext] = (module, filename) => {
        const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                jsx: ts.JsxEmit.ReactJSX,
                target: ts.ScriptTarget.ES2020,
                esModuleInterop: true,
            },
            fileName: filename,
        })
        module._compile(outputText, filename)
    }
}

const resolveFilename = Module._resolveFilename
Module._resolveFilename = function (request, ...rest) {
    return resolveFilename.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...rest)
}

function render(componentPath, props) {
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const Component = require(path.join(root, componentPath)).default
    return renderToStaticMarkup(React.createElement(Component, props))
}

/** Visible text of each <tr>, cells joined by " | " (entities decoded). */
function rows(html) {
    return [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(([, row]) =>
        [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)]
            .map(([, cell]) => cell.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
            .join(' | '),
    )
}

module.exports = { render, rows }
