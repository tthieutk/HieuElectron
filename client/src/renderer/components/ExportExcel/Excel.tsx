import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../Button';

interface ExcelProps {
  tableData: string[][];
}

export const Excel = (Props: ExcelProps) => {
  const tableData = Props.tableData;
  // const [excelData, setExcelData] = useState<string[][]>([]);

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([...tableData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };

  return (
    <Button size="medium" color="green" onButtonClick={exportToExcel}>
      Xuất Thẻ Giờ
    </Button>
  );
};
