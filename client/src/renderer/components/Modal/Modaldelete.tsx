import React, { ReactNode } from 'react';
import './Modal.scss';

interface ModaldeleteProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}
const Modaldelete: React.FC<ModaldeleteProps> = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modaldelete">
      <div className="modaldelete-content">{children}</div>
      <div onClick={onRequestClose} className="modaldelete-close"></div>
    </div>
  );
};

export default Modaldelete;