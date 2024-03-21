import React, { useState } from 'react';
import Modal from '../Modal/Modal';

interface CalendarDataItem {
  date: Date;
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
}

const generateDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const generateCalendarData = (
  year: number,
  month: number,
): CalendarDataItem[] => {
  const daysInMonth = generateDaysInMonth(year, month);
  const calendarData: CalendarDataItem[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    calendarData.push({
      date: currentDate,
      dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      startTime: '',
      endTime: '',
    });
  }

  return calendarData;
};

const TableCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [startTimes, setStartTimes] = useState<string[]>(Array(31).fill(''));
  const [endTimes, setEndTimes] = useState<string[]>(Array(31).fill(''));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedMonth(parseInt(e.target.value, 10));
    setStartTimes(Array(31).fill('')); // Reset start times
    setEndTimes(Array(31).fill('')); // Reset end times
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedYear(parseInt(e.target.value, 10));
    setStartTimes(Array(31).fill('')); // Reset start times
    setEndTimes(Array(31).fill('')); // Reset end times
  };

  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

  const handleStartButtonClick = (index: number): void => {
    const newStartTimes = [...startTimes];
    const currentDate = calendarData[index].date;

    if (currentDate.getDate() === new Date().getDate()) {
      newStartTimes[index] = new Date().toLocaleTimeString();
      setStartTimes(newStartTimes);

      const newEndTimes = [...endTimes];
      newEndTimes[index] = ''; // Reset end time when starting
      setEndTimes(newEndTimes);

      setCurrentDayIndex(index); // Đặt index của ngày hiện tại
      console.log('Current Day Index:', index);
    }
  };

  const handleEndButtonClick = (index: number): void => {
    const newEndTimes = [...endTimes];
    newEndTimes[index] = new Date().toLocaleTimeString();
    setEndTimes(newEndTimes);
  };

  const calendarData = generateCalendarData(selectedYear, selectedMonth);
  const getDayRowClass = (date: Date, index: number): string => {
    const dayOfWeek = date.getDay();
    const isHighlighted =
      selectedDate && date.toDateString() === selectedDate.toDateString();
    const hasStartButton = index === currentDayIndex && !startTimes[index];
    console.log('Has Start Button:', hasStartButton);

    return dayOfWeek === 0
      ? 'sunday'
      : dayOfWeek === 6
      ? 'saturday'
      : isHighlighted
      ? 'highlighted'
      : hasStartButton
      ? 'current-day-start'
      : '';
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedDateString = e.target.value;
    const selectedDateObject = new Date(selectedDateString);

    if (!isNaN(selectedDateObject.getTime())) {
      setSelectedDate(selectedDateObject);
    } else {
      // Xử lý khi định dạng ngày không hợp lệ
      setSelectedDate(null);
    }
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <label>
        Nhập ngày tháng năm:
        <input
          type="date"
          value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
        />
      </label>
      <label>
        Chọn tháng:
        <select value={selectedMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
      </label>
      <label>
        Chọn năm:
        <select value={selectedYear} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </label>
      <div className="table-container table--01">
        <table className="table table__custom">
          <thead>
            <tr>
              <th>Ngày/Tháng</th>
              <th>Thứ</th>
              <th>Bắt Đầu</th>
              <th>Kết Thúc</th>
              <th>Giờ Làm Việc</th>
              <th>Ngoài Giờ</th>
              <th>Giờ Nghỉ Trưa</th>
              <th>Ghi Chú</th>
            </tr>
          </thead>
          <tbody>
            {calendarData.map((dayData, index) => (
              <tr key={index} className={getDayRowClass(dayData.date, index)}>
                <td>
                  {dayData.date.getDate()}/{dayData.date.getMonth() + 1}
                </td>
                <td>{dayData.dayOfWeek}</td>
                <td>
                  {dayData.date.getDate() === new Date().getDate() &&
                    dayData.date.getMonth() === new Date().getMonth() &&
                    (startTimes[index] ? (
                      <span>{startTimes[index]}</span>
                    ) : (
                      <button onClick={() => handleStartButtonClick(index)}>
                        Bắt đầu
                      </button>
                    ))}
                </td>
                <td>
                  {endTimes[index] ? (
                    <span>{endTimes[index]}</span>
                  ) : (
                    startTimes[index] && (
                      <button onClick={() => handleEndButtonClick(index)}>
                        Kết thúc
                      </button>
                    )
                  )}
                </td>
                <td></td>
                <td></td>
                <td>1:30</td>
                <td>
                  <button onClick={openModal}>
                    <img
                      src={require('../../../../assets/icnedit.png')}
                      alt=""
                      className="fluid-image"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {
          <>
            <h3 className="hdglv3">Ghi Chú</h3>
            <textarea></textarea>
            <div className="wrp-button">
              <button className="btn">Xác nhận</button>
              <button className="btn btn--orange" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </>
        }
      </Modal>
    </div>
  );
};

export default TableCalendar;
