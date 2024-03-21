import { Pagination } from '../../components/Pagination';
import { CTable } from '../../components/Table/CTable';
import CTableBody from '../../components/Table/CTableBody';
import { CTableHead } from '../../components/Table/CTableHead';
import NavDayoff from '../../layouts/components/Nav/NavDayoff';
import { useCallback, useEffect, useState } from 'react';
import { SelectCustom } from '../../components/Table/SelectCustom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import React from 'react';

export const DayoffApply = () => {
  const axiosPrivate = useAxiosPrivate();
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  type FieldGroups = {
    id: any;
    date: string;
    group_name: string;
    realname: string;
    day_number: string;
    time_start: string;
    time_end: string;
    note: string;
    owner: string;
    yes: React.ReactNode;
    no: React.ReactNode;
    status: number;
  };
  const [opentimeValue, setOpentimeValue] = useState();
  const [closetimeValue, setClosetimeValue] = useState();
  const [listOfGroups, setListOfGroups] = useState<FieldGroups[] | []>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const handleGroupChange = (groupId: string) => {
    setCurrentPage(1);
    setSelectedGroup(groupId);
    fetchData();
  };

  let DataTable: FieldGroups[] = [];
  listOfGroups.sort((a, b) => {
    const dateA = new Date(
      (a as any).date.split(',')[0].trim().split('-').reverse().join('-'),
    ).getTime();
    const dateB = new Date(
      (b as any).date.split(',')[0].trim().split('-').reverse().join('-'),
    ).getTime();

    if (dateA !== dateB) {
      // Sắp xếp giảm dần theo ngày tháng năm
      return dateB - dateA;
    } else {
      const timeStartA = parseTime((a as any).time_start);
      const timeStartB = parseTime((b as any).time_start);

      if (timeStartA !== timeStartB) {
        return timeStartA - timeStartB;
      } else {
        const groupNameComparison = (a as any).group_name.localeCompare(
          (b as any).group_name,
        );
        return groupNameComparison;
      }
    }
  });
  function parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  const [isChecked, setIsChecked] = useState(false);
  const [threeMonthsAgo, setThreeMonthsAgo] = useState(new Date());
  useEffect(() => {
    const currentDate = new Date();
    const updatedThreeMonthsAgo = new Date(currentDate);
    if (isChecked) {
      updatedThreeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    } else {
      updatedThreeMonthsAgo.setMonth(currentDate.getMonth());
    }
    setThreeMonthsAgo(updatedThreeMonthsAgo);
  }, [isChecked]);
  for (let i = 0; i < listOfGroups.length; i++) {
    let isDateInPast = false;
    const dates = listOfGroups[i].date.split(',').map((date) => date.trim());

    for (const date of dates) {
      if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [day, month, year] = date.split('-');
        const formattedDate = `${month}-${day}-${year}`;
        const groupDate = new Date(formattedDate.replace(/\s/g, ''));
        if (!isNaN(groupDate.getTime()) && groupDate < threeMonthsAgo) {
          isDateInPast = true;
          break;
        }
      } else {
        console.error(`${date} không phải là ngày hợp lệ.`);
      }
    }
    let dynamicYes =
      listOfGroups[i].status != 1 ? (
        <a
          className="btn btn--medium btn--green"
          onClick={(event) => {
            updateStatus(listOfGroups[i].id, event);
          }}
          href={listOfGroups[i].id}
        >
          Đồng ý
        </a>
      ) : (
        <p className="clr-green">Đã xác nhận</p>
      );
    let dynamicNo =
      listOfGroups[i].status == 0 ? (
        <a
          className="btn btn--medium btn--orange"
          onClick={(event) => {
            refuseDayoffs(listOfGroups[i].id, event);
          }}
          href={listOfGroups[i].id}
        >
          Từ chối
        </a>
      ) : listOfGroups[i].status == 2 ? (
        <p className="clr-red">Đã từ chối</p>
      ) : (
        <a
          className="btn btn--medium btn--orange"
          onClick={(event) => {
            refuseDayoffs(listOfGroups[i].id, event);
          }}
          href={listOfGroups[i].id}
        >
          Từ chối
        </a>
      );
    isDateInPast
      ? null
      : DataTable.push({
        realname: `${listOfGroups[i].realname}`,
        group_name: `${listOfGroups[i].group_name}`,
        day_number: `${listOfGroups[i].day_number}`,
        date: (
          <React.Fragment>
            {listOfGroups[i].date.split(',').map((date, index, array) => {
              const numberOfDays = array.length;
              return (
                <React.Fragment key={date}>
                  {index === 0
                    ? numberOfDays === 1
                      ? `${listOfGroups[i].time_start} đến ${listOfGroups[i].time_end
                      } ngày ${date.trim()}`
                      : `${listOfGroups[i].time_start
                      } đến ${closetimeValue} Ngày: ${date.trim()}`
                    : index === numberOfDays - 1
                      ? `${opentimeValue} đến ${listOfGroups[i].time_end
                      } Ngày: ${date.trim()}`
                      : `${opentimeValue} đến ${closetimeValue} Ngày: ${date.trim()}`}
                  {index !== array.length - 1 && <br />}{' '}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ),
        note: `${listOfGroups[i].note}`,
        yes: dynamicYes,
        no: dynamicNo,
      } as unknown as FieldGroups);
  }

  const fetchData = useCallback(async () => {
    try {
      const [groupsResponse, dayoffsResponse] = await Promise.all([
        axiosPrivate.get('groups'),
        axiosPrivate.get('dayoffs', {
          params: {
            group: selectedGroup,
          },
        }),
      ]);

      const groupsData = groupsResponse.data;
      const dayoffsData = Array.isArray(dayoffsResponse.data)
        ? dayoffsResponse.data
        : [];

      const combinedData = dayoffsData.map((dayoff) => {
        const groupInfo = groupsData.find(
          (group: { id: any; user_id: any }) =>
            group.id === dayoff.user_group || group.user_id === dayoff.user_id,
        );

        return {
          ...dayoff,
          group_name: groupInfo ? groupInfo.group_name : 'Unknown Group',
        };
      });

      setListOfGroups(combinedData);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setListOfGroups([]);
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số mục muốn hiển thị trên mỗi trang
  // Tính tổng số trang
  const totalPages = Math.ceil(DataTable.length / itemsPerPage);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  const data = { owner: users.realname };
  const updateStatus = async (
    dayoffId: any,
    event: { preventDefault: () => void } | undefined,
  ) => {
    if (event) {
      event.preventDefault();
      try {
        const response = await axiosPrivate.post('dayoffs/update/' + dayoffId, {
          data,
        });
        fetchData(); // Tải lại dữ liệu sau khi cập nhật trạng thái
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };
  const refuseDayoffs = async (
    dayoffId: any,
    event: { preventDefault: () => void } | undefined,
  ) => {
    if (event) {
      event.preventDefault();
      try {
        let response = await axiosPrivate.post('dayoffs/refuse/' + dayoffId, {
          data,
        });
        // console.log(response.data);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };
  function findConfigValue(configArray: any[], key: string) {
    const configItem = configArray.find((item) => item.config_key === key);
    return configItem ? configItem.config_value : null;
  }
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    fetchData();
  };
  useEffect(() => {
    const getTimeConfig = async () => {
      const responseConfig = await axiosPrivate.post('config');
      const configData = responseConfig.data;
      setOpentimeValue(findConfigValue(configData, 'opentime'));
      setClosetimeValue(findConfigValue(configData, 'closetime'));
    };
    getTimeConfig();
  });
  return (
    <>
      <NavDayoff role="admin" />
      <div className="left select-ml0">
        <SelectCustom onGroupChange={handleGroupChange} />
      </div>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />{' '}
        Hiển thị thêm những ngày nghỉ 3 tháng trước đây
      </label>
      <CTable>
        <CTableHead
          heads={[
            'Họ Và Tên',
            'nhóm',
            'Số ngày nghỉ',
            'Ngày nghỉ phép',
            'Ghi Chú',
            'Đồng Ý',
            'Từ Chối',
          ]}
        />
        <CTableBody
          data={DataTable.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          )}
          path_edit="/"
          path_timecard={''}
        />
      </CTable>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};
