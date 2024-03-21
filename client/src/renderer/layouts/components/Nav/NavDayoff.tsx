import ListBranch from '../../../components/List/ListBranch';
import { UserRole } from '../../../components/UserRole';

interface Role {
  role: string;
}

const AdminBranch = [
  {
    text: 'Danh sách xin nghỉ phép',
    to: '/dayoffs',
  },
  {
    text: 'Đăng ký nghỉ phép',
    to: '/dayoffs/register',
  },
  {
    text: 'Danh sách duyệt nghỉ phép',
    to: '/dayoffs/apply',
  },
];

const MemberBranch = [
  {
    text: 'Danh sách xin nghỉ phép',
    to: '/dayoffs',
  },
  {
    text: 'Đăng ký nghỉ phép',
    to: '/dayoffs/register',
  }
];

const NavDayoff: React.FC<Role> = ({ role }) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  const isAdmin = users.roles === UserRole.ADMIN;
  const isManager = users.roles === UserRole.MANAGER;
  const isLeader = users.roles === UserRole.LEADER;
  const isMember = users.roles === UserRole.MEMBER;

  return(
    <>
      {
        (isAdmin || isManager || isLeader) ? <ListBranch branch={AdminBranch} /> : ''
      }
      {isMember && <ListBranch branch={MemberBranch} />}
    </>
  )
};

export default NavDayoff;
