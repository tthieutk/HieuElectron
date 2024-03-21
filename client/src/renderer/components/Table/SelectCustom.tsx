import './SelectMonthYears.scss';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { UserRole } from '../UserRole';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

interface SelectCustomProps {
  onGroupChange: (groupId: string) => void;
}

interface SelectCustomNameProps {
  selectedGroupData: { id: number; realname: string }[];
  onUserSelect: (userId: number) => void;
}

export const SelectCustom: React.FC<SelectCustomProps> = ({
  onGroupChange,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [groupList, setGroupList] = useState<
    { id: string; group_name: string }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const isAdmin = users.roles === UserRole.ADMIN;
  const isManager = users.roles === UserRole.MANAGER;
  const isLeader = users.roles === UserRole.LEADER;
  useEffect(() => {
    axiosPrivate
      .get('groups/')
      .then((response) => {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          setGroupList(responseData);
        } else {
          console.error('API không trả về một mảng dữ liệu.');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroupId = event.target.value;
    setSelectedGroup(selectedGroupId);
    onGroupChange(selectedGroupId);
  };
  useEffect(() => {
    if (!isAdmin || !isManager) {
      setSelectedGroup(users.user_group_id);
      onGroupChange(users.user_group_id);
    }
  }, []);

  return (
    <div className="select__box group">
      <div className="select__box--title">
        <p>Nhóm:</p>
      </div>
      <div className="select__box--flex grid-row select-dropdown">
        <select value={selectedGroup} onChange={handleGroupChange}>
          {isAdmin || isManager ? (
            <>
              <option value="all">Tất cả</option>
              {groupList.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name}
                </option>
              ))}
            </>
          ) : isLeader ? (
            <option value={users.user_group_id}>{users.user_group}</option>
          ) : null}
        </select>
      </div>
    </div>
  );
};

export const SelectCustomDayoff: React.FC<SelectCustomProps> = ({
  onGroupChange,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [groupList, setGroupList] = useState<
    { id: string; group_name: string }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  useEffect(() => {
    axiosPrivate
      .get('groups/')
      .then((response) => {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          setGroupList(responseData);
        } else {
          console.error('API không trả về một mảng dữ liệu.');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroupId = event.target.value;
    setSelectedGroup(selectedGroupId);
    onGroupChange(selectedGroupId);
  };

  return (
    <div className="select__box group">
      <div className="select__box--title">
        <p>Nhóm:</p>
      </div>
      <div className="select__box--flex grid-row select-dropdown">
        <select value={selectedGroup} onChange={handleGroupChange}>
          <option value="all">Tất cả</option>
          {groupList.map((group) => (
            <option key={group.id} value={group.id}>
              {group.group_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const SelectCustomName: React.FC<SelectCustomNameProps> = ({
  selectedGroupData,
  onUserSelect,
}) => {
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = parseInt(event.target.value, 10); // Chuyển đổi thành số
    setSelectedUser(event.target.value);

    // Gọi hàm onUserSelect với id của người dùng đã chọn
    onUserSelect(selectedUserId);
  };
  return (
    <div className="select__box group">
      <div className="select__box--flex grid-row">
        <select value={selectedUser} onChange={handleUserChange}>
          {selectedGroupData &&
            selectedGroupData.map((user) => (
              <option key={user.id} value={user.id}>
                {user.realname}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};
