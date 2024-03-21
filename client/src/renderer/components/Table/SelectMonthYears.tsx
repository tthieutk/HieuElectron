import React, { useState, useEffect, ChangeEvent } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import './SelectMonthYears.scss';

interface MonthYearSelectorProps {
  onChange: (selectedMonth: string, selectedYear: string, daysInMonth: Date[]) => void;
  initialMonth?: string;
  initialYear?: string;
  isDefaultSelected?: boolean; // Thêm prop này
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({ onChange, initialMonth, initialYear }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isDefaultSelected, setIsDefaultSelected] = useState(true);

  const months = Array.from({ length: 12 }, (_, index) =>
    (index + 1).toString(),
  );

  const years = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index,
  );
  // console.log(selectedMonth);


  useEffect(() => {
    if (isDefaultSelected) {
      const currentMonth = initialMonth || new Date().getMonth() + 1;
      const currentYear = initialYear || new Date().getFullYear();

      setSelectedMonth(currentMonth.toString());
      setSelectedYear(currentYear.toString());
      const daysInMonth = getDaysInMonth(currentYear.toString(), currentMonth.toString());
      onChange(currentMonth.toString(), currentYear.toString(), daysInMonth);
    }
  }, [isDefaultSelected, initialMonth, initialYear]);

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMonth(value);
    const daysInMonth = getDaysInMonth(selectedYear, value);
    onChange(value, selectedYear, daysInMonth);
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedYear(value);
    const daysInMonth = getDaysInMonth(value, selectedMonth);
    onChange(selectedMonth, value, daysInMonth);
  };

  const getDaysInMonth = (year: string, month: string) => {
    const firstDayOfMonth = startOfMonth(
      new Date(parseInt(year), parseInt(month) - 1, 1),
    );
    const lastDayOfMonth = endOfMonth(
      new Date(parseInt(year), parseInt(month) - 1, 1),
    );
    return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  };

  return (
    <div className="select__box">
      <div className="select__box--flex grid-row">
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select value={selectedYear} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthYearSelector;
