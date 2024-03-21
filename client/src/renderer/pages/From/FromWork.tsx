import { BoxApprove } from "../../components/Box/Box";
import { ButtonBack } from "../../components/Button/ButtonBack";
import { HeadingLv2 } from "../../components/Heading";
import { TableFrom } from "../../components/Table/Table";
import { TextLead, TextRight } from "../../components/TextGroup";

export const FromWork = () => {
    return (
      <>
        <HeadingLv2 text='外出申請書' />
        <TextLead text="下記の通り申請致します。" />
        <TableFrom customProp="fromWork" />
        <TextRight text="※1週間前までに提出して下さい。" />
        <BoxApprove />
        <div className="wrp-button">
            <button className="btn btn--from btn--gray" >
            下書き保存
            </button>
            <button className="btn btn--from btn--blue" >
            申請する
            </button>
        </div>
        <ButtonBack />
      </>
    );
  };