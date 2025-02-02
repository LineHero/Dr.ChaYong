/* eslint-disable @typescript-eslint/indent */
import { useEffect, useRef } from 'react';

import { iou } from '@/services/iou';
import { CheckModalProps } from '@/types/ModalProps';

import styles from './Modal.module.scss';
import { Button } from '../Button/Button';
import { IOUContent } from '../IOU/IOUContent';

export function CheckIouModal({
  isOpen,
  onClose,
  activeIou,
  memberRole,
}: CheckModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCheck = async () => {
    if (activeIou) {
      await iou.agreeIou(String(activeIou.iouId));
    }
    onClose();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!activeIou) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} ref={modalRef}>
          <div className={styles.modalTitle}>작성된 차용증이 없습니다.</div>
        </div>
      </div>
    );
  }

  const isAgreed =
    memberRole === 'DEBTOR'
      ? activeIou.borrowerAgreement
      : activeIou.lenderAgreement;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalIOU}>
          <IOUContent iouData={activeIou} iouRef={modalRef} type="chat" />
        </div>
        {isAgreed ? (
          <div className={styles.modalIOUExplain}>
            이미 동의한 차용증입니다.
          </div>
        ) : (
          <>
            <div className={styles.modalIOUExplain}>
              상기의 내용을 확인하였으며,
              <br />
              위의 거래에 동의하십니까?
            </div>
            <div className={styles.modalBtns}>
              <Button color="lightblue" size="small" onClick={handleCheck}>
                동의
              </Button>
              <Button color="lightred" size="small" onClick={onClose}>
                취소
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
