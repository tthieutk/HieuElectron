import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ButtonAdd from '../Button/ButtonAdd';
import ButtonEdit from '../Button/ButtonEdit';
import ButtonView from '../Button/ButtonView';
import ButtonSave from '../Button/ButtonSave';
import ButtonExport from '../Button/ButtonExport';
import ButtonDelete from '../Button/ButtonDelete';
import MonthYearSelector from './SelectMonthYears';
import './Table.scss'

interface TableRowProps {
  rowData: {
    [key: string]: any;
  };
  onButtonClick?: () => void;
  selector?: boolean;
  permission_add?: boolean;
  permission_edit?: boolean;
  permission_delete?: boolean;
  permission_view?: boolean;
  permission_save?: boolean;
  permission_export?: boolean;
  path_edit: string;
  path_timecard: string; // Thêm prop để chứa đường dẫn đến trang timecard
}

const TableRow: React.FC<TableRowProps> = ({
  rowData,
  onButtonClick,
  selector,
  permission_add,
  permission_edit,
  permission_delete,
  permission_view,
  permission_save,
  permission_export,
  path_edit,
  path_timecard, // Thêm vào prop để nhận đường dẫn đến trang timecard
}) => {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  const handleDateChange = (month: string, year: string, daysInMonth: Date[]) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDaysInMonth(daysInMonth);


  };

  const valuesRowData: any[] = Object.values(rowData);

  return (
    <tr>
      {valuesRowData.map((data, index) => (
        <td key={index}>{data}</td>
      ))}
      {selector == true ? <td><MonthYearSelector onChange={handleDateChange} /></td> : null}
      {permission_add == true ? <td><ButtonAdd path_add={''} /></td> : null}
      {permission_edit == true ? <td><ButtonEdit href={path_edit} /></td> : null}
      {permission_delete == true ? <td><ButtonDelete /></td> : null}
      {permission_view == true ? (
        <td>
          <NavLink className="btn" to={`/timecard`}> Xem Thẻ Giờ </NavLink>
        </td>
      ) : null}
      {permission_save == true ? <td><ButtonSave /></td> : null}
      {permission_export == true ? <td><ButtonExport /></td> : null}
    </tr>
  );
};

interface TableProps {
  data: {
    [key: string]: any;
  }[];
  selector?: boolean;
  permission_add?: boolean;
  permission_edit?: boolean;
  permission_delete?: boolean;
  permission_view?: boolean;
  permission_save?: boolean;
  permission_export?: boolean;
  path_edit: string;
  path_timecard: string; // Thêm prop để chứa đường dẫn đến trang timecard
}

const CTableBody: React.FC<TableProps> = ({
  data,
  selector,
  permission_add,
  permission_edit,
  permission_delete,
  permission_view,
  permission_save,
  permission_export,
  path_edit,
  path_timecard, // Thêm vào prop để nhận đường dẫn đến trang timecard
}) => {
  return (
    <tbody>
      {data.map((rowData, index) => (
        <TableRow
          key={index}
          rowData={rowData}
          selector={selector}
          permission_add={permission_add}
          permission_edit={permission_edit}
          path_edit={path_edit}
          permission_delete={permission_delete}
          permission_view={permission_view}
          permission_save={permission_save}
          permission_export={permission_export}
          path_timecard={path_timecard} // Truyền đường dẫn đến trang timecard
        />
      ))}
    </tbody>
  );
};

export default CTableBody;