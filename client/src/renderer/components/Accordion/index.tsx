import { useState } from 'react';
import ColorByStatus from '../ColorByStatus';
import './Accordion.scss'

const AccordionItem = ({ title, subtitle, content: initialContent, btnContent, approveText, editIcon, closeIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState(initialContent); // Trạng thái lưu trữ nội dung của accordion

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };
    const approveColor = approveText ? ColorByStatus(approveText) : '#fff';
    return (
      <div className='list-accordion__parent'>
        <div className={`list-accordion__item ${isOpen ? 'open' : ''}`}>
          <div className='list-accordion__item__head' onClick={toggleAccordion}>
            <div className='list-accordion__item__head__title'>
              <p className='list-accordion__item__head__title__title'>{title}</p>
              <span className='list-accordion__item__head__title__subtitle'>{subtitle}</span>
            </div>
            <div className='list-accordion__item__head__btn'>
              <p className='list-accordion__item__head__btn__btn'>
                  <span className='lbl01'  style={{ backgroundColor: approveColor }}>{approveText}</span>
              </p>
              <p className='list-accordion__item__head__btn__icn'>
                <span className='icn-item'><img src={editIcon} alt="edit" className="fluid-image"/></span>
                <span className='icn-item'><img src={closeIcon} alt="close" className="fluid-image" /></span>
              </p>
               {btnContent}
            </div>
          </div>
          <div className='list-accordion__item__content'>
              {isOpen && (
              <div className="list-accordion__item__content__inner">
                <div className='list-accordion__item__content__item'>
                   {content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export const Accordion  = ({ items}) => {
    
    return (
      <div className='list-accordion'>
        <div className='list-accorditon__inner'>
            {items && items.map((item, index) => (
             <AccordionItem key={index} title={item.title}  subtitle={item.subtitle}  approveText={item.approveText} editIcon={item.editIcon} closeIcon={item.closeIcon} content={item.content}
              />
            ))}
        </div>
      </div>
    );
};
