import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import { Tooltip } from 'antd';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import styles from './RichTextEditor.module.less';

interface RichTextToolbarProps {
  editor: Editor | null;
}

function ToolbarButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <button
        type="button"
        className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ''}`}
        disabled={disabled}
        onClick={onClick}
        aria-label={title}
      >
        {children}
      </button>
    </Tooltip>
  );
}

function Divider() {
  return <span className={styles.toolDivider} aria-hidden />;
}

/** Tiptap 工具栏 */
export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('链接地址', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setImage = () => {
    const url = window.prompt('图片地址');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const iconSize = 16;

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="富文本工具栏">
      <ToolbarButton
        title="撤销"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="重做"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={iconSize} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="标题 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="标题 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="标题 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={iconSize} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="加粗"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="斜体"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="下划线"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="删除线"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={iconSize} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="无序列表"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="有序列表"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="引用"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="代码块"
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={iconSize} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="左对齐"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="居中"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="右对齐"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={iconSize} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="链接" active={editor.isActive('link')} onClick={setLink}>
        <Link2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton title="图片" onClick={setImage}>
        <Image size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="分割线"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={iconSize} />
      </ToolbarButton>
    </div>
  );
}
