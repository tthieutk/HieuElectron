let CTableTimeCardHead = () => {
  const DatabaseTest = [
    'Ngày tháng',
    'Bắt đầu',
    'Kết thúc',
    'Giờ làm việc',
    'Ngoài giờ',
    'Nghỉ trưa',
    'Ghi chú',
    'Hành động',
  ];

   // Khai Báo Props với ColumCounts
   const Column_Count = DatabaseTest.length;

   const columns = Array.from(
     { length: Column_Count },
     (_, colIndex) => colIndex + 1,
   );
  // const addclass = ['', '', 'Content 3', 'Content 4', 'Content 5', 'Content 6', 'Content 7', 'Content 8', 'Content 9']; className={addclass[index]}
  const colSpan_colums = [,];

  return (
    <>
      <tr>
        {columns.map((item, index) => (
          <th key={index} colSpan={colSpan_colums[index]}>
            {DatabaseTest[index]}
          </th>
        ))}
      </tr>
    </>
  );
};

export default CTableTimeCardHead;
