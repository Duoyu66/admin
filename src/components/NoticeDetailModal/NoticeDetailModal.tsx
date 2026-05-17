import { Modal, Space, Tag, Typography } from 'antd';
import { RichTextView } from '@/components/RichTextView';
import type { NoticeInbox, SysNotice } from '@/api/notice';
import styles from './NoticeDetailModal.module.less';

const TYPE_LABELS = ['', '通知', '公告'];

type NoticeDetail = Pick<
  SysNotice | NoticeInbox,
  'id' | 'title' | 'content' | 'noticeType' | 'publishTime'
> & { status?: number };

export interface NoticeDetailModalProps {
  open: boolean;
  notice: NoticeDetail | null;
  onClose: () => void;
}

/** 公告详情查看 */
export function NoticeDetailModal({ open, notice, onClose }: NoticeDetailModalProps) {
  return (
    <Modal
      title={notice?.title ?? '公告详情'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
      className={styles.modal}
    >
      {notice && (
        <div className={styles.body}>
          <Space size={8} wrap className={styles.meta}>
            <Tag>{TYPE_LABELS[notice.noticeType] ?? '通知'}</Tag>
            {notice.status != null && (
              <Tag color={notice.status === 1 ? 'success' : 'default'}>
                {notice.status === 1 ? '已发布' : '草稿'}
              </Tag>
            )}
            {notice.publishTime && (
              <Typography.Text type="secondary">{notice.publishTime}</Typography.Text>
            )}
          </Space>
          <RichTextView html={notice.content} />
        </div>
      )}
    </Modal>
  );
}
