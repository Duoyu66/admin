import { useMemo } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ensureHljsRegistered, hljs } from './hljs-register';
import styles from './DemoExampleCard.module.less';

ensureHljsRegistered();

interface DemoCodeBlockProps {
  code: string;
  language?: string;
}

/** 演示代码块 — highlight.js 语法高亮 */
export function DemoCodeBlock({ code, language = 'typescript' }: DemoCodeBlockProps) {
  const colorMode = useThemeStore((s) => s.colorMode);

  const highlighted = useMemo(() => {
    const trimmed = code.trim();
    try {
      if (hljs.getLanguage(language)) {
        return hljs.highlight(trimmed, { language }).value;
      }
    } catch {
      // fallback below
    }
    return hljs.highlightAuto(trimmed).value;
  }, [code, language]);

  return (
    <pre
      className={`${styles.codeBlock} ${colorMode === 'dark' ? styles.codeBlockDark : styles.codeBlockLight}`}
    >
      <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
