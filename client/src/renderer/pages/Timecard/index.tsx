import { useEffect, useState } from 'react';

import CTableTimeCardHead from '../../components/Table/Table_01/CTableTimeCardHead';
import CTableTimeCardBody from '../../components/Table/Table_01/CTableTimeCardBody';
import MonthYearSelector from '../../components/Table/SelectMonthYears';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import NavTimcard from '../../layouts/components/Nav/NavTimcard';
import { ButtonCenter } from '../../components/Button/ButtonCenter';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './Timecard.scss';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

interface FieldUsers {
  id: number;
  realname: string;
  userid: string;
  authority_name: string;
  group_name: string;
  user_group: string;
}

export const Timecard = () => {
  const axiosPrivate = useAxiosPrivate();

  const [listOfUsers, setListOfUsers] = useState<FieldUsers[] | []>([]);
  const [currentUser, setCurrentUser] = useState<FieldUsers | null>(null);


  const [realName, setRealName] = useState('');

  const location = useLocation();
  const {
    id,
    month,
    year,
    daysInMonth: stateDaysInMonth = [],
    datacheck,
  } = (location.state as {
    id: number;
    month: string;
    year: string;
    daysInMonth?: Date[];
    datacheck: number;
  }) || {};



  const [user_id, setUser_id] = useState<number>();

  const loggedInUserId = JSON.parse(localStorage.getItem('users') || '{}');

  // Check if id is defined
  useEffect(() => {
    if (datacheck === 0) {

      const fetchData = async () => {
        try {
          const loggedInUserId = JSON.parse(localStorage.getItem('users') || '{}');
          if (loggedInUserId) {
            const response = await axiosPrivate.get('timecards/list');
            setListOfUsers(response.data);
            const loggedInUser = response.data.find((users: { id: number }) => users.id === loggedInUserId.id);
            setCurrentUser(loggedInUser);
          } else {

            console.error('Không tìm thấy giá trị loggedInUserId trong localStorage');
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu:', error);
        }
      };

      fetchData(); // Call the function inside useEffect

      const matchedUser = listOfUsers.find((users) => users.id === id);
      const newRealName = matchedUser ? matchedUser.realname : '';
      setRealName(newRealName);
    } else {

    }
  }, [id, datacheck, listOfUsers, loggedInUserId]);



  const exportToExcel = async () => {

    const matchedUser = listOfUsers.find((users) => users.id === id);
    const realname = matchedUser ? matchedUser.realname : loggedInUserId.realname;

    const table = document.getElementById(
      'timecards_table',
    ) as HTMLTableElement;

    if (!table) {
      console.error('Không tìm thấy bảng.');
      return;
    }

    const month = selectedMonth;
    const year = selectedYear;
    const startRow = 4;
    const workbook = new ExcelJS.Workbook();
    const maxWorksheetNameLength = 100;
    const truncatedWorksheetName =
      `Timecard_${realname}_${month}_${year}`.slice(0, maxWorksheetNameLength);
    const worksheet = workbook.addWorksheet(truncatedWorksheetName);

    // Merge cells for the name and date
    worksheet.mergeCells(`A1:G3`);
    const cellA1 = worksheet.getCell(`A1`);
    cellA1.value = ` ${realname || ''} \n ${month}/${year}`;
    cellA1.alignment = { horizontal: 'center', vertical: 'middle' };
    cellA1.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
    cellA1.font = { size: 15, bold: true };

    for (let rowIndex = 5; rowIndex <= 8; rowIndex++) {
      const currentRow = worksheet.getRow(rowIndex);
      currentRow.height = 0.5; // Đặt chiều cao mong muốn (đơn vị là pixels)
    }
    // Thêm dữ liệu từ bảng vào ô A4:I4
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
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: fillColor };

        // Check if the cell content is empty
        if (!cellContent.trim()) {
          fillColor = { argb: 'FFFFFF' }; // Set color for empty cells
        }

        // Apply fill color to the cell again for empty cells
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
        fgColor: { argb: '00000000' }, // Màu đen (ARGB: Alpha, Red, Green, Blue)
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // Màu trắng (ARGB: Alpha, Red, Green, Blue)
      };
    }

    const lastRowIndex = table.rows.length + 3;
    const startColumn = 1; // Cột A
    const endColumn = 1; // Cột F
    const custom_start = 4; // Cột E
    const custom_end = 5; // Cột F

    const rowIndex = lastRowIndex; // Dùng rowIndex của dòng mới thêm vào

    for (let col = startColumn; col <= endColumn; col++) {
      const cell = worksheet.getCell(
        `${String.fromCharCode(64 + col)}${rowIndex}`,
      );
      // Kiểm tra nếu cột là custom_start hoặc custom_end
      if (col === custom_start || col === custom_end) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' }, // Màu trắng (ARGB: Alpha, Red, Green, Blue)
        };
        cell.font = {
          color: { argb: 'FF000000' }, // Màu đen (ARGB: Alpha, Red, Green, Blue)
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00000000' }, // Màu đen (ARGB: Alpha, Red, Green, Blue)
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' }, // Màu trắng (ARGB: Alpha, Red, Green, Blue)
        };
      }
    }

    const lastColumnIndex = table.rows[0].cells.length;
    worksheet.spliceColumns(lastColumnIndex, 1);

    for (let c = 1; c <= table.rows[0].cells.length - 1; c++) {
      const column = worksheet.getColumn(c);
      // Kiểm tra xem ô và nội dung có tồn tại không
      const maxWidth = Math.max(
        20,
        ...rowsArray.map((row) => {
          const cell = row.cells[c - 1];
          return cell && cell.textContent ? cell.clientWidth / 8 : 20; // Nếu ô hoặc nội dung không tồn tại, sử dụng 20 làm giá trị mặc định
        }),
      );
      column.width = maxWidth; // Sử dụng giá trị maxWidth để đặt độ rộng của cột
    }
    // Combine the variables and truncate if necessary
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

    // Thêm văn bản vào cột 3 của dòng cuối cùng
    const textToAdd = 'Ngoài giờ';
    worksheet.getCell(`C${lastRowIndex}`).value = textToAdd;

    // Thiết lập màu nền đen và chữ màu trắng cho ô C ở dòng cuối cùng
    const cellC = worksheet.getCell(`C${lastRowIndex}`);
    cellC.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '000000' }, // Màu đen (ARGB: Alpha, Red, Green, Blue)
    };
    cellC.font = {
      color: { argb: 'FFFFFF' }, // Màu trắng (ARGB: Alpha, Red, Green, Blue)
    };

    for (let r = 9; r < lastRowIndex; r++) {
      const cellB = worksheet.getCell(`B${r}`);
      const cellC = worksheet.getCell(`C${r}`);

      // Function to remove words starting with 'Bắt đầu' or ending with 'Kết thúc'
      const removeWords = (cell: ExcelJS.Cell) => {
        const content = cell.value;
        if (typeof content === 'string' || typeof content === 'number') {
          const updatedContent = content
            .toString()
            .replace(/Bắt đầu|Kết thúc/g, '');
          cell.value = updatedContent;
        }
      };
      // Remove words for cells in column B
      removeWords(cellB);
      // Remove words for cells in column C
      removeWords(cellC);
    }

    // Save the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${sheetName}.xlsx`);
  };

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  const handleDateChange = (
    month: string,
    year: string,
    daysInMonth: Date[],
  ) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDaysInMonth(daysInMonth);
    updateMonthAndYear(month, year);
  };

  const updateMonthAndYear = (newMonth: string, newYear: string) => {
    const month = newMonth;
    const year = newYear;
  };
  useEffect(() => {
    if (id !== undefined && month !== undefined && year !== undefined) {
      setSelectedMonth(month);
      setSelectedYear(year);
      updateMonthAndYear(month, year);
      setUser_id(id);
      handleDateChange(month, year, stateDaysInMonth);
    } else {
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentYear = String(currentDate.getFullYear());

      // Cập nhật state
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
      updateMonthAndYear(currentMonth, currentYear);
    }
  }, [id]);

  return (
    <>
      <NavTimcard role="admin" />
      <div
        className="timecard-head-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <MonthYearSelector
          onChange={handleDateChange}
          initialMonth={month}
          initialYear={year}
        />
        <ButtonCenter>
          <button
            onClick={exportToExcel}
            className="btn btn--medium btn--green"
          >
            Xuất Thẻ Giờ
          </button>
          <NavLink className="btn" to="/dayoffs/register">
            {' '}
            Đăng ký nghỉ phép{' '}
          </NavLink>
        </ButtonCenter>
      </div>
      {realName ? (<h3 className="timecard-title">Thẻ giờ của: {realName}</h3>) : null}

      <div className="table-container table--01">
        <table id="timecards_table" className="table table__custom">
          <thead id="timecards_table_head">
            <CTableTimeCardHead />
          </thead>
          <tbody>
            <CTableTimeCardBody
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              daysInMonth={daysInMonth}
              userID={user_id}
            />
          </tbody>
        </table>
      </div>
      <p className="txt-note">Giờ nghỉ trưa từ 11:30 - 13:00.</p>
    </>
  );
};
