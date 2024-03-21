import { AddGroup } from '../Form/Form';
import { Heading2, Heading3 } from '../Heading';
import CTableBody from './CTableBody';
import { CTableHead } from './CTableHead';

const action = (
  <div className="grid-row icon-flex">
    <p className="icon icon--save">
      <img
        src={require('../../../../assets/icnedit.png')}
        alt="edit"
        className="fluid-image"
      />
    </p>
    <p className="icon icon--deleted">
      <img
        src={require('../../../../assets/icndelete.png')}
        alt="edit"
        className="fluid-image"
      />
    </p>
  </div>
);
const Data = [
  ['1', 'WEB', action],
  ['2', 'Nhom A', action],
];
export const TableGroup = () => {
  return (
    <div>
      <Heading2 text="Quản lý các nhóm" />
      <Heading3 text="Quản lý các nhóm" />
      <AddGroup />
      <div className="table-container table-group">
        <table className="table table__custom">
          <CTableHead heads={['STT', 'Tên Nhóm', 'Hành Động']} />
          <CTableBody data={Data} />
        </table>
      </div>
    </div>
  );
};
