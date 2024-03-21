import { useEffect, useState } from 'react';
import {
  SelectCustomName,
  SelectCustom,
} from '../../components/Table/SelectCustom';
import CTableTimeCardHead from '../../components/Table/Table_01/CTableTimeCardHead';
import CTableTimeCardBody from '../../components/Table/Table_01/CTableTimeCardBody';
import NavTimcard from '../../layouts/components/Nav/NavTimcard';
import MonthYearSelector from '../../components/Table/SelectMonthYears';

import './Timecard.scss';
import axios from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

interface FieldUsers {
  id: number;
  realname: string;
  userid: string;
  authority_name: string;
  group_name: string;
  user_group: string;
}

export const TimecardEdit = () => {
  const axiosPrivate = useAxiosPrivate();

  const [userID, setUserID] = useState();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [listOfUsers, setListOfUsers] = useState<FieldUsers[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null,
  );
  const [selectedGroupData, setSelectedGroupData] = useState<FieldUsers[]>([]);

  useEffect(() => {
    axiosPrivate
      .get('users/')
      .then((response) => {
        setListOfUsers(response.data);
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupName(groupId);
  };

  useEffect(() => {
    if (selectedGroupName !== null) {
      const trimmedSelectedGroupName = selectedGroupName.trim().toLowerCase();
      const filteredUsers = listOfUsers.filter((users) => {
        const userGroup = users.user_group.trim().toLowerCase();
        return (
          trimmedSelectedGroupName === 'all' ||
          userGroup === trimmedSelectedGroupName
        );
      });
      setSelectedGroupData(filteredUsers);

      const firstElementWithSelectedGroupName = listOfUsers.find((user) => {
        const userGroup = user.user_group.trim().toLowerCase();
        return userGroup === trimmedSelectedGroupName;
      });

      if (firstElementWithSelectedGroupName) {
        const idOfFirstElement = firstElementWithSelectedGroupName.id;
        setUserID(idOfFirstElement);
      }
    } else {
      setSelectedGroupData(listOfUsers);
    }
  }, [selectedGroupName, listOfUsers]);

  const handleDateChange = (
    month: string,
    year: string,
    daysInMonth: Date[],
  ) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDaysInMonth(daysInMonth);
  };

  const handleUserSelect = (userId: any) => {
    setUserID(userId);
  };
  return (
    <>
      <NavTimcard role="admin" />
      <div className="grid-row mt-5 timeCard-edit--flex">
        <MonthYearSelector onChange={handleDateChange} />
      </div>
      <div className="timeCard-edit">
        <div className="box-group box-group--second">
          <div className="box-group__item select-ml0">
            <SelectCustom onGroupChange={handleGroupChange} />
          </div>
          <div className="box-group__item">
            <SelectCustomName
              selectedGroupData={selectedGroupData}
              onUserSelect={handleUserSelect}
            />
          </div>
        </div>
        <div className="table-container table--01">
          <table className="table table__custom">
            <thead>
              <CTableTimeCardHead />
            </thead>
            <tbody>
              <CTableTimeCardBody
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                daysInMonth={daysInMonth}
                userID={userID}
              />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
