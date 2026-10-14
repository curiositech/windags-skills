import yaml from "js-yaml";

/**
 * Read YAML frontmatter and preserve the body after an LF or CRLF checkout.
 *
 * Git checks out CRLF on Windows runners. Treat line endings as delimiters
 * rather than rejecting the entire catalog and building an empty search corpus.
 * Invalid YAML remains unavailable to all catalog consumers.
 *
 * @param {string} raw Complete UTF-8 skill file.
 * @returns {{frontmatter: object, body: string} | null} Parsed skill or null.
 */
export function parseSkillDocument(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?([\s\S]*)$/);
  if (!match) return null;
  try {
    const frontmatter = yaml.load(match[1]) ?? {};
    if (typeof frontmatter !== "object" || Array.isArray(frontmatter)) return null;
    return { frontmatter, body: match[2] ?? "" };
  } catch {
    return null;
  }
}
