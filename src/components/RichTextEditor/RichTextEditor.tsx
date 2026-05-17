import { useEffect, useMemo } from 'react';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextToolbar } from './RichTextToolbar';
import styles from './RichTextEditor.module.less';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
}

/** Tiptap 富文本编辑器（表单受控） */
export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入内容…',
  maxLength = 20000,
  readOnly = false,
}: RichTextEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    [placeholder, maxLength],
  );

  const editor = useEditor(
    {
      extensions,
      content: value,
      editable: !readOnly,
      onUpdate: ({ editor: ed }) => {
        onChange?.(ed.getHTML());
      },
    },
    [extensions, readOnly],
  );

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current === value) return;
    editor.commands.setContent(value, false);
  }, [editor, value]);

  const characters = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className={`${styles.wrap} ${readOnly ? styles.readonly : ''}`}>
      {!readOnly && <RichTextToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={`${styles.editor} ${readOnly ? styles.editorReadonly : ''}`}
      />
      {!readOnly && (
        <div className={styles.footer}>
          <span className={characters >= maxLength ? styles.footerLimit : undefined}>
            {characters} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
