import React from 'react';
import NavForm from '../../layouts/components/Nav/NavForm';
import { Heading2 } from '../Heading';
import {Accordion} from '../Accordion'
import editIcon from '../../../../assets/icn-edit.png';
import closeIcon from '../../../../assets/icn-close.png';


export  const Tab5Content = () => {
  return (
    <div>
      <Heading2 text="申請状況" />
      <div className='box-application'>
        <p className='txt-lead'>自分が行った申請の一覧です。</p>
        <div className='box-tab'>
          <NavForm />
          <div className="tab01 tab-content">
            <div>
                <Accordion items=
                {
                  [
                    {
                        title: '【申請書名が入ります】', 
                        subtitle: '髙崎　亜生（2024/01/01　14:00）',
                        approveText: '完了',
                        editIcon: editIcon,
                        closeIcon: closeIcon,
                        content: (
                            <div>
                                <div className='box-register'>
                                    <ul>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>期間</span>
                                                <span className='box-register__item__content'>2024/00/00</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>行先</span>
                                                <span className='box-register__item__content'>行先が入ります</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>事由</span>
                                                <span className='box-register__item__content'>事由が入ります事由が入ります事由が入ります事由が入ります事由が入ります事由が入ります</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>備考</span>
                                                <span className='box-register__item__content'>備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります<br />備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className='box-approves'>
                                    <div className='box-approves__inner'>
                                        <p className='box-approves__headding'>承認状況</p>
                                        <ul>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>申</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>申請者名：申請者名が入ります（申請日時：2024/00/00　00：00：00）</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>1</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>2</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='active'>3</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>未</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>完</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-red01 color-white'>却</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>下</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>消</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) 
                    },
                    {
                        title: '【申請書名が入ります】', 
                        subtitle: '髙崎　亜生（2024/01/01　14:00）',
                        approveText: '完了',
                        editIcon: editIcon,
                        closeIcon: closeIcon,
                        content: (
                            <div>
                                <div className='box-register'>
                                    <ul>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>期間</span>
                                                <span className='box-register__item__content'>2024/00/00</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>行先</span>
                                                <span className='box-register__item__content'>行先が入ります</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>事由</span>
                                                <span className='box-register__item__content'>事由が入ります事由が入ります事由が入ります事由が入ります事由が入ります事由が入ります</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='box-register__item'>
                                                <span className='box-register__item__title'>備考</span>
                                                <span className='box-register__item__content'>備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります<br />備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります備考が入ります</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className='box-approves'>
                                    <div className='box-approves__inner'>
                                        <p className='box-approves__headding'>承認状況</p>
                                        <ul>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>申</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>申請者名：申請者名が入ります（申請日時：2024/00/00　00：00：00）</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>1</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>2</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='active'>3</span>
                                                    </div>
                                                    <div className='box-approves__item__content'>
                                                        <p className='box-approves__item__content__text'>承認者名：承認者名が入ります</p>
                                                        <textarea>コメント入力者の名前：（2024/00/00　00：00：00）コメントが入ります。コメントが入ります。コメントが入ります。</textarea>
                                                        <p className='box-approves__item__content__btn'>
                                                            <span><a href="#" className='btncomment btn02'>コメントする</a></span>
                                                        </p>
                                                        <p className='list-btn'>
                                                            <span className='list-btn__item'><span className='lbl01 color-read01 boder-read01'>承認待ち</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item'>
                                                    <div className='box-approves__item__title'>
                                                        <span>未</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>完</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-red01 color-white'>却</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>下</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='box-approves__item box-approves__item--01'>
                                                    <div className='box-approves__item__title'>
                                                        <span className='bg-blue01 color-white'>消</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) 
                    }, 
                  ]
                } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};