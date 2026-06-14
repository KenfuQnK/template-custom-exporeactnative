const fs = require('fs')
const path = require('path')

let parser, traverse
try {
    parser = require('@babel/parser')
    traverse = require('@babel/traverse').default
} catch (e) {
    console.error('❌ Faltan dependencias para parsear AST.')
    console.error('Instala: npm i -D @babel/parser @babel/traverse')
    process.exit(1)
}

const ROOT_DIR = path.join(__dirname, '..')

// Carpetas a revisar (ajusta según tu repo)
const SCAN_DIRS = [
    'app',
    'components',
    'screens',
    'navigation',
    'modals',
]

// Extensiones a revisar
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

// Carpetas a ignorar
const IGNORE_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.expo',
    'ios',
    'android',
    'locales', // traducciones
])

// Props típicos de UI donde suele haber texto visible
const UI_TEXT_ATTRS = new Set([
    'title',
    'placeholder',
    'label',
    'headerTitle',
    'accessibilityLabel',
    'accessibilityHint',
    'aria-label',
    'ariaLabel',
])

// Atributos que suelen ser IDs o cosas técnicas; no los tratamos como UI visible
const IGNORE_ATTRS = new Set([
    'testID',
    'key',
    'className',
    'style',
    'name',
    'id',
    'source',
])

function isWhitespaceOnly(str) {
    return !str || str.trim().length === 0
}

function isSimpleTemplateLiteral(node) {
    return node && node.type === 'TemplateLiteral' && node.expressions && node.expressions.length === 0
}

function getStringValue(node) {
    if (!node) return null
    if (node.type === 'StringLiteral') return node.value
    if (isSimpleTemplateLiteral(node)) return node.quasis.map(q => q.value.cooked).join('')
    return null
}

function toPos(loc) {
    if (!loc) return { line: 0, column: 0 }
    return { line: loc.start.line, column: loc.start.column + 1 }
}

function excerptAt(code, loc, maxLen = 140) {
    if (!loc) return ''
    const lines = code.split(/\r?\n/)
    const line = lines[loc.start.line - 1] || ''
    const trimmed = line.trim()
    if (trimmed.length <= maxLen) return trimmed
    return trimmed.slice(0, maxLen) + '…'
}

function walkDir(dirPath, results) {
    if (!fs.existsSync(dirPath)) return

    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
        const full = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name)) continue
            walkDir(full, results)
            continue
        }

        const ext = path.extname(entry.name)
        if (!EXTENSIONS.has(ext)) continue
        results.push(full)
    }
}

function isInsideTCall(pathNode) {
    // Evita marcar strings como: t('auth:login.title')
    // Soporta: t(...), i18n.t(...)
    let p = pathNode
    while (p) {
        if (p.isCallExpression && p.isCallExpression()) {
            const callee = p.node.callee
            if (callee && callee.type === 'Identifier' && callee.name === 't') return true
            if (
                callee &&
                callee.type === 'MemberExpression' &&
                callee.property &&
                callee.property.type === 'Identifier' &&
                callee.property.name === 't'
            ) return true
        }
        p = p.parentPath
    }
    return false
}

function isConsoleCall(pathNode) {
    if (!pathNode || !pathNode.isCallExpression || !pathNode.isCallExpression()) return false
    const callee = pathNode.node.callee
    if (!callee || callee.type !== 'MemberExpression') return false
    const obj = callee.object
    if (!obj || obj.type !== 'Identifier' || obj.name !== 'console') return false
    return true
}

function calleeToString(callee) {
    // Convierte Alert.alert => "Alert.alert"
    if (!callee) return ''
    if (callee.type === 'Identifier') return callee.name
    if (callee.type === 'MemberExpression') {
        const left = calleeToString(callee.object)
        const right =
            callee.property && callee.property.type === 'Identifier'
                ? callee.property.name
                : ''
        return left && right ? `${left}.${right}` : left || right
    }
    return ''
}

function validateFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8')

    let ast
    try {
        ast = parser.parse(code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'typescript',
                'classProperties',
                'objectRestSpread',
                'optionalChaining',
                'nullishCoalescingOperator',
                'dynamicImport',
                'decorators-legacy',
            ],
            errorRecovery: true,
        })
    } catch (e) {
        return [{
            file: filePath,
            line: 0,
            column: 0,
            kind: 'parse_error',
            message: `No se pudo parsear el archivo: ${e.message}`,
            excerpt: '',
        }]
    }

    const issues = []

    // Heurística: constantes string (const x = "Hola") para detectar uso en JSX: <Text>{x}</Text>
    // Guardamos bindings de variables inicializadas con string literal / template simple.
    const stringConstBindings = new Set()

    function addIssue(node, kind, message) {
        const pos = toPos(node && node.loc)
        issues.push({
            file: filePath,
            line: pos.line,
            column: pos.column,
            kind,
            message,
            excerpt: excerptAt(code, node && node.loc),
        })
    }

    traverse(ast, {
        VariableDeclarator(p) {
            const { id, init } = p.node
            if (!id || id.type !== 'Identifier') return
            const val = getStringValue(init)
            if (val === null) return
            if (isInsideTCall(p)) return // no aplica, pero por coherencia
            const binding = p.scope.getBinding(id.name)
            if (binding) stringConstBindings.add(binding)
        },

        JSXText(p) {
            const raw = p.node.value
            if (isWhitespaceOnly(raw)) return

            // JSXText real (ej: <Text>Hola</Text>)
            addIssue(
                p.node,
                'jsx_text',
                'Texto hardcodeado en JSX. Sustitúyelo por {t("...")}.'
            )
        },

        JSXExpressionContainer(p) {
            const expr = p.node.expression
            if (!expr) return

            // <Text>{"Hola"}</Text> o <Text>{`Hola`}</Text>
            const direct = getStringValue(expr)
            if (direct !== null && !isWhitespaceOnly(direct)) {
                addIssue(
                    p.node,
                    'jsx_expr_string',
                    'String hardcodeado en expresión JSX. Sustitúyelo por t("...").'
                )
                return
            }

            // <Text>{title}</Text> donde title = "Hola"
            if (expr.type === 'Identifier') {
                const binding = p.scope.getBinding(expr.name)
                if (binding && stringConstBindings.has(binding)) {
                    addIssue(
                        p.node,
                        'jsx_identifier_string',
                        `Constante string "${expr.name}" usada en JSX. Debe venir de i18n.`
                    )
                }
            }
        },

        JSXAttribute(p) {
            const nameNode = p.node.name
            if (!nameNode || nameNode.type !== 'JSXIdentifier') return
            const attrName = nameNode.name

            if (IGNORE_ATTRS.has(attrName)) return
            if (!UI_TEXT_ATTRS.has(attrName)) return

            const valNode = p.node.value
            if (!valNode) return

            // placeholder="Hola"
            if (valNode.type === 'StringLiteral') {
                if (!isWhitespaceOnly(valNode.value)) {
                    addIssue(
                        valNode,
                        'jsx_attr_string',
                        `Prop "${attrName}" con string hardcodeado. Sustitúyelo por {t("...")}.`
                    )
                }
                return
            }

            // placeholder={"Hola"} o placeholder={`Hola`} o placeholder={title}
            if (valNode.type === 'JSXExpressionContainer') {
                const expr = valNode.expression

                // placeholder={t('...')} => OK
                if (expr && expr.type === 'CallExpression') {
                    const callee = expr.callee
                    if (callee && callee.type === 'Identifier' && callee.name === 't') return
                    if (
                        callee &&
                        callee.type === 'MemberExpression' &&
                        callee.property &&
                        callee.property.type === 'Identifier' &&
                        callee.property.name === 't'
                    ) return
                }

                const direct = getStringValue(expr)
                if (direct !== null && !isWhitespaceOnly(direct)) {
                    addIssue(
                        valNode,
                        'jsx_attr_expr_string',
                        `Prop "${attrName}" con string hardcodeado. Sustitúyelo por t("...").`
                    )
                    return
                }

                if (expr && expr.type === 'Identifier') {
                    const binding = p.scope.getBinding(expr.name)
                    if (binding && stringConstBindings.has(binding)) {
                        addIssue(
                            valNode,
                            'jsx_attr_identifier_string',
                            `Prop "${attrName}" usa constante string "${expr.name}". Debe venir de i18n.`
                        )
                    }
                }
            }
        },

        CallExpression(p) {
            // No traducimos consola
            if (isConsoleCall(p)) return
            // No marcamos strings dentro de t('...')
            if (isInsideTCall(p)) return

            const calleeStr = calleeToString(p.node.callee)

            // Alert.alert("Título", "Mensaje")
            if (calleeStr === 'Alert.alert') {
                const args = p.node.arguments || []
                for (let i = 0; i < Math.min(args.length, 2); i++) {
                    const s = getStringValue(args[i])
                    if (s !== null && !isWhitespaceOnly(s)) {
                        addIssue(
                            args[i],
                            'alert_string',
                            'Alert.alert con string hardcodeado. Sustitúyelo por t("...").'
                        )
                    }
                }
            }
        },
    })

    return issues
}

function formatIssue(i) {
    const rel = path.relative(ROOT_DIR, i.file)
    const where = i.line ? `${rel}:${i.line}:${i.column}` : rel
    return [
        `❌ ${where}`,
        `   Tipo: ${i.kind}`,
        `   Motivo: ${i.message}`,
        i.excerpt ? `   → ${i.excerpt}` : '',
    ].filter(Boolean).join('\n')
}

function main() {
    console.log('🔎 Validando que no haya textos hardcodeados en UI...\n')

    const files = []
    for (const d of SCAN_DIRS) {
        const full = path.join(ROOT_DIR, d)
        walkDir(full, files)
    }

    if (files.length === 0) {
        console.log('⚠️  No se encontraron archivos para analizar. Revisa SCAN_DIRS.')
        process.exit(0)
    }

    let allIssues = []
    for (const f of files) {
        const issues = validateFile(f)
        if (issues.length) allIssues = allIssues.concat(issues)
    }

    if (allIssues.length) {
        // Ordena para lectura
        allIssues.sort((a, b) => {
            if (a.file !== b.file) return a.file.localeCompare(b.file)
            if (a.line !== b.line) return a.line - b.line
            return a.column - b.column
        })

        console.error(`❌ Encontrados ${allIssues.length} posibles textos hardcodeados:\n`)
        for (const i of allIssues) {
            console.error(formatIssue(i))
            console.error('')
        }

        console.error('❌ Validación fallida. Migra esos textos a i18n y vuelve a ejecutar.')
        process.exit(1)
    }

    console.log('✅ OK: No se detectaron textos hardcodeados en UI.')
}

main()
