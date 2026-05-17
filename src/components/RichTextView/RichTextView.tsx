import styles from './RichTextView.module.less';

export interface RichTextViewProps {
  html?: string;
  className?: string;
}

/** 富文本 HTML 只读展示 */
export function RichTextView({ html, className }: RichTextViewProps) {
  if (!html) {
    return null;
  }
  return (
    <div
      className={`${styles.view} ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
