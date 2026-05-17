import { useRef, useState } from 'react';
import { App, Button, Col, Form, Input, Modal, Row, Space } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoExampleCard } from '@/components/Demo/DemoExampleCard';
import {
  CODE_AUTO_HEIGHT,
  CODE_BASIC,
  CODE_CONTAINER,
  CODE_DRAGGABLE,
  CODE_DYNAMIC,
  CODE_FORM,
  CODE_MASK_BLUR,
  CODE_NESTED,
  CODE_PROMPT,
  CODE_SHARED,
} from './demoModalCodes';
import styles from './DemoModal.module.less';
import { useDraggableModal } from './useDraggableModal';

/** 弹框组件演示 — Modal 常用场景与使用代码 */
export function DemoModal() {
  const { message, modal } = App.useApp();

  const [basicOpen, setBasicOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerOpen, setContainerOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [autoLines, setAutoLines] = useState(3);
  const [dragOpen, setDragOpen] = useState(false);
  const drag = useDraggableModal(dragOpen);
  const [dynamicOpen, setDynamicOpen] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('动态标题');
  const sharedRef = useRef({ count: 0, text: '初始值' });
  const [, bumpShared] = useState(0);
  const [sharedOpen, setSharedOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm();
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(false);
  const promptRef = useRef('');

  const openShared = () => {
    sharedRef.current = { count: 1, text: '来自父组件的数据' };
    bumpShared((n) => n + 1);
    setSharedOpen(true);
  };

  const openDynamic = () => {
    setDynamicTitle(`外部修改于 ${new Date().toLocaleTimeString()}`);
    setDynamicOpen(true);
  };

  return (
    <>
      <PageHeader
        title="弹框"
        description="Modal 常用能力演示，每个示例可展开查看并复制使用代码"
      />

      <Row gutter={[16, 16]} className={styles.grid}>
        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="基本使用"
            description="一个基础的弹窗示例"
            code={CODE_BASIC}
          >
            <Button type="primary" onClick={() => setBasicOpen(true)}>
              打开弹窗
            </Button>
            <Modal
              title="基本弹窗"
              open={basicOpen}
              onCancel={() => setBasicOpen(false)}
              onOk={() => setBasicOpen(false)}
            >
              <p>这是一个基础的 Modal 示例。</p>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="指定容器+关闭后不销毁"
            description="在内容区域打开弹窗的示例"
            code={CODE_CONTAINER}
          >
            <div ref={containerRef} className={styles.containerBox}>
              <p className={styles.containerHint}>弹窗挂载在下方灰色区域内</p>
              <Button type="primary" onClick={() => setContainerOpen(true)}>
                打开弹窗
              </Button>
              <Modal
                title="指定容器"
                open={containerOpen}
                getContainer={() => containerRef.current!}
                destroyOnHidden={false}
                onCancel={() => setContainerOpen(false)}
                onOk={() => setContainerOpen(false)}
              >
                <p>关闭后组件仍保留在 DOM 中（destroyOnHidden=false）。</p>
              </Modal>
            </div>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="内容高度自适应"
            description="可根据内容并自动调整高度"
            code={CODE_AUTO_HEIGHT}
          >
            <Button type="primary" onClick={() => setAutoOpen(true)}>
              打开弹窗
            </Button>
            <Modal
              title="内容高度自适应"
              open={autoOpen}
              onCancel={() => setAutoOpen(false)}
              footer={null}
            >
              <Input.TextArea
                rows={autoLines}
                placeholder="输入多行文本，高度随内容变化"
                onChange={(e) =>
                  setAutoLines(Math.max(2, e.target.value.split('\n').length))
                }
              />
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="可拖拽示例"
            description="通过 modalRender 与标题栏拖拽实现"
            code={CODE_DRAGGABLE}
          >
            <Button type="primary" onClick={() => setDragOpen(true)}>
              打开弹窗
            </Button>
            <Modal
              title={
                <div
                  className={styles.draggableTitle}
                  onMouseDown={drag.onTitleMouseDown}
                >
                  按住标题拖拽
                </div>
              }
              open={dragOpen}
              centered={false}
              modalRender={(node) => (
                <div
                  style={{
                    transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
                  }}
                >
                  {node}
                </div>
              )}
              afterOpenChange={(v) => !v && drag.reset()}
              onCancel={() => setDragOpen(false)}
              onOk={() => setDragOpen(false)}
            >
              <p>拖动标题栏可移动弹窗位置。</p>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="动态配置示例"
            description="通过 setState 动态调整弹窗数据"
            code={CODE_DYNAMIC}
            extra={
              <Button type="link" size="small" onClick={() => setDynamicOpen(true)}>
                打开弹窗
              </Button>
            }
          >
            <Button type="primary" block onClick={openDynamic}>
              外部修改标题并打开
            </Button>
            <Modal
              title={dynamicTitle}
              open={dynamicOpen}
              onCancel={() => setDynamicOpen(false)}
              onOk={() => setDynamicOpen(false)}
            >
              <p>标题由外部按钮在打开前动态设置。</p>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="内外数据共享示例"
            description="通过共享 sharedData 来进行数据交互"
            code={CODE_SHARED}
          >
            <Button type="primary" onClick={openShared}>
              打开弹窗并传递数据
            </Button>
            <div className={styles.sharedPanel}>
              父组件当前值：{sharedRef.current.text}（count: {sharedRef.current.count}）
            </div>
            <Modal
              title="数据共享"
              open={sharedOpen}
              onCancel={() => setSharedOpen(false)}
              onOk={() => {
                bumpShared((n) => n + 1);
                message.success(`已同步：${sharedRef.current.text}`);
                setSharedOpen(false);
              }}
            >
              <Input
                value={sharedRef.current.text}
                onChange={(e) => {
                  sharedRef.current.text = e.target.value;
                  bumpShared((n) => n + 1);
                }}
              />
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="表单弹窗示例"
            description="弹窗与表单结合"
            code={CODE_FORM}
          >
            <Button type="primary" onClick={() => setFormOpen(true)}>
              打开表单弹窗
            </Button>
            <Modal
              title="表单弹窗"
              open={formOpen}
              onCancel={() => {
                form.resetFields();
                setFormOpen(false);
              }}
              onOk={() => form.submit()}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                  message.success(`提交成功：${JSON.stringify(values)}`);
                  form.resetFields();
                  setFormOpen(false);
                }}
              >
                <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入' }]}>
                  <Input placeholder="请输入姓名" />
                </Form.Item>
                <Form.Item name="remark" label="备注">
                  <Input.TextArea rows={3} placeholder="选填" />
                </Form.Item>
              </Form>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="嵌套弹窗示例"
            description="在已经打开的弹窗中再次打开弹窗"
            code={CODE_NESTED}
          >
            <Button
              type="primary"
              onClick={() => {
                setInnerOpen(false);
                setOuterOpen(true);
              }}
            >
              打开嵌套弹窗
            </Button>
            <Modal
              title="外层弹窗"
              open={outerOpen}
              onCancel={() => {
                setInnerOpen(false);
                setOuterOpen(false);
              }}
              onOk={() => setOuterOpen(false)}
            >
              <p>点击下方按钮打开内层弹窗。</p>
              <Button type="primary" onClick={() => setInnerOpen(true)}>
                打开内层弹窗
              </Button>
              <Modal
                title="内层弹窗"
                open={innerOpen}
                onCancel={() => setInnerOpen(false)}
                onOk={() => setInnerOpen(false)}
              >
                这是嵌套在内层的内容。
              </Modal>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="遮罩模糊示例"
            description="遮罩层应用类似毛玻璃的模糊效果"
            code={CODE_MASK_BLUR}
          >
            <Button type="primary" onClick={() => setBlurOpen(true)}>
              打开弹窗
            </Button>
            <Modal
              title="遮罩模糊"
              open={blurOpen}
              styles={{
                mask: {
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(0, 0, 0, 0.35)',
                },
              }}
              onCancel={() => setBlurOpen(false)}
              onOk={() => setBlurOpen(false)}
            >
              <p>遮罩使用 backdrop-filter 实现毛玻璃效果。</p>
            </Modal>
          </DemoExampleCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DemoExampleCard
            title="轻量提示弹窗"
            description="通过快捷方法创建动态提示弹窗，适合轻量提示、确认、输入等"
            code={CODE_PROMPT}
            extra={
              <Button
                type="link"
                size="small"
                href="https://ant.design/components/modal-cn"
                target="_blank"
                rel="noreferrer"
              >
                查看组件文档
              </Button>
            }
          >
            <Space wrap>
              <Button
                type="primary"
                onClick={() =>
                  modal.info({
                    title: '提示',
                    content: '这是一条 Alert 风格的轻量提示。',
                  })
                }
              >
                Alert
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  modal.confirm({
                    title: '确认操作',
                    content: '确定要执行此操作吗？',
                    onOk: () => message.success('已确认'),
                  })
                }
              >
                Confirm
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  promptRef.current = '';
                  Modal.confirm({
                    title: '请输入备注',
                    content: (
                      <Input
                        placeholder="请输入"
                        onChange={(e) => {
                          promptRef.current = e.target.value;
                        }}
                      />
                    ),
                    onOk: () => {
                      if (!promptRef.current.trim()) {
                        message.warning('请输入内容');
                        return Promise.reject();
                      }
                      message.success(`已提交：${promptRef.current}`);
                    },
                  });
                }}
              >
                Prompt
              </Button>
            </Space>
          </DemoExampleCard>
        </Col>
      </Row>
    </>
  );
}
