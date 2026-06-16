/**
 * Flags hardcoded user-facing strings in JSX so they can be moved to i18n.
 * Detects: JSX text, string literals rendered in JSX, translatable UI props
 * (title, placeholder, label, accessibilityLabel…), and Alert.alert() strings.
 * Ignores: t('...') calls, console.*, SVG/graphic tags, and technical props.
 *
 * Run: npm run validate:ui
 */
const fs = require('fs');
const path = require('path');

let parser, traverse;
try {
  parser = require('@babel/parser');
  traverse = require('@babel/traverse').default;
} catch {
  console.error('❌ Missing AST dependencies. Install: npm i -D @babel/parser @babel/traverse');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '../..');

// Folders to scan.
const SCAN_DIRS = ['app', 'src/components', 'src/screens'];

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.expo',
  'ios',
  'android',
  'locales',
  'scripts',
]);

// Props that typically hold visible UI text.
const UI_TEXT_ATTRS = new Set([
  'title',
  'placeholder',
  'label',
  'headerTitle',
  'accessibilityLabel',
  'accessibilityHint',
  'aria-label',
  'ariaLabel',
]);

// Props that are usually IDs / technical, never UI text.
const IGNORE_ATTRS = new Set(['testID', 'key', 'className', 'style', 'name', 'id', 'source']);

// Tags that contain technical / graphic text (not translatable UI).
const IGNORE_TAGS = new Set(['SvgText', 'TSpan', 'TextPath', 'G', 'Path', 'Svg', 'Rect', 'Circle']);

function isInsideIgnoredTag(pathNode) {
  let p = pathNode.parentPath;
  while (p) {
    if (p.isJSXElement && p.isJSXElement()) {
      const nameNode = p.node.openingElement.name;
      let tagName = '';
      if (nameNode.type === 'JSXIdentifier') tagName = nameNode.name;
      else if (nameNode.type === 'JSXMemberExpression' && nameNode.property)
        tagName = nameNode.property.name;
      if (tagName && IGNORE_TAGS.has(tagName)) return true;
    }
    p = p.parentPath;
  }
  return false;
}

function isWhitespaceOnly(str) {
  return !str || str.trim().length === 0;
}

function hasTranslatableText(str) {
  // Ignore strings without letters (symbols, numbers, separators).
  if (!str) return false;
  return /\p{L}/u.test(str);
}

function isSimpleTemplateLiteral(node) {
  return (
    node && node.type === 'TemplateLiteral' && node.expressions && node.expressions.length === 0
  );
}

function getStringValue(node) {
  if (!node) return null;
  if (node.type === 'StringLiteral') return node.value;
  if (isSimpleTemplateLiteral(node)) return node.quasis.map((q) => q.value.cooked).join('');
  return null;
}

function toPos(loc) {
  if (!loc) return { line: 0, column: 0 };
  return { line: loc.start.line, column: loc.start.column + 1 };
}

function excerptAt(code, loc, maxLen = 140) {
  if (!loc) return '';
  const lines = code.split(/\r?\n/);
  const line = lines[loc.start.line - 1] || '';
  const trimmed = line.trim();
  return trimmed.length <= maxLen ? trimmed : trimmed.slice(0, maxLen) + '…';
}

function walkDir(dirPath, results) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walkDir(full, results);
      continue;
    }
    if (EXTENSIONS.has(path.extname(entry.name))) results.push(full);
  }
}

function isInsideTCall(pathNode) {
  let p = pathNode;
  while (p) {
    if (p.isCallExpression && p.isCallExpression()) {
      const callee = p.node.callee;
      if (callee && callee.type === 'Identifier' && callee.name === 't') return true;
      if (
        callee &&
        callee.type === 'MemberExpression' &&
        callee.property &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 't'
      )
        return true;
    }
    p = p.parentPath;
  }
  return false;
}

function isConsoleCall(pathNode) {
  if (!pathNode || !pathNode.isCallExpression || !pathNode.isCallExpression()) return false;
  const callee = pathNode.node.callee;
  if (!callee || callee.type !== 'MemberExpression') return false;
  const obj = callee.object;
  return obj && obj.type === 'Identifier' && obj.name === 'console';
}

function calleeToString(callee) {
  if (!callee) return '';
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression') {
    const left = calleeToString(callee.object);
    const right =
      callee.property && callee.property.type === 'Identifier' ? callee.property.name : '';
    return left && right ? `${left}.${right}` : left || right;
  }
  return '';
}

function validateFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');

  let ast;
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
    });
  } catch (e) {
    return [
      { file: filePath, line: 0, column: 0, kind: 'parse_error', message: e.message, excerpt: '' },
    ];
  }

  const issues = [];
  const stringConstBindings = new Set();

  function addIssue(node, kind, message) {
    const pos = toPos(node && node.loc);
    issues.push({
      file: filePath,
      line: pos.line,
      column: pos.column,
      kind,
      message,
      excerpt: excerptAt(code, node && node.loc),
    });
  }

  traverse(ast, {
    VariableDeclarator(p) {
      const { id, init } = p.node;
      if (!id || id.type !== 'Identifier') return;
      if (getStringValue(init) === null) return;
      const binding = p.scope.getBinding(id.name);
      if (binding) stringConstBindings.add(binding);
    },

    JSXText(p) {
      const raw = p.node.value;
      if (isWhitespaceOnly(raw)) return;
      if (!hasTranslatableText(raw)) return;
      if (isInsideIgnoredTag(p)) return;
      addIssue(p.node, 'jsx_text', 'Hardcoded JSX text. Replace it with {t("...")}.');
    },

    JSXExpressionContainer(p) {
      if (p.parentPath && p.parentPath.isJSXAttribute && p.parentPath.isJSXAttribute()) return;
      if (isInsideIgnoredTag(p)) return;

      const expr = p.node.expression;
      if (!expr) return;

      const direct = getStringValue(expr);
      if (direct !== null && !isWhitespaceOnly(direct)) {
        if (!hasTranslatableText(direct)) return;
        addIssue(p.node, 'jsx_expr_string', 'Hardcoded string in JSX. Replace it with t("...").');
        return;
      }

      if (expr.type === 'Identifier') {
        const binding = p.scope.getBinding(expr.name);
        if (binding && stringConstBindings.has(binding)) {
          addIssue(
            p.node,
            'jsx_identifier_string',
            `String constant "${expr.name}" used in JSX. It should come from i18n.`
          );
        }
      }
    },

    JSXAttribute(p) {
      const nameNode = p.node.name;
      if (!nameNode || nameNode.type !== 'JSXIdentifier') return;
      const attrName = nameNode.name;

      if (IGNORE_ATTRS.has(attrName)) return;
      if (!UI_TEXT_ATTRS.has(attrName)) return;

      const valNode = p.node.value;
      if (!valNode) return;

      if (valNode.type === 'StringLiteral') {
        if (!isWhitespaceOnly(valNode.value) && hasTranslatableText(valNode.value)) {
          addIssue(
            valNode,
            'jsx_attr_string',
            `Prop "${attrName}" with hardcoded string. Replace it with {t("...")}.`
          );
        }
        return;
      }

      if (valNode.type === 'JSXExpressionContainer') {
        const expr = valNode.expression;

        if (expr && expr.type === 'CallExpression') {
          const callee = expr.callee;
          if (callee && callee.type === 'Identifier' && callee.name === 't') return;
          if (
            callee &&
            callee.type === 'MemberExpression' &&
            callee.property &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 't'
          )
            return;
        }

        const direct = getStringValue(expr);
        if (direct !== null && !isWhitespaceOnly(direct)) {
          if (!hasTranslatableText(direct)) return;
          addIssue(
            valNode,
            'jsx_attr_expr_string',
            `Prop "${attrName}" with hardcoded string. Replace it with t("...").`
          );
          return;
        }

        if (expr && expr.type === 'Identifier') {
          const binding = p.scope.getBinding(expr.name);
          if (binding && stringConstBindings.has(binding)) {
            addIssue(
              valNode,
              'jsx_attr_identifier_string',
              `Prop "${attrName}" uses string constant "${expr.name}". It should come from i18n.`
            );
          }
        }
      }
    },

    CallExpression(p) {
      if (isConsoleCall(p)) return;
      if (isInsideTCall(p)) return;

      if (calleeToString(p.node.callee) === 'Alert.alert') {
        const args = p.node.arguments || [];
        for (let i = 0; i < Math.min(args.length, 2); i++) {
          const s = getStringValue(args[i]);
          if (s !== null && !isWhitespaceOnly(s) && hasTranslatableText(s)) {
            addIssue(
              args[i],
              'alert_string',
              'Alert.alert with hardcoded string. Replace it with t("...").'
            );
          }
        }
      }
    },
  });

  return issues;
}

function formatIssue(i) {
  const rel = path.relative(ROOT_DIR, i.file);
  const where = i.line ? `${rel}:${i.line}:${i.column}` : rel;
  return [
    `❌ ${where}`,
    `   Type: ${i.kind}`,
    `   Reason: ${i.message}`,
    i.excerpt ? `   → ${i.excerpt}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function main() {
  console.log('🔎 Checking for hardcoded UI text...\n');

  const files = [];
  for (const d of SCAN_DIRS) walkDir(path.join(ROOT_DIR, d), files);

  if (files.length === 0) {
    console.log('⚠️  No files found to analyze. Check SCAN_DIRS.');
    process.exit(0);
  }

  let allIssues = [];
  for (const f of files) {
    const issues = validateFile(f);
    if (issues.length) allIssues = allIssues.concat(issues);
  }

  if (allIssues.length) {
    allIssues.sort((a, b) => {
      if (a.file !== b.file) return a.file.localeCompare(b.file);
      if (a.line !== b.line) return a.line - b.line;
      return a.column - b.column;
    });

    console.error(`❌ Found ${allIssues.length} possible hardcoded strings:\n`);
    for (const i of allIssues) {
      console.error(formatIssue(i));
      console.error('');
    }
    console.error('❌ Validation failed. Move these strings to i18n and run again.');
    process.exit(1);
  }

  console.log('✅ OK: No hardcoded UI text detected.');
}

main();
