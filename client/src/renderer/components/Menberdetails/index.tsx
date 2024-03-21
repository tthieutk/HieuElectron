import { NavLink } from 'react-router-dom';
import './Menberdetails.scss';

type MenberdetailsProps = {
  id: string;
  userid: string;
  realname: string;
  group_name: string;
  user_address: string;
  user_phone: string;
  user_email: string;
  user_skype: string;
};

export const Menberdetails = (props: MenberdetailsProps) => {
  return (
    <div className="menberdetails-info">
      <p className="menberdetails-info__avatar">
        <img
          src="https://placehold.jp/182x182.png"
          alt=""
          className="fluid-image"
        />
      </p>
      <div className="menberdetails-info__content">
        <ul>
          <li>
            <p className="menberdetails-info__content__title">ID:</p>
            <p className="menberdetails-info__content__text">{props.userid}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icnname">
              Họ tên:
            </p>
            <p className="menberdetails-info__content__text">{props.realname}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icngroup">
              Nhóm:
            </p>
            <p className="menberdetails-info__content__text">{props.group_name}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icnaddress">
              Địa chỉ:
            </p>
            <p className="menberdetails-info__content__text">{props.user_address}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icnphone">
              Điện thoai:
            </p>
            <p className="menberdetails-info__content__text">{props.user_phone}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icnemail">
              Email:
            </p>
            <p className="menberdetails-info__content__text">{props.user_email}</p>
          </li>
          <li>
            <p className="menberdetails-info__content__title menberdetails-info__content__title--icnskype">
              Skype ID:
            </p>
            <p className="menberdetails-info__content__text">{props.user_skype}</p>
          </li>
        </ul>
        <NavLink to={"/users/edit/" + props.id}>
          <div className="center menberdetails-info__btn">
            <button className="btn">Thiết lập cá nhân</button>
          </div>
        </NavLink>
      </div>
    </div>
  );
};
