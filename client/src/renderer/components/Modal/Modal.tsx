import React, { ReactNode } from 'react';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  id?: number;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, id }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
      <div onClick={onClose} className="modal-close"></div>
    </div>
  );
};

export default Modal;
