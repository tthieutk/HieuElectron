import React, { useEffect, useState } from 'react';
import CardTime from '../../components/Card/Card';
import { Heading3 } from '../../components/Heading';
import NavTimcard from '../../layouts/components/Nav/NavTimcard';
import { Pagination } from '../../components/Pagination';
import TimecardHolidays from "./TimecardHolidays";
import { symlink } from 'fs';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';


import { toast } from "react-toastify";

import './TimecardSetting.scss';

export const TimecardSetting = () => {
  const axiosPrivate = useAxiosPrivate();

  const [timeInputHours, setTimeInputHours] = useState<number>(0);
  const [timeInputMinutes, setTimeInputMinutes] = useState<number>(0);
  const [timeOutHours, setTimeOutHours] = useState<number>(0);
  const [timeOutMinutes, setTimeOutMinutes] = useState<number>(0);
  const [timeLunchStartHouse, setTimeLunchStartHouse] = useState<number>(0);
  const [timeLunchStartMinutes, setTimeLunchStartMinutes] = useState<number>(0);
  const [timeLunchEndHouse, setTimeLunchEndHouse] = useState<number>(0);
  const [timeLunchEndMinutes, setTimeLunchEndMinutes] = useState<number>(0);
  const [serverMessage, setServerMessage] = useState('');
  const [isTimeChangedInput, setIsTimeChangedInput] = useState(false);
  const [isTimeChangedOutput, setIsTimeChangedOutput] = useState(false);
  const [isTimeLunchStart, setIsTimeLunchStart] = useState(false);
  const [isTimeLunchEnd, setIsTimeLunchEnd] = useState(false);

  const [configData, setConfigData] = useState({
    openhour: 0,
    openminute: 0,
    closehour: 0,
    closeminute: 0,
    lunchStartHour: 0,
    lunchStartMinutes: 0,
    lunchEndHour: 0,
    lunchEndMinutes: 0,
  });

  const Data = [
    ['Ngày 01 Tháng 01', 'Tết Dương Lịch'],
    ['Ngày 30 Tháng 04', 'Ngày giải phóng miền Nam, Thống nhất Đất nước'],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get('timecards/setting');
        const data = response.data;

        if (!Array.isArray(data)) {
          return; //console.error('Dữ liệu không phải là một mảng');  
        }

        // Tìm đối tượng có config_key là 'opentime'
        const opentimeObject = data.find((item: { config_key: string; }) => item.config_key === 'opentime');
        // Tìm đối tượng có config_key là 'closetime'
        const closetimeObject = data.find((item: { config_key: string; }) => item.config_key === 'closetime');
        const lunchStarttimeObject = data.find((item: { config_key: string; }) => item.config_key === 'openlunch');
        const lunchEndtimeObject = data.find((item: { config_key: string; }) => item.config_key === 'closelunch');

        if (opentimeObject && closetimeObject && lunchStarttimeObject && lunchEndtimeObject) {
          // Tách giờ và phút từ chuỗi
          const opentimeParts = opentimeObject.config_value.trim().split(':');
          const closetimeParts = closetimeObject.config_value.trim().split(':');
          const lunchStartParts = lunchStarttimeObject.config_value.trim().split(':');
          const lunchEndParts = lunchEndtimeObject.config_value.trim().split(':');

          // Chắc chắn rằng có đủ phần tử để tránh lỗi
          if (opentimeParts.length === 2 && closetimeParts.length === 2 && lunchStartParts.length === 2 && lunchEndParts.length === 2) {
            const openHour = parseInt(opentimeParts[0], 10);
            const openMinute = parseInt(opentimeParts[1], 10);
            const closeHour = parseInt(closetimeParts[0], 10);
            const closeMinute = parseInt(closetimeParts[1], 10);
            const lunchHourStart = parseInt(lunchStartParts[0], 10);
            const lunchMinuteStart = parseInt(lunchStartParts[1], 10);
            const lunchHourEnd = parseInt(lunchEndParts[0], 10);
            const lunchMinuteEnd = parseInt(lunchEndParts[1], 10);

            // Kiểm tra xem giá trị đã được chuyển đổi đúng cách chưa
            if (!isNaN(openHour) && !isNaN(openMinute) && !isNaN(closeHour) && !isNaN(closeMinute) && !isNaN(lunchHourStart) && !isNaN(lunchMinuteStart) && !isNaN(lunchHourEnd) && !isNaN(lunchMinuteEnd)) {
              // Cập nhật state với giá trị số
              setConfigData((prevState) => ({
                ...prevState,
                openhour: openHour,
                openminute: openMinute,
                closehour: closeHour,
                closeminute: closeMinute,
                lunchStartHour: lunchHourStart,
                lunchStartMinutes: lunchMinuteStart,
                lunchEndHour: lunchHourEnd,
                lunchEndMinutes: lunchMinuteEnd,
              }));
            } else {
              toast.error("Giá trị giờ và phút không hợp lệ");
            }
          } else {
            toast.error("Định dạng giờ không đúng");
          }
        } else {
          toast.error("Không tìm thấy đối tượng opentime hoặc closetime trong dữ liệu");
          //   console.error('Không tìm thấy đối tượng opentime hoặc closetime trong dữ liệu');
        }
      } catch (error) {
        console.error('Error fetching config data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTimeValues = async () => {
      try {
        const response = await axiosPrivate.get('timecards/setting');
        const timeValues = response.data;

        // Giả sử cấu trúc của response là { openhour: '12', openminute: '30', closehour: '18', closeminute: '45' }
        setTimeInputHours(parseInt(timeValues.openhour, 10) || 0);
        setTimeInputMinutes(parseInt(timeValues.openminute, 10) || 0);
        setTimeOutHours(parseInt(timeValues.closehour, 10) || 0);
        setTimeOutMinutes(parseInt(timeValues.closeminute, 10) || 0);
        setTimeLunchStartHouse(parseInt(timeValues.lunchStartHour, 10) || 0);
        setTimeLunchStartMinutes(parseInt(timeValues.lunchStartMinutes, 10) || 0);
        setTimeLunchEndHouse(parseInt(timeValues.lunchEndHour, 10) || 0);
        setTimeLunchEndMinutes(parseInt(timeValues.lunchEndMinutes, 10) || 0);

      } catch (error) {
        toast.error("Lỗi khi lấy giá trị thời gian");
        //  console.error('Lỗi khi lấy giá trị thời gian:', error);
      }
    };

    fetchTimeValues();
  }, []); // Mảng phụ thuộc trống đảm bảo hiệu ứng chỉ chạy một lần khi component được mount

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  const handlePageChange = (page: any) => { setCurrentPage(page); };

  const handleCardTimeChange = (
    hours: number,
    minutes: number,
    type: string,
  ) => {
    if (type === 'timeInput') {
      setTimeInputHours(hours);
      setTimeInputMinutes(minutes);
      setConfigData((prevState) => ({
        ...prevState,
        openhour: hours,
        openminute: minutes,
      }));
      setIsTimeChangedInput(true)
    } else if (type === 'timeOut') {
      setTimeOutHours(hours);
      setTimeOutMinutes(minutes);
      setConfigData((prevState) => ({
        ...prevState,
        closehour: hours,
        closeminute: minutes,
      }));
      setIsTimeChangedOutput(true)
    }
    else if (type === 'openlunch') {
      setTimeLunchStartHouse(hours);
      setTimeLunchStartMinutes(minutes);
      setConfigData((prevState) => ({
        ...prevState,
        lunchStartHour: hours,
        lunchStartMinutes: minutes,
      }));
      setIsTimeLunchStart(true)
    }
    else if (type === 'closelunch') {
      setTimeLunchEndHouse(hours);
      setTimeLunchEndMinutes(minutes);
      setConfigData((prevState) => ({
        ...prevState, lunchEndHour: hours, lunchEndMinutes: minutes,
      }));
      setIsTimeLunchEnd(true)
    }

  };

  const handleSaveTimeInput = async () => {
    try {

      if (isTimeChangedInput === true) {
        // Xác nhận giá trị trước khi gửi request
        const formattedHoursInput = String(timeInputHours).padStart(2, '0');
        const formattedMinutesInput = String(timeInputMinutes).padStart(2, '0');
        const timeInputString = `${formattedHoursInput}:${formattedMinutesInput}`
        const dataUpdateArray = [{ id: 1, config_key: 'opentime', hoursMinutes: timeInputString },];
        // Thêm các đối tượng khác nếu cần
        const response = await axiosPrivate.post('timecards/getInput', dataUpdateArray);

        if (response.status === 200) {
          toast.success(`Chỉnh giờ vào là: ${timeInputString} thành công`);
          setTimeout(() => {
            setIsTimeChangedInput(false);
          }, 3000); // 5000 miliseconds = 5 giây
          // Hiển thị thông điệp thành công cho người dùng
        } else if (response.status === 400) {
          toast.error("bạn bị lỗi vui lòng kiểm tra lại nhập");
        }
      }
    } catch (error) {
      // console.error('Lỗi khi cập nhật trạng thái:', error);
      // Xử lý lỗi nếu cần
      if (error && typeof error === 'object' && 'response' in error) {
        // console.error('Response status:', (error as any).response.status);
        // console.error('Server error message:', (error as any).response.data);
      } else {
        // console.error('Unexpected error:', error);
      }
    }
  };

  const handleSaveOutTime = async () => {
    try {
      if (isTimeChangedOutput === true) {
        const formattedHoursOutput = String(timeOutHours).padStart(2, '0');
        const formattedMinutesOutput = String(timeOutMinutes).padStart(2, '0');
        // Xác nhận giá trị trước khi gửi request
        const timeOutString = `${formattedHoursOutput}:${formattedMinutesOutput}`
        const dataUpdateArray = [{ id: 2, config_key: 'closetime', hoursMinutes: timeOutString },];
        // Thêm các đối tượng khác nếu cần

        const response = await axiosPrivate.post('timecards/getInput', dataUpdateArray);

        if (response.status === 200) {
          toast.success(`Chỉnh giờ kết thúc là: ${timeOutString} thành công`);

          setTimeout(() => {
            setIsTimeChangedOutput(false)
          }, 3000); // 5000 miliseconds = 5 giây
          // Hiển thị thông điệp thành công cho người dùng
        } else if (response.status === 400) {
          toast.error("bạn bị lỗi vui lòng kiểm tra lại nhập");
          // Xử lý lỗi và hiển thị thông điệp lỗi cho người dùng
        }
      }
    } catch (error) {
      // console.error('Lỗi khi cập nhật trạng thái:', error);
      // Xử lý lỗi nếu cần
      if (error && typeof error === 'object' && 'response' in error) {
        //    console.error('Response status:', (error as any).response.status);
        //    console.error('Server error message:', (error as any).response.data);
      } else {
        //    console.error('Unexpected error:', error);
      }
    }

  };

  const handleSaveLunchStartTime = async () => {
    try {
      if (isTimeLunchStart === true) {
        const formattedLunchStartHouse = String(timeLunchStartHouse).padStart(2, '0');
        const formattedLunchStartMinutes = String(timeLunchStartMinutes).padStart(2, '0');
        // Xác nhận giá trị trước khi gửi request
        const timeOutString = `${formattedLunchStartHouse}:${formattedLunchStartMinutes}`
        const dataUpdateArray = [{ id: 2, config_key: 'openlunch', hoursMinutes: timeOutString },];
        // Thêm các đối tượng khác nếu cần
        const response = await axiosPrivate.post('timecards/getInput', dataUpdateArray);

        if (response.status === 200) {
          toast.success(`Chỉnh giờ bắt đầu nghỉ trưa là: ${timeOutString} thành công`);
          setTimeout(() => {
            setIsTimeLunchStart(false)
          }, 3000); // 5000 miliseconds = 5 giây
          // Hiển thị thông điệp thành công cho người dùng
        } else if (response.status === 400) {
          toast.error("bạn bị lỗi vui lòng kiểm tra lại nhập");
          // Xử lý lỗi và hiển thị thông điệp lỗi cho người dùng
        }
      }
    } catch (error) {
      //   console.error('Lỗi khi cập nhật trạng thái:', error);
      // Xử lý lỗi nếu cần
      if (error && typeof error === 'object' && 'response' in error) {
        //     console.error('Response status:', (error as any).response.status);
        //     console.error('Server error message:', (error as any).response.data);
      } else {
        //     console.error('Unexpected error:', error);
      }
    }
  };
  const handleSaveLunchEndTime = async () => {
    try {
      if (isTimeLunchEnd === true) {
        const formattedLunchEndHouse = String(timeLunchEndHouse).padStart(2, '0');
        const formattedLunchEndMinutes = String(timeLunchEndMinutes).padStart(2, '0');
        // Xác nhận giá trị trước khi gửi request
        const timeOutString = `${formattedLunchEndHouse}:${formattedLunchEndMinutes}`
        const dataUpdateArray = [{ id: 2, config_key: 'closelunch', hoursMinutes: timeOutString },];
        // Thêm các đối tượng khác nếu cần
        const response = await axiosPrivate.post('timecards/getInput', dataUpdateArray);

        if (response.status === 200) {
          toast.success(`Chỉnh giờ kết thúc nghỉ trưa là: ${timeOutString} thành công`);
          setTimeout(() => {
            setIsTimeLunchEnd(false)
          }, 3000); // 5000 miliseconds = 5 giây
          // Hiển thị thông điệp thành công cho người dùng
        } else if (response.status === 400) {
          toast.error("bạn bị lỗi vui lòng kiểm tra lại nhập");
          setTimeout(() => {
            setServerMessage('');

          }, 3000);
          // Xử lý lỗi và hiển thị thông điệp lỗi cho người dùng
        }
      }
    } catch (error) {
      //    console.error('Lỗi khi cập nhật trạng thái:', error);
      // Xử lý lỗi nếu cần
      if (error && typeof error === 'object' && 'response' in error) {
        //     console.error('Response status:', (error as any).response.status);
        //     console.error('Server error message:', (error as any).response.data);
      } else {
        //    console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <>
      <NavTimcard role="admin" />
      <Heading3 text="Cấu hình giờ vào - giờ ra" />
      <div className='center'> {serverMessage == '' ? '' : <div className="box-bg"><p className="bg bg-green">{serverMessage}</p></div>}</div>
      <div className="card-box">
        <div className="card-box--center">
          <h4>Giờ vào</h4>
          <CardTime onChange={(h, m) => handleCardTimeChange(h, m, 'timeInput')} defaultHours={configData.openhour} defaultMinutes={configData.openminute} />
          <button className="btn btn--widthAuto" onClick={handleSaveTimeInput} disabled={!isTimeChangedInput}> Cập nhật</button>
        </div>
        <div className="card-box--center">
          <h4>Giờ ra</h4>
          <CardTime onChange={(h, m) => handleCardTimeChange(h, m, 'timeOut')} defaultHours={configData.closehour} defaultMinutes={configData.closeminute} />
          <button className="btn btn--widthAuto" onClick={handleSaveOutTime} disabled={!isTimeChangedOutput}> Cập nhật </button>
        </div>
        <div className="card-box--center">
          <h4>Bắt Đầu Nghỉ Trưa</h4>
          <CardTime onChange={(h, m) => handleCardTimeChange(h, m, 'openlunch')} defaultHours={configData.lunchStartHour} defaultMinutes={configData.lunchStartMinutes} />
          <button className="btn btn--widthAuto" onClick={handleSaveLunchStartTime} disabled={!isTimeLunchStart}>  Cập nhật </button>
        </div>
        <div className="card-box--center">
          <h4>Kết Thúc Nghỉ Trưa</h4>
          <CardTime onChange={(h, m) => handleCardTimeChange(h, m, 'closelunch')} defaultHours={configData.lunchEndHour} defaultMinutes={configData.lunchEndMinutes} />
          <button className="btn btn--widthAuto" onClick={handleSaveLunchEndTime} disabled={!isTimeLunchEnd}>   Cập nhật  </button>
        </div>
      </div>
      <TimecardHolidays />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </>
  );
};
