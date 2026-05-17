/** 去除 HTML 标签，用于摘要展示与校验 */
export function stripHtml(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 富文本是否为空（仅空白标签） */
export function isRichTextEmpty(html?: string | null): boolean {
  return stripHtml(html).length === 0;
}
