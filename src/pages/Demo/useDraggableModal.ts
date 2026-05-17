import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';

/** 弹窗标题栏拖拽 */
export function useDraggableModal(open: boolean) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const reset = useCallback(() => setPosition({ x: 0, y: 0 }), []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPosition({
        x: origin.current.posX + e.clientX - origin.current.x,
        y: origin.current.posY + e.clientY - origin.current.y,
      });
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const onTitleMouseDown = (e: ReactMouseEvent) => {
    dragging.current = true;
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  return { position, reset, onTitleMouseDown };
}
