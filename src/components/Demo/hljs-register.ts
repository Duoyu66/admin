import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

let registered = false;

/** 注册 highlight.js 语言（仅执行一次） */
export function ensureHljsRegistered() {
  if (registered) return;
  hljs.registerLanguage('typescript', typescript);
  registered = true;
}

export { hljs };
