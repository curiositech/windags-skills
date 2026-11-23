import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('./reality_check.mjs', import.meta.url);

test('the CLI emits JSON when invoked through a discovery symlink', () => {
  const fixture = mkdtempSync(join(process.cwd(), '.product-reality-test-'));
  try {
    const discovery = join(fixture, 'discovery');
    const script = join(discovery, 'reality_check.mjs');
    const input = join(fixture, 'product.json');
    symlinkSync(fileURLToPath(new URL('.', moduleUrl)), discovery,
      process.platform === 'win32' ? 'junction' : 'dir');
    writeFileSync(input, JSON.stringify({ name: 'Fixture' }));

    const output = execFileSync(process.execPath, [script, '--input', input], { encoding: 'utf8' });
    const report = JSON.parse(output);
    assert.equal(report.name, 'Fixture');
    assert.equal(report.verdict, 'not-ready');
    assert.equal(report.summary.findingCount, 10);
  } finally {
    rmSync(fixture, { recursive: true });
  }
});

test('importing the module from stdin never starts the CLI', () => {
  const source = `await import(${JSON.stringify(moduleUrl.href)});`;
  const noArgv = execFileSync(process.execPath, ['--input-type=module', '-e', source], {
    encoding: 'utf8',
  });
  assert.equal(noArgv, '');

  const missingArgv = execFileSync(process.execPath, ['--input-type=module', '-'], {
    input: `process.argv[1] = '.missing-product-review-entry.mjs'; ${source}`,
    encoding: 'utf8',
  });
  assert.equal(missingArgv, '');
});
