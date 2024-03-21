import ListBranch from '../../../components/List/ListBranch';
import { UserRole } from '../../../components/UserRole';


interface Role {
  role: string;
}

const AdminBranch = [
  {
    text: 'Thẻ giờ',
    to: '/timecards',
  },
  {
    text: 'Cấu hình thẻ giờ',
    to: '/timecards/setting',
  },
  {
    text: 'Danh sách thẻ giờ',
    to: '/timecards/list',
  },
  {
    text: 'Chỉnh sửa thẻ giờ',
    to: '/timecards/edit',
  },
];

const ManagerBranch = [
  {
    text: 'Thẻ giờ',
    to: '/timecards',
  },
  {
    text: 'Danh sách thẻ giờ',
    to: '/timecards/list',
  },
  {
    text: 'Chỉnh sửa thẻ giờ',
    to: '/timecards/edit',
  },
];

const NavTimcard: React.FC<Role> = () => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  const isAdmin = users.roles === UserRole.ADMIN;
  const isManager = users.roles === UserRole.MANAGER;
  const isLeader = users.roles === UserRole.LEADER;

  return (
    <>
      {isAdmin && <ListBranch branch={AdminBranch} />}
      {isManager && <ListBranch branch={ManagerBranch} />}
      {isLeader && <ListBranch branch={ManagerBranch} />}
    </>
  );
};

export default NavTimcard;
