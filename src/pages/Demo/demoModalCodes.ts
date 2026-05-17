/** Modal 演示 — 各示例对应的使用代码（与 DemoModal 实现保持一致） */

export const CODE_BASIC = `const [open, setOpen] = useState(false);

<Button type="primary" onClick={() => setOpen(true)}>
  打开弹窗
</Button>

<Modal
  title="基本弹窗"
  open={open}
  onCancel={() => setOpen(false)}
  onOk={() => setOpen(false)}
>
  <p>这是一个基础的 Modal 示例。</p>
</Modal>`;

export const CODE_CONTAINER = `const containerRef = useRef<HTMLDivElement>(null);
const [open, setOpen] = useState(false);

<div ref={containerRef} className={styles.containerBox}>
  <Button type="primary" onClick={() => setOpen(true)}>打开弹窗</Button>
  <Modal
    title="指定容器"
    open={open}
    getContainer={() => containerRef.current!}
    destroyOnHidden={false}
    onCancel={() => setOpen(false)}
    onOk={() => setOpen(false)}
  >
    <p>弹窗挂载在当前内容区域内，关闭后 DOM 仍保留。</p>
  </Modal>
</div>`;

export const CODE_AUTO_HEIGHT = `const [open, setOpen] = useState(false);
const [lines, setLines] = useState(3);

<Button type="primary" onClick={() => setOpen(true)}>打开弹窗</Button>

<Modal
  title="内容高度自适应"
  open={open}
  onCancel={() => setOpen(false)}
  footer={null}
>
  <Input.TextArea
    rows={lines}
    onChange={(e) => setLines(Math.max(2, e.target.value.split('\\n').length))}
  />
</Modal>`;

export const CODE_DRAGGABLE = `// useDraggableModal 见 pages/Demo/useDraggableModal.ts
const [open, setOpen] = useState(false);
const { position, reset, onTitleMouseDown } = useDraggableModal(open);

<Modal
  title={<div onMouseDown={onTitleMouseDown} style={{ cursor: 'move' }}>可拖拽弹窗</div>}
  open={open}
  centered={false}
  modalRender={(node) => (
    <div style={{ transform: \`translate(\${position.x}px, \${position.y}px)\` }}>
      {node}
    </div>
  )}
  afterOpenChange={(v) => !v && reset()}
  onCancel={() => setOpen(false)}
/>`;

export const CODE_DYNAMIC = `const [open, setOpen] = useState(false);
const [title, setTitle] = useState('动态标题');

<Button
  type="primary"
  onClick={() => {
    setTitle(\`外部修改于 \${new Date().toLocaleTimeString()}\`);
    setOpen(true);
  }}
>
  外部修改标题并打开
</Button>

<Modal title={title} open={open} onCancel={() => setOpen(false)} />`;

export const CODE_SHARED = `const sharedRef = useRef({ count: 0, text: '初始值' });
const [open, setOpen] = useState(false);
const [, bump] = useState(0);

const openWithData = () => {
  sharedRef.current = { count: 1, text: '来自父组件' };
  setOpen(true);
};

<Modal open={open} onCancel={() => setOpen(false)} footer={null}>
  <Input
    value={sharedRef.current.text}
    onChange={(e) => {
      sharedRef.current.text = e.target.value;
      bump((n) => n + 1);
    }}
  />
</Modal>`;

export const CODE_FORM = `const [open, setOpen] = useState(false);
const [form] = Form.useForm();

<Button type="primary" onClick={() => setOpen(true)}>打开表单弹窗</Button>

<Modal
  title="表单弹窗"
  open={open}
  onCancel={() => setOpen(false)}
  onOk={() => form.submit()}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={(values) => {
      message.success(JSON.stringify(values));
      setOpen(false);
    }}
  >
    <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>`;

export const CODE_NESTED = `const [outerOpen, setOuterOpen] = useState(false);
const [innerOpen, setInnerOpen] = useState(false);

<Modal title="外层弹窗" open={outerOpen} onCancel={() => setOuterOpen(false)}>
  <Button type="primary" onClick={() => setInnerOpen(true)}>
    打开内层弹窗
  </Button>
  <Modal
    title="内层弹窗"
    open={innerOpen}
    onCancel={() => setInnerOpen(false)}
    onOk={() => setInnerOpen(false)}
  >
    嵌套弹窗内容
  </Modal>
</Modal>`;

export const CODE_MASK_BLUR = `<Modal
  title="遮罩模糊"
  open={open}
  styles={{ mask: { backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.35)' } }}
  onCancel={() => setOpen(false)}
/>`;

export const CODE_PROMPT = `const { modal } = App.useApp();

// Alert
modal.info({ title: '提示', content: '这是一条 Alert 提示' });

// Confirm
modal.confirm({
  title: '确认',
  content: '确定继续吗？',
  onOk: () => message.success('已确认'),
});

// Prompt（输入框，建议用 ref 读取值）
const inputRef = useRef('');
Modal.confirm({
  title: '请输入',
  content: <Input onChange={(e) => { inputRef.current = e.target.value; }} />,
  onOk: () => message.success(\`已提交：\${inputRef.current}\`),
});`;
