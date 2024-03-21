import React, { useEffect, useState } from 'react';
import { Heading3 } from '../../components/Heading';
import { Heading2 } from '../../components/Heading';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { CTable } from '../../components/Table/CTable';
import CTableBody from '../../components/Table/CTableBody';
import { CTableHead } from '../../components/Table/CTableHead';
import { urlControl } from '../../routes/server';
import DatePicker from 'react-multi-date-picker';
import { format, parse } from 'date-fns';
import Modal from '../../components/Modal/Modal';
import Modaldelete from '../../components/Modal/Modaldelete';
import { symlink } from 'fs';
import { toast } from "react-toastify";


import {
  isValidTimecardsholidaysEdit,
  isValidTimecardsholidays,
} from '../../components/Validate';

interface HolidayProps {
  id: string;
  name: string;
  update: React.ReactNode;
  delete: React.ReactNode;
}
const TimecardHolidays = () => {
  const axiosPrivate = useAxiosPrivate();
  const Data = [
    ['Ngày 01 Tháng 01', 'Tết Dương Lịch'],
    ['Ngày 30 Tháng 04', 'Ngày giải phóng miền Nam, Thống nhất Đất nước'],
  ];

  type FieldHolidays = {
    id: string;
    name: string;
    days: string;
    update: React.ReactNode;
    delete: React.ReactNode;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Data.length / itemsPerPage);
  const [listOfHolidays, setListOfHolidays] = useState<FieldHolidays[] | []>([],);
  const [isTableUpdated, setIsTableUpdated] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteModalid, setDeleteModalId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalId, setModalId] = useState('');
  const [modalDays, setModalDays] = useState([]);
  const [name, setName] = useState('');
  const [days, setDays] = useState([new Date()]);

  useEffect(() => {
    axiosPrivate.get('timecardsholidays/').then((response) => {
      setListOfHolidays(response.data);
      setIsTableUpdated(false); //đặt lại trạng thái khi dữ liệu thay đổi
    });
  }, [isTableUpdated]); // khi state thay đổi useEffect sẽ chạy lại

  // update
  const handleDatePickerModalChange = (date: any) => {
    if (date !== null) {
      const dateObjects = date.map((dateString: any) => new Date(dateString));
      setModalDays(dateObjects);
    }
  };

  let dynamicUpdate = ({ id, name, days, }: { id: string; name: string; days: string; }) => (
    <>
      <button onClick={() => openModal(id, name, days)}>
        <p className="icon icon--check">
          <img
            src={require('../../../../assets/icnedit.png')}
            alt="edit"
            className="fluid-image"
          />
        </p>
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {
          <>
            <Heading2 text="Cấu Hình Ngày Lễ" />
            <div className="form-user form">
              <div className="form-content">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Tên Ngày Lễ :</label>
                      <img
                        src={require('../../../../assets/icn-group.png')}
                        alt=""
                        className="fluid-image form-addgroup__image"
                      />
                      <input
                        value={modalName}
                        onChange={(e) => setModalName(e.target.value)}
                        className="form-input"
                        type="text"
                        placeholder="Nhập Tên Ngày Lễ"
                      />
                    </div>
                    <div className="holiday">
                      <div className="form-group">
                        <label>Ngày Nghỉ Lễ:</label>
                        <img
                          src={require('../../../../assets/icon-time.jpg')}
                          alt=""
                          className="fluid-image"
                        />
                        <DatePicker
                          multiple
                          value={modalDays}
                          onChange={(date) => handleDatePickerModalChange(date)}
                          format="DD-MM-YYYY"
                        />
                      </div>
                    </div>
                    <div className="wrp-button">
                      <button
                        className="btn btn--green"
                        onClick={(event) =>
                          handleUpdate(
                            modalId,
                            modalName,
                            modalDays as [],
                            event,
                          )
                        }
                      >
                        {' '}
                        Xác nhận{' '}
                      </button>
                      <button className="btn btn--orange" onClick={closeModal}>
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </Modal>
    </>
  );
  const convertDaysToDatePickerFormat = (days: any) => {
    if (!Array.isArray(days)) {
      console.error('Lỗi: Tham số days phải là một mảng.');
      return [];
    }
    // Chắc chắn rằng mỗi ngày đã được chuyển đổi thành đối tượng Date
    const dateObjects = days.map((day) => {
      // Chuyển đổi định dạng ngày
      const [dayPart, monthPart, yearPart] = day.split('-');
      const formattedDate = new Date(
        `${yearPart}-${monthPart}-${dayPart}T00:00:00Z`,
      );
      // Kiểm tra xem ngày có hợp lệ không
      return !isNaN(formattedDate.getTime()) ? formattedDate : null;
    });
    return dateObjects.filter((date) => date !== null);
  };
  const openModal = (initialNameId: string, initialName: string, initialDays: string,) => {
    setModalId(initialNameId);
    setModalName(initialName);
    // Tách các ngày thành mảng sử dụng dấu phẩy và loại bỏ khoảng trắng xung quanh mỗi ngày
    const daysArray = initialDays.split(',').map((day) => day.trim());
    const validDates = daysArray.filter((day) => {
      // Chuyển đổi định dạng ngày
      const [dayPart, monthPart, yearPart] = day.split('-');
      const formattedDate = new Date(
        `${yearPart}-${monthPart}-${dayPart}T00:00:00Z`,
      );
      // Kiểm tra xem ngày có hợp lệ không
      const isValid = !isNaN(formattedDate.getTime());
      // In thông báo để kiểm tra
      if (!isValid) {
        toast.error(`Ngày không hợp lệ: ${day}`);
      }
      return isValid;
    });

    if (validDates.length > 0) {
      // Chuyển đổi các ngày hợp lệ thành đối tượng Date
      const dateObjects = convertDaysToDatePickerFormat(validDates);
      setModalDays(dateObjects as []);
    } else {
      console.error('Không có ngày hợp lệ để chuyển đổi.');
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleUpdate = async (
    id: string,
    name: string,
    days: any,
    event: any,
  ) => {
    const validationErrors = isValidTimecardsholidaysEdit({ name });
    if (event) {
      event.preventDefault();
      const formattedDays = days
        .map((day: any) => {
          if (day instanceof Date) {
            return format(day, 'dd-MM-yyyy').toString();
          } else {
            // Xử lý trường hợp không hợp lệ, có thể log hoặc trả về một giá trị mặc định
            toast.error('Ngày không hợp lệ:', day);
            return 'Ngày không hợp lệ';
          }
        })
        .join(', ');
      days = formattedDays;
      if (validationErrors === true) {
        try {
          const dataUpdate = { id, name, days };
          const response = await axiosPrivate.put(
            'timecardsholidays/update/',
            dataUpdate,
            { headers: { 'Content-Type': 'application/json' } },
          );
          //  console.log('Update Response:', response.data);
          closeModal();
          setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
        } catch (error) {
          toast.error('Lỗi khi cập nhật trạng thái');
          // console.error('Lỗi khi cập nhật trạng thái:', error);
        }
      }
    }
  };

  // delete
  const handleDelete = async (holidayId: string, event: any) => {
    if (event) {
      event.preventDefault();
      try {
        const payload = { id: holidayId };
        let response = await axiosPrivate.delete('timecardsholidays/delete/', {
          headers: { 'Content-Type': 'application/json' },
          data: payload,
        });
        //  console.log('DELETE Response:', response.data);
        closeModaldelete();
        setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
      } catch (error) {

        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };
  let dynamicDelete = (id: any) => (
    <>
      <button
        onClick={() => {
          openModaldelete(id);
        }}
      >
        <p className="icon icon--check">
          <img
            src={require('../../../../assets/icndelete.png')}
            alt="edit"
            className="fluid-image"
          />
        </p>
      </button>
      <Modaldelete isOpen={isDeleteModalOpen} onRequestClose={closeModaldelete}>
        <h2>Bạn có chắc chắn muốn xóa không?</h2>
        <div className="wrp-button">
          <button
            className="btn btn--green"
            onClick={(event) => handleDelete(isDeleteModalid, event)}
          >
            {' '}
            Đồng ý{' '}
          </button>
          <button className="btn btn--orange" onClick={closeModaldelete}>
            {' '}
            Hủy{' '}
          </button>
        </div>
      </Modaldelete>
    </>
  );
  const openModaldelete = (initialId: string) => {
    setDeleteModalId(initialId);
    setDeleteModalOpen(true);
  };
  const closeModaldelete = () => {
    setDeleteModalOpen(false);
  };
  const formatDate = (date: any) => format(date, 'dd-MM-yyyy');
  let DataTable: FieldHolidays[] = [];
  for (let i = 0; i < listOfHolidays.length; i++) {
    DataTable.push({
      id: listOfHolidays[i].id,
      days: `${listOfHolidays[i].days}`,
      name: `${listOfHolidays[i].name}`,
      update: dynamicUpdate({
        id: listOfHolidays[i].id,
        name: listOfHolidays[i].name,
        days: listOfHolidays[i].days,
      }),
      delete: dynamicDelete(listOfHolidays[i].id),
    });
  }

  // insert
  const handleDatePickerChange = (date: any) => {
    if (date !== null) {
      const dateObjects = date.map((dateString: any) => new Date(dateString));
      setDays(dateObjects);
    }
  };
  const handleSubmint = () => {
    const names = name;
    const validationErrors = isValidTimecardsholidays({ names });
    const formattedDays = days
      .map((day) => {
        if (day instanceof Date) {
          return format(day, 'dd-MM-yyyy').toString();
        } else {
          // Xử lý trường hợp không hợp lệ, có thể log hoặc trả về một giá trị mặc định
          console.error('Ngày không hợp lệ:', day);
          return 'Ngày không hợp lệ';
        }
      })
      .join(', ');
    if (validationErrors === true) {
      const holiday_data = {
        name: name,
        days: formattedDays,
      };
      setName('');
      setDays([new Date()]);
      axiosPrivate
        .post('timecardsholidays/add/', holiday_data)
        .then((response) => {
          // Xử lý thành công nếu cần
          setIsTableUpdated(true); //Khi thêm nhóm mới ,cập nhật state mới
        })
        .catch((error) => {
          console.error('Error inserting data:', error);
          // Xử lý lỗi nếu cần
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Server error message:', error.response.data);
          }
        });
    }
  };
  return (
    <>
      <Heading3 text="Cấu hình ngày lễ" />
      <div className="box-holiday">
        <div className="form-group form-addgroup">
          <label>Tên Ngày Lễ :</label>
          <img
            src={require('../../../../assets/icn-group.png')}
            alt=""
            className="fluid-image form-addgroup__image"
          />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-input"
            type="text"
            placeholder="Tên ngày lễ muốn thêm"
          />
        </div>
        <div className="holiday">
          <div className="form-group">
            <label>Ngày Nghỉ Lễ</label>
            <img
              src={require('../../../../assets/icon-time.jpg')}
              alt=""
              className="fluid-image"
            />
            <DatePicker
              multiple
              value={days}
              onChange={(date) => handleDatePickerChange(date)}
              format="DD-MM-YYYY"
            />
          </div>
        </div>
        <div className="holiday-button">
          <button className="btn" onClick={handleSubmint}>
            Thêm
          </button>
        </div>
      </div>
      <CTable>
        <CTableHead
          heads={['STT', 'Ngày Tháng Năm', 'Ngày lễ - Ngày nghỉ', 'sửa', 'Xóa']}
        />
        <CTableBody
          path_edit={'edit'}
          data={DataTable.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          )}
          path_timecard=""
        />
      </CTable>
    </>
  );
};
export default TimecardHolidays;
