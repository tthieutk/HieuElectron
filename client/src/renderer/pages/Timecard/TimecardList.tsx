import React, { useEffect, useState } from 'react';
import { CTable } from '../../components/Table/CTable';
import { CTableHead } from '../../components/Table/CTableHead';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import { SelectCustom } from '../../components/Table/SelectCustom';
import MonthYearSelector from '../../components/Table/SelectMonthYears';
import NavTimcard from '../../layouts/components/Nav/NavTimcard';

import { UserRole } from '../../components/UserRole';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import CTableTimeCardHead from '../../components/Table/Table_01/CTableTimeCardHead';
import CTableTimeCardBody from '../../components/Table/Table_01/CTableTimeCardBody';

interface FieldUsers {
  id: number;
  realname: string;
  userid: string;
  authority_name: string;
  group_name: string;
  user_group: string;
}

interface TimecardParams {
  id?: number;
  month?: string;
  year?: string;
  daysInMonth?: Date[];
}

export const TimecardList: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [listOfUsers, setListOfUsers] = useState<FieldUsers[] | []>([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null,
  );
  const [filteredUsers, setFilteredUsers] = useState<FieldUsers[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [user_id, setUser_id] = useState<number>();

  const navigate = useNavigate();

  // Lưu giá trị biến state trong Link
  const [selectedParams, setSelectedParams] = useState<TimecardParams>({});

  const [selectedDates, setSelectedDates] = useState<{
    [id: number]: { month: string; year: string; daysInMonth?: Date[] };
  }>({});
  const [MonthYearSelectorDefaultMonth, setMonthYearSelectorDefaultMonth] =
    useState<string>('');
  const [MonthYearSelectorDefaultYear, setMonthYearSelectorDefaultYear] =
    useState<string>('');

  const handleDateChange = (
    month: string,
    year: string,
    daysInMonth: Date[],
    userId: number | undefined,
    index: number,
  ) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDaysInMonth(daysInMonth);
    setSelectedDates((prevState) => ({
      ...prevState,
      [userId || index]: { month, year, daysInMonth },
    }));
    // Handle date change logic if needed
  };

  const fetchTimecards = async () => {
    const res = await axiosPrivate.get('timecards/list/');
    setListOfUsers(res.data);
    setSelectedDates({});
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    setMonthYearSelectorDefaultMonth(currentMonth.toString());
    setMonthYearSelectorDefaultYear(currentYear.toString());
  };
  useEffect(() => {
    if (selectedGroupName !== null) {
      const trimmedSelectedGroupName = selectedGroupName.trim().toLowerCase();
      const filtered = listOfUsers.filter((users) => {
        const userGroup = users.user_group.trim().toLowerCase();
        if (trimmedSelectedGroupName === 'all') {
          return true;
        } else {
          return userGroup === trimmedSelectedGroupName;
        }
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(listOfUsers);
      setCurrentPage(1);
    }
  }, [selectedGroupName, listOfUsers]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleButtonClick = (dataId: number, selectedIndex: number) => {
    const { month, year, daysInMonth } = selectedDates[selectedIndex] || {};
    redirectToTimecards(dataId, month, year, daysInMonth, 0);
  };

  const [checkClick, setCheckClick] = useState(false);
  const [clickMonth, setClickMonth] = useState('');
  const [clickYear, setClickYear] = useState('');
  const [clickName, setClickName] = useState('');
  const [clickdaysInMonth, setClickdaysInMonth] = useState<Date[]>([]);
  const [clickID, setClickID] = useState<number | undefined>(undefined);
  const handleClick = async (
    userId: number,
    realname: string,
    months: string,
    years: string,
    daysInMonth: Date[],
  ) => {
    setClickName(realname);
    setClickMonth(months);
    setClickYear(years);
    setClickdaysInMonth(daysInMonth);
    setClickID(userId);
    setCheckClick(true);
  };
  useEffect(() => {
    if (checkClick) {
      setTimeout(() => {
        exportToExcel(clickName);
        setCheckClick(false);
      }, 1500);
    }
  }, [checkClick]);


  const exportToExcel = async (realname: string) => {
    const table = document.getElementById('timecards_table') as HTMLTableElement;

    if (!table) {
      console.error('Không tìm thấy bảng.');
      return;
    }

    const tableWithRows = table as HTMLTableElement & {
      rows: HTMLCollectionOf<HTMLTableRowElement>;
    };
    const month = selectedMonth.toString().padStart(2, '0');
    const year = selectedYear;
    const startRow = 4;
    const workbook = new ExcelJS.Workbook();
    const maxWorksheetNameLength = 100;
    const truncatedWorksheetName =
      `Timecard_${clickName}_${month}_${year}`.slice(0, maxWorksheetNameLength);
    const worksheet = workbook.addWorksheet(truncatedWorksheetName);
    worksheet.mergeCells(`A1:G3`);
    const cellA1 = worksheet.getCell(`A1`);
    cellA1.value = ` ${clickName || ''} \n ${month}/${year}`;
    cellA1.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    cellA1.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
    cellA1.font = {
      size: 15,
      bold: true,
    };

    for (let rowIndex = 5; rowIndex <= 8; rowIndex++) {
      const currentRow = worksheet.getRow(rowIndex);
      currentRow.height = 0.5; // Đặt chiều cao mong muốn (đơn vị là pixels)
    }
    const rowsArray = Array.from(table.rows);
    const startRowToDelete = 5;
    const numberOfRowsToDelete = 4;
    worksheet.spliceRows(startRowToDelete, numberOfRowsToDelete);
    const numericSelectedYear = parseInt(selectedYear, 10);
    const numericSelectedMonth = parseInt(selectedMonth, 10);
    let tempSunAddresses = [];
    let tempSatAddresses = [];
    for (let r = 1; r <= table.rows.length; r++) {
      for (let c = 1; c <= table.rows[r - 1].cells.length; c++) {
        const cell = worksheet.getCell(
          `${String.fromCharCode(64 + c)}${startRow + r - 1}`,
        );
        let fillColor = { argb: 'FFFFFF' }; // White color
        const cellContent = table.rows[r - 1].cells[c - 1]?.textContent || '';
        const parsedCellContent = parseInt(cellContent, 10);
        if (
          !isNaN(parsedCellContent) &&
          parsedCellContent >= 1 &&
          parsedCellContent <= 31
        ) {
          const currentDate = new Date(
            numericSelectedYear,
            numericSelectedMonth - 1,
            parsedCellContent,
          );
          const dayOfWeek = currentDate.getDay();
          if (c >= 2 && c <= 7) {
            fillColor = { argb: 'FFFFFF' }; // Set color to white for columns B to G
          } else {
            switch (dayOfWeek) {
              case 0: // Chủ Nhật
                fillColor = { argb: 'F4BFD4' };
                let a = cell.address;
                const column = a.charAt(0);
                const row = parseInt(a.substring(1), 10);
                for (let i = 1; i < 7; i++) {
                  tempSunAddresses.push(
                    `${String.fromCharCode(column.charCodeAt(0) + i)}${row}`,
                  );
                }
                break;
              case 6: // Thứ 7
                fillColor = { argb: 'e4eee7' };
                let b = cell.address;
                const columnb = b.charAt(0);
                const rowb = parseInt(b.substring(1), 10);
                for (let i = 1; i < 7; i++) {
                  tempSatAddresses.push(
                    `${String.fromCharCode(columnb.charCodeAt(0) + i)}${rowb}`,
                  );
                }
                break;

              default:
                break;
            }
          }
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: fillColor,
        };
        if (!cellContent.trim()) {
          fillColor = { argb: 'FFFFFF' };
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: fillColor,
        };

        cell.value = cellContent;
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }

    for (let r = 1; r <= table.rows.length; r++) {
      for (let c = 1; c <= table.rows[r - 1].cells.length; c++) {
        const cell = worksheet.getCell(
          `${String.fromCharCode(64 + c)}${startRow + r - 1}`,
        );
        if (tempSunAddresses.some((address) => address === cell.address)) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F4BFD4' },
          };
        }
        if (tempSatAddresses.some((address) => address === cell.address)) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e4eee7' },
          };
        }
      }
    }
    const rowIndexHead = 4;
    const startColumnHead = 1; // Cột A
    const endColumnHead = 8; // Cột H

    for (let col = startColumnHead; col <= endColumnHead; col++) {
      const cell = worksheet.getCell(
        `${String.fromCharCode(64 + col)}${rowIndexHead}`,
      );
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00000000' },
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
      };
    }

    const lastRowIndex = table.rows.length + 3;
    const startColumn = 1; // Cột A
    const endColumn = 1; // Cột F
    const custom_start = 4; // Cột E
    const custom_end = 5; // Cột F
    const rowIndex = lastRowIndex;

    for (let col = startColumn; col <= endColumn; col++) {
      const cell = worksheet.getCell(
        `${String.fromCharCode(64 + col)}${rowIndex}`,
      );
      if (col === custom_start || col === custom_end) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
        };
        cell.font = {
          color: { argb: 'FF000000' },
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00000000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }
    }
    const lastColumnIndex = table.rows[0].cells.length;
    worksheet.spliceColumns(lastColumnIndex, 1);

    for (let c = 1; c <= table.rows[0].cells.length - 1; c++) {
      const column = worksheet.getColumn(c);
      const maxWidth = Math.max(
        20,
        ...rowsArray.map((row) => {
          const cell = row.cells[c - 1];
          return cell && cell.textContent ? cell.clientWidth / 8 : 20;
        }),
      );
      column.width = maxWidth;
    }
    const sheetName = `Timecard_${realname}_${month}_${year}`.slice(
      0,
      maxWorksheetNameLength,
    );

    for (let r = lastRowIndex; r <= lastRowIndex; r++) {
      const cellContent = worksheet.getCell(`D${r}`).value;
      worksheet.getCell(`B${r}`).value = cellContent;
      const cellContentE = worksheet.getCell(`E${r}`).value;
      worksheet.getCell(`D${r}`).value = cellContentE;
      if (r === lastRowIndex) {
        worksheet.getCell(`E${r}`).value = null;
      }
    }
    const textToAdd = 'Ngoài giờ';
    worksheet.getCell(`C${lastRowIndex}`).value = textToAdd;
    const cellC = worksheet.getCell(`C${lastRowIndex}`);
    cellC.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '000000' },
    };
    cellC.font = {
      color: { argb: 'FFFFFF' },
    };
    for (let r = 9; r < lastRowIndex; r++) {
      const cellB = worksheet.getCell(`B${r}`);
      const cellC = worksheet.getCell(`C${r}`);
      const removeWords = (cell: ExcelJS.Cell) => {
        const content = cell.value;
        if (typeof content === 'string' || typeof content === 'number') {
          const updatedContent = content
            .toString()
            .replace(/Bắt đầu|Kết thúc/g, '');
          cell.value = updatedContent;
        }
      };
      removeWords(cellB);
      removeWords(cellC);
    }
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${sheetName}.xlsx`);
  };

  const redirectToTimecards = (
    dataId: number,
    month: string | undefined,
    year: string | undefined,
    daysInMonth: Date[] | undefined,
    datacheck: number = 0,
  ) => {
    const queryParams: Record<string, string | Date[] | number | undefined> = {
      id: dataId.toString(),
      month: month || MonthYearSelectorDefaultMonth,
      year: year || MonthYearSelectorDefaultYear,
      daysInMonth: daysInMonth || undefined,
      datacheck: datacheck || 0,
    };

    navigate('/timecards', { state: queryParams });
  };

  const users = JSON.parse(localStorage.getItem('users') || '{}');

  const isAdmin = users.roles === UserRole.ADMIN;
  const isManager = users.roles === UserRole.MANAGER;
  const isLeader = users.roles === UserRole.LEADER;

  const fetchTimecardsByGroup = async ($groupid: string) => {
    const res = await axiosPrivate.get('timecards/groups/' + $groupid);
    setListOfUsers(res.data);
  };

  useEffect(() => {
    if (isLeader) {
      // fetchTimecardsByGroup(users.user_group_id);
      fetchTimecards();
    } else {
      fetchTimecards();
    }
  }, [MonthYearSelectorDefaultMonth, MonthYearSelectorDefaultYear]);

  return (
    <>
      <NavTimcard role="admin" />
      {isAdmin || isManager ? (
        <SelectCustom
          onGroupChange={(groupId: string) => {
            setSelectedGroupName(groupId);
          }}
        />
      ) : (
        ''
      )}

      {isLeader && (
        <SelectCustom
          onGroupChange={(groupId: string) => {
            setSelectedGroupName(groupId);
          }}
        />
      )}
      <CTable>
        <CTableHead
          heads={[
            'Họ và tên',
            'Nhóm',
            'Quyền truy cập',
            'Tháng năm',
            'Thẻ giờ',
            'Xuất Excel',
          ]}
        />
        <tbody>
          {currentItems.map((data, index) => (
            <tr key={index}>
              <td>{data.realname}</td>
              <td>{data.group_name}</td>
              <td>{data.authority_name}</td>
              <td>
                <MonthYearSelector
                  onChange={(month, year, daysInMonth) =>
                    handleDateChange(month, year, daysInMonth, data.id, index)
                  }
                />
              </td>
              <td>
                <button
                  className="btn"
                  onClick={() => handleButtonClick(data.id, index)}
                >
                  {' '}
                  Xem Thẻ Giờ{' '}
                </button>
              </td>
              <td>
                <button
                  className="btn btn--medium btn--green"
                  style={checkClick ? { cursor: 'not-allowed' } : undefined}
                  onClick={() =>
                    checkClick
                      ? null
                      : handleClick(
                        data.id,
                        data.realname,
                        selectedMonth,
                        selectedYear,
                        daysInMonth,
                      )
                  }
                >
                  Xuất Thẻ Giờ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </CTable>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <div className="table-container table--01" style={{ display: 'none' }}  >
        <table id="timecards_table" className="table table__custom">
          <thead id="timecards_table_head">
            <CTableTimeCardHead />
          </thead>
          <tbody>
            <CTableTimeCardBody
              selectedMonth={clickMonth}
              selectedYear={clickYear}
              daysInMonth={clickdaysInMonth}
              userID={clickID}
            />
          </tbody>
        </table>
      </div>
    </>
  );
};
