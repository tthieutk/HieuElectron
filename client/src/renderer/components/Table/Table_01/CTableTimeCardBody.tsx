import React, { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  startOfDay,
} from 'date-fns';
import Modal from '../../Modal/Modal';
import { UserRole } from '../../../components/UserRole';
import Modaldelete from '../../Modal/Modaldelete';
import { vi } from 'date-fns/locale';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

//sever
type Holiday = {
  id: number;
  name: string;
  days: string;
};
interface SelectMY {
  selectedMonth: string;
  selectedYear: string;
  daysInMonth: Date[];
}
interface Dayoff {
  id: number;
  user_id: string;
  date: string;
  time_start: string;
  time_end: string;
  note: string;
  status: number;
  owner: string;
}

interface TimecardData {
  timecard_date: string;
  id: number;
  timecard_open: string;
  timecard_close: string;
  id_groupwaretimecard: number;
  timecard_time: string;
  timecard_timeover: string;
  timecard_timeinterval: string;
  timecard_comment: string;
  editor: string;
  timecard_temp: string;
}
// Định nghĩa props có kiểu là sự kết hợp của cả hai interfaces DatabaseFile
interface CombinedProps extends SelectMY {
  userID: any;
}

let CTableTimeCardBody = (Props: CombinedProps) => {
  const axiosPrivate = useAxiosPrivate();

  const [daysInMonth, setDaysInMonth] = useState(Props.daysInMonth);

  const selectedMonth = Props.selectedMonth;
  const selectedYear = Props.selectedYear;
  const propsID = Props.userID;
  const [admin, setAdmin] = useState(false);
  const [admins, setAdmins] = useState(false);
  const [usersID, setUsersID] = useState();
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState<number>();
  const [isUpdatingDayoff, setIsUpdatingDayoff] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState('');

  const [currentItemId, setCurrentItemId] = useState<number | undefined>(
    undefined,
  );
  const openModal = (
    itemId: number,
    comment: string,
    isDayoff: number,
    name: string,
  ) => {
    setModalOpen(true);
    setCommentText(comment || '');
    setCurrentItemId(itemId);
    setIsUpdatingDayoff(isDayoff);
    setName(name);
    setOpenMenuIndex(0);
  };

  const closeModal = () => {
    setCurrentItemId(undefined);
    setModalOpen(false);
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [timecardID, setTimecardID] = useState<number>(0);
  const [timecardDate, setTimecardDate] = useState<string>();
  const [timecard_open_time, settimecard_open_time] = useState<string>();
  const [timecardEnd, setTimecardEnd] = useState<string>();
  const [validateErr, setValidateErr] = useState(0);
  const [timecardNote, setTimecardNote] = useState<string>();
  const [timecardDateEdit, setTimecardDateEdit] = useState<string | null>(null);
  const [timecardCheck, setTimecardCheck] = useState<number | undefined>(0);

  const [timeLate, setTimeLate] = useState(0);
  const openModaldelete = (
    id: number,
    timecards_date: string,
    timecards_open: string,
    timecards_close: string,
    timecards_comment: string,
    isTimecards: number,
    date: string,
    checkonly?: number,
  ) => {
    setTimecardID(id);
    setTimecardDate(timecards_date);
    settimecard_open_time(timecards_open);
    setTimecardEnd(timecards_close);
    setTimecardNote(timecards_comment);
    setOpenModal(isTimecards);
    setDeleteModalOpen(true);
    setTimecardDateEdit(date);
    setOpenMenuIndex(0);
    setTimecardCheck(checkonly);
  };
  const closeModaldelete = () => {
    setDeleteModalOpen(false);
    setValidateErr(0);
  };
  useEffect(() => {
    if (!selectedMonth || !selectedYear) {
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1);
      const currentYear = String(currentDate.getFullYear());
      updateDaysInMonth(currentMonth, currentYear);
    } else {
      updateDaysInMonth(selectedMonth, selectedYear);
    }
    setTimeout(() => {
      calculateTotalTime();
    }, 400);
  }, [selectedMonth, selectedYear]);

  const updateDaysInMonth = (month: string, year: string) => {
    const firstDayOfMonth = startOfMonth(
      new Date(parseInt(year), parseInt(month) - 1),
    );
    const lastDayOfMonth = endOfMonth(
      new Date(parseInt(year), parseInt(month) - 1),
    );

    if (firstDayOfMonth <= lastDayOfMonth) {
      const daysOfMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      });
      setDaysInMonth(daysOfMonth);
    } else {
      console.error('Invalid interval: start date is after end date');
      // Xử lý lỗi hoặc thông báo cho người dùng về sự cố này.
    }
  };

  const year = '2023';
  const month = '0';

  const firstDayOfMonth = startOfMonth(
    new Date(parseInt(year), parseInt(month) - 1),
  );
  const lastDayOfMonth = endOfMonth(
    new Date(parseInt(year), parseInt(month) - 1),
  );

  let daysOfMonth = eachDayOfInterval({
    start: startOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
    end: endOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
  });

  // Thêm một số ngày vào đầu tiên của danh sách để nó hiển thị ở cột đầu tiên
  let paddingDays = Array.from(
    { length: firstDayOfMonth.getDay() },
    (_, index) =>
      new Date(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth(),
        index + 1 - firstDayOfMonth.getDay(),
      ),
  );

  let allDays = [...paddingDays, ...daysInMonth];

  const getDayClassName = (date: Date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
    // Các class khác nếu cần
    return '';
  };

  const otherColumnData = [
    {
      format: (date: number | Date) =>
        format(startOfDay(date), 'EEEE', { locale: vi }),
    }, // Định dạng ngày thành thứ
  ];

  const formatTimeDigit = (digit: number): string => {
    return digit < 10 ? `0${digit}` : `${digit}`;
  };

  const [timecardOpen, setTimecardOpen] = useState<TimecardData[]>([]);
  const fetchTimecardOpen = async () => {
    try {
      const response = await axiosPrivate.get('timecards/getall/' + usersID);
      if (response.data && Array.isArray(response.data)) {
        setTimecardOpen(response.data);
      } else {
        setTimecardOpen([]);
      }
    } catch (error) {
      console.error('Error fetching timecard_open:', error);
    }
  };

  const calculateTime = (timestart: string, timeend: string): string => {
    const normalizeTime = (time: string): string => {
      return time.length === 4 ? `0${time}` : time;
    };
    const startTime = new Date(`2000-01-01T${normalizeTime(timestart)}`);
    const endTime = new Date(`2000-01-01T${normalizeTime(timeend)}`);
    const timeDiff: number = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    const formattedHours = formatTimeDigit(hours);
    const formattedMinutes = formatTimeDigit(minutes);

    return `${formattedHours}:${formattedMinutes}`;
  };
  const compareTime = (
    time1: string | null | undefined,
    time2: string | null | undefined,
  ): number => {
    if (time1 == null || time2 == null || time1 === '' || time2 === '') {
      return -1;
    }

    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);

    if (hour1 > hour2) {
      return 1;
    } else if (hour1 < hour2) {
      return 2;
    } else {
      if (minute1 > minute2) {
        return 1;
      } else if (minute1 < minute2) {
        return 2;
      } else {
        return 0;
      }
    }
  };

  const addTimes = (time1: string, time2: string): string => {
    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);

    let totalHours = hour1 + hour2;
    let totalMinutes = minute1 + minute2;

    // Xử lý nếu tổng phút vượt quá 60
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }

    // Định dạng kết quả để đảm bảo có 2 chữ số
    const formattedHours = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
    const formattedMinutes =
      totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  // Hàm xử lý khi click vào nút bắt đầu
  const [startClick, setStartClick] = useState(true);
  const handleButtonClick = async (idTimecards?: number, comment?: string) => {
    setStartClick(false);
    try {
      idTimecards
        ? await axiosPrivate.post('timecards/delete/' + idTimecards)
        : null;
      const response = await axios.get(
        'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh',
      );
      let { datetime } = response.data;
      let currentHour = new Date(datetime).getHours();
      let currentMinutes = new Date(datetime).getMinutes();
      let currentYear = new Date(datetime).getFullYear();
      let currentMonth = String(new Date(datetime).getMonth() + 1).padStart(
        2,
        '0',
      );
      let currentDate = String(new Date(datetime).getDate()).padStart(2, '0');
      let timecard_close_time = `${currentHour}:${String(
        currentMinutes,
      ).padStart(2, '0')}`;

      const dataTimeCard = {
        timecard_year: currentYear,
        user_id: usersID,
        timecard_month: currentMonth,
        timecard_day: currentDate,
        timecard_date: `${currentDate}-${currentMonth}-${currentYear}`,
        timecard_temp: '',
        owner: '',
      };
      const responseTimeCard = await axiosPrivate.post('timecards/add', {
        dataTimeCard,
      });

      //  console.log(responseTimeCard.data);
      const responseConfig = await axiosPrivate.post('config');
      const configData = responseConfig.data;
      const openlunchValue = findConfigValue(configData, 'openlunch');
      const opentimeValue = findConfigValue(configData, 'opentime');
      setTimeLate(opentimeValue);
      const closelunchValue = findConfigValue(configData, 'closelunch');
      let resut = calculateTime(openlunchValue, closelunchValue);
      const dataTimeCardDetails = {
        id_groupwaretimecard: responseTimeCard.data.id_timecard,
        timecard_open: timecard_close_time,
        timecard_originalopen: timecard_close_time,
        timecard_timeinterval: resut,
        timecard_comment: idTimecards ? comment : '',
      };
      const responseTimeCardDetails = await axiosPrivate.post(
        'timecarddetails/add',
        {
          dataTimeCardDetails,
        },
      );

      // console.log(responseTimeCardDetails.data);

      fetchTimecardOpen();
      setTimeout(() => {
        calculateTotalTime();
      }, 400);
    } catch (error) {
      console.error(
        'Lỗi khi lấy thời gian từ API hoặc gửi dữ liệu lên server:',
        error,
      );
    }
  };
  function findConfigValue(configArray: any[], key: string) {
    const configItem = configArray.find((item) => item.config_key === key);
    return configItem ? configItem.config_value : null;
  }

  const workingTime = async (
    timecard_open_time: string,
    timecard_close_time?: string,
  ): Promise<{
    timecard_time: string;
    timecard_timeover: string;
    timecard_close_time: string;
    timecard_timeinterval: string;
  }> => {
    if (!timecard_close_time) {
      const response = await axios.get(
        'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh',
      );
      let { datetime } = response.data;
      let currentHour = new Date(datetime).getHours();
      let currentMinutes = new Date(datetime).getMinutes();
      timecard_close_time = `${currentHour}:${String(currentMinutes).padStart(
        2,
        '0',
      )}`;
    }
    let timecard_time = '';
    const responseConfig = await axiosPrivate.post('config');
    const configData = responseConfig.data;
    const opentimeValue = findConfigValue(configData, 'opentime');
    console.log("opentimeValuessss", opentimeValue);

    const closetimeValue = findConfigValue(configData, 'closetime');
    const openlunchValue = findConfigValue(configData, 'openlunch');
    const closelunchValue = findConfigValue(configData, 'closelunch');
    let timecard_timeinterval = calculateTime(openlunchValue, closelunchValue);
    let timecard_timeover = '00:00';

    if (compareTime(timecard_open_time, timecard_close_time) == 0) {
      timecard_time = '00:00';
    } else if (compareTime(timecard_open_time, opentimeValue) != 1) {
      if (compareTime(timecard_close_time, opentimeValue) != 1) {
        timecard_time = '00:00';
      } else if (compareTime(timecard_close_time, openlunchValue) != 1) {
        timecard_time = calculateTime(opentimeValue, timecard_close_time);
      } else if (compareTime(timecard_close_time, closelunchValue) != 1) {
        timecard_time = calculateTime(opentimeValue, openlunchValue);
      } else if (compareTime(timecard_close_time, closetimeValue) != 1) {
        timecard_time = addTimes(
          calculateTime(opentimeValue, openlunchValue),
          calculateTime(closelunchValue, timecard_close_time),
        );
      } else {
        timecard_time = addTimes(
          calculateTime(opentimeValue, openlunchValue),
          calculateTime(closelunchValue, closetimeValue),
        );
      }
    } else {
      if (compareTime(timecard_open_time, openlunchValue) != 1) {
        if (compareTime(timecard_close_time, openlunchValue) != 1) {
          timecard_time = calculateTime(
            timecard_open_time,
            timecard_close_time,
          );
        } else if (compareTime(timecard_close_time, closelunchValue) != 1) {
          timecard_time = calculateTime(timecard_open_time, openlunchValue);
        } else if (compareTime(timecard_close_time, closetimeValue) != 1) {
          timecard_time = addTimes(
            calculateTime(timecard_open_time, openlunchValue),
            calculateTime(closelunchValue, timecard_close_time),
          );
        } else {
          timecard_time = addTimes(
            calculateTime(timecard_open_time, openlunchValue),
            calculateTime(closelunchValue, closetimeValue),
          );
        }
      } else if (compareTime(timecard_open_time, closelunchValue) == 1) {
        // bắt đầu sau 13:00
        if (compareTime(timecard_open_time, closetimeValue) == 1) {
          timecard_time = '00:00';
          timecard_timeover = calculateTime(
            timecard_open_time,
            timecard_close_time,
          );
        } else if (compareTime(timecard_close_time, closetimeValue) != 1) {
          timecard_time = calculateTime(
            timecard_open_time,
            timecard_close_time,
          );
        } else {
          timecard_time = calculateTime(timecard_open_time, closetimeValue);
        }
      } else {
        // bắt đầu trong khoảng 11:30-13:00
        if (compareTime(timecard_close_time, closelunchValue) != 1) {
          timecard_time = '00:00';
        } else if (compareTime(timecard_close_time, closetimeValue) != 1) {
          timecard_time = calculateTime(closelunchValue, timecard_close_time);
        } else {
          timecard_time = calculateTime(closelunchValue, closetimeValue);
        }
      }
    }
    if (
      compareTime(timecard_close_time, closetimeValue) == 1 &&
      compareTime(
        calculateTime(closetimeValue, timecard_close_time),
        '00:30',
      ) == 1
    ) {
      timecard_timeover = calculateTime(closetimeValue, timecard_close_time);
      timecard_timeinterval = '0:00';
    }
    return {
      timecard_time,
      timecard_timeover,
      timecard_close_time,
      timecard_timeinterval,
    };
  };
  // nhấn nút kết thúc mỗi ngày
  const [endClick, setEndClick] = useState(true);
  const handleEndButtonClick = async (
    timecardID: any,
    timecard_open_time: string,
    event: { preventDefault: () => void } | undefined,
  ) => {
    setEndClick(false);
    if (event) {
      event.preventDefault();
      let time = await workingTime(timecard_open_time);
      const dataTime = {
        id: timecardID,
        timecard_open: timecard_open_time,
        timecard_now: time.timecard_close_time,
        timecard_time: time.timecard_time,
        timecard_timeover: time.timecard_timeover,
        timecard_timeinterval: time.timecard_timeinterval,
      };
      console.log(dataTime);
      try {
        const response = await axiosPrivate.post('timecarddetails/update', {
          dataTime,
        });
        console.log(response.data);
        fetchTimecardOpen();
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };
  //load ngày lễ
  const [holidays, setHolidays] = useState<Holiday[] | undefined>();
  const fetchHolidays = async () => {
    try {
      const response = await axiosPrivate.get('holidays');
      if (response.data && Array.isArray(response.data)) {
        setHolidays(response.data);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const isHoliday = (
    day: Date,
  ): { isHoliday: boolean; id: number; name: string; days: string } => {
    const formattedDay = format(day, 'dd-MM-yyyy');
    const foundHoliday = holidays?.find((holiday) => {
      const holidayDays = holiday.days.split(', ');
      return holidayDays.includes(formattedDay);
    });
    return foundHoliday
      ? {
        isHoliday: true,
        id: foundHoliday.id,
        name: foundHoliday.name,
        days: foundHoliday.days,
      }
      : { isHoliday: false, id: 0, name: '', days: '' };
  };
  const [dayoffs, setDayoffs] = useState<Dayoff[] | undefined>();
  const fetchDayoffs = async () => {
    try {
      let id;
      usersID ? (id = usersID) : (id = users.id);
      const response = await axiosPrivate.get('dayoffs/getalluser/' + id);
      response.data ? setDayoffs(response.data) : setDayoffs([]);
    } catch (error) {
      console.error('Error fetching dayoffs:', error);
    }
  };
  const isDayoff = (
    day: Date,
  ): {
    isDayoff: boolean;
    id: number;
    note: string;
    status: number;
    date: string;
    owner: string;
  } => {
    const formattedDay = format(day, 'dd-MM-yyyy');
    const foundDayoff = dayoffs?.find((dayoff) => {
      const dayoffDay = dayoff.date.split(', ');
      return dayoffDay.includes(formattedDay);
    });
    return foundDayoff
      ? {
        isDayoff: true,
        id: foundDayoff.id,
        note: foundDayoff.note,
        status: foundDayoff.status,
        date: foundDayoff.date,
        owner: foundDayoff.owner,
      }
      : { isDayoff: false, id: 0, note: '', status: 0, date: '', owner: '' };
  };
  const updateDayoffs = async (id: number) => {
    try {
      const response = await axiosPrivate.post('dayoffs/update/' + id); 

      
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
    fetchDayoffs();
  };
  const deleteDayoffs = async (id: number) => {
    try {
      const response = await axiosPrivate.post('dayoffs/delete/' + id);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
    fetchDayoffs();
  };

  //tổng số giờ
  const [totalTime, setTotalTime] = useState({ hours: '0', minutes: '0' });
  const [overTime, setOverTime] = useState({ hours: '0', minutes: '0' });
  const calculateTotalTime = () => {
    const timeDivs = document.querySelectorAll('.timecard_time');
    let totalHours = 0;
    let totalMinutes = 0;

    timeDivs.forEach((div) => {
      if (div instanceof HTMLElement) {
        let timeString = div.innerText.trim();
        if (timeString && /^\d+:\d+$/.test(timeString)) {
          let [hours, minutes] = timeString.split(':');
          totalHours += parseInt(hours, 10);
          totalMinutes += parseInt(minutes, 10);
        }
      }
    });

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
    const formattedHours = totalHours.toString().padStart(2, '0');
    const formattedMinutes = totalMinutes.toString().padStart(2, '0');
    setTotalTime({ hours: formattedHours, minutes: formattedMinutes });

    const timeOver = document.querySelectorAll('.timecard_overtime');
    let totalHour = 0;
    let totalMinute = 0;

    timeOver.forEach((div) => {
      if (div instanceof HTMLElement) {
        let timeString = div.innerText.trim();
        if (timeString && /^\d+:\d+$/.test(timeString)) {
          let [hours, minutes] = timeString.split(':');
          totalHour += parseInt(hours, 10);
          totalMinute += parseInt(minutes, 10);
        }
      }
    });

    if (totalMinute >= 60) {
      totalHour += Math.floor(totalMinute / 60);
      totalMinute %= 60;
    }
    const formattedOverHours = totalHour.toString().padStart(2, '0');
    const formattedOverMinutes = totalMinute.toString().padStart(2, '0');
    setOverTime({ hours: formattedOverHours, minutes: formattedOverMinutes });
  };
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const handleUpdateComment = async (Id: number) => {
    try {
      const response = await axiosPrivate.post(
        'timecarddetails/updatecomment',
        {
          id: Id,
          comment: commentText,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
    fetchTimecardOpen();
    setTimeout(() => {
      calculateTotalTime();
    }, 400);
    closeModal();
  };
  const handleUpdateCommentDayoffs = async (id: number) => {
    try {
      const response = await axiosPrivate.post('dayoffs/updatecomment/' + id, {
        comment: commentText,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
    fetchDayoffs();
    closeModal();
  };
  const handleNewComment = async () => {
    const dataTimeCard = {
      user_id: usersID !== undefined ? parseInt(usersID, 10) : 0,
      timecard_date: name,
      timecard_temp: commentText,
      owner: users.realname,
    };
    console.log(dataTimeCard);
    const responseTimeCard = await axiosPrivate.post('timecards/add', {
      dataTimeCard,
    });
    console.log(responseTimeCard.data);
    fetchTimecardOpen();
    closeModal();
  };
  const handleUpdateNewComment = async () => {
    const response = await axiosPrivate.post(
      'timecards/updatecomment/' + currentItemId,
      {
        comment: commentText,
      },
    );
    console.log(response.data);
    fetchTimecardOpen();
    closeModal();
  };
  const isValidTimeFormat = (input: string) => {
    const timeRegex = /^(0?[0-9]|1[0-9]|2[0-4]):[0-5][0-9]$/;
    return timeRegex.test(input);
  };
  const handleChangeTimecards = async (id: number) => {
    let err = 0;
    setValidateErr(0);
    if (timecard_open_time && timecardEnd) {
      if (
        isValidTimeFormat(timecardEnd) &&
        isValidTimeFormat(timecard_open_time)
      ) {
        if (compareTime(timecard_open_time, timecardEnd) != 2) {
          err = 3;
          setValidateErr(3);
        }
      } else {
        if (!isValidTimeFormat(timecard_open_time)) {
          err = 1;
          setValidateErr(1);
        }
        if (!isValidTimeFormat(timecardEnd)) {
          err = 2;
          setValidateErr(2);
        }
      }
      if (err == 0) {
        let time = await workingTime(timecard_open_time, timecardEnd);
        const response = await axiosPrivate.post('timecarddetails/updateall', {
          id: timecardID,
          timecard_open: timecard_open_time,
          timecard_close: timecardEnd,
          timecard_time: time.timecard_time,
          timecard_timeover: time.timecard_timeover,
          timecard_timeinterval: time.timecard_timeinterval,
          timecard_comment: timecardNote,
          editor: users.realname,
        });
        console.log(response, response.data);
        fetchTimecardOpen();
        setTimeout(() => {
          calculateTotalTime();
        }, 400);
        closeModaldelete();
      }
    } else {
      if (!timecard_open_time) {
        setValidateErr(1);
      }
      if (!timecardEnd) {
        setValidateErr(2);
      }
    }
  };
  const handleNewTimeCard = async () => {
    timecardCheck == 1
      ? await axiosPrivate.post('timecards/delete/' + timecardID)
      : null;
    let err = 0;
    setValidateErr(0);
    let day, month, year;
    if (timecard_open_time && timecardEnd) {
      if (
        isValidTimeFormat(timecardEnd) &&
        isValidTimeFormat(timecard_open_time)
      ) {
        if (compareTime(timecard_open_time, timecardEnd) != 2) {
          err = 3;
          setValidateErr(3);
        }
      } else {
        if (!isValidTimeFormat(timecard_open_time)) {
          err = 1;
          setValidateErr(1);
        }
        if (!isValidTimeFormat(timecardEnd)) {
          err = 2;
          setValidateErr(2);
        }
      }
      if (err == 0) {
        if (timecardDateEdit !== null) {
          const dateParts = timecardDateEdit.split('-');
          day = dateParts[0];
          month = dateParts[1];
          year = dateParts[2];
        }
        const dataTimeCard = {
          timecard_year: year,
          user_id: usersID,
          timecard_month: month,
          timecard_day: day,
          timecard_date: timecardDateEdit,
          timecard_temp: '',
          owner: users.realname,
        };
        console.log(dataTimeCard);
        const responseTimeCard = await axiosPrivate.post('timecards/add', {
          dataTimeCard,
        });
        console.log(responseTimeCard.data);
        let time = await workingTime(timecard_open_time, timecardEnd);
        const dataTimeCardDetails = {
          id_groupwaretimecard: responseTimeCard.data.id_timecard,
          timecard_open: timecard_open_time,
          timecard_close: timecardEnd,
          timecard_time: time.timecard_time,
          timecard_timeover: time.timecard_timeover,
          timecard_timeinterval: time.timecard_timeinterval,
          timecard_comment: timecardNote,
          editor: users.realname,
        };
        const responseTimeCardDetails = await axiosPrivate.post(
          'timecarddetails/addnew',
          {
            dataTimeCardDetails,
          },
        );

        console.log(responseTimeCardDetails.data);
        fetchTimecardOpen();
        setTimeout(() => {
          calculateTotalTime();
        }, 400);
        closeModaldelete();
      }
    } else {
      if (!timecard_open_time) {
        setValidateErr(1);
      }
      if (!timecardEnd) {
        setValidateErr(2);
      }
    }
  };
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const openMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };
  const closeMenu = () => {
    setOpenMenuIndex(0);
  };
  const refuseDayoffs = async (
    dayoffId: any,
    event: { preventDefault: () => void } | undefined,
  ) => {
    if (event) {
      event.preventDefault();
      const data = { owner: users.realname };
      try {
        let response = await axiosPrivate.post('dayoffs/refuse/' + dayoffId, {
          data,
        });
        console.log(response.data);
        fetchDayoffs();
        fetchTimecardOpen();
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };
  const [isload, setIsLoad] = useState(false);
  useEffect(() => {
    const isAdmin = users.roles === UserRole.ADMIN;
    const isManager = users.roles === UserRole.MANAGER;
    const isLeader = users.roles === UserRole.LEADER;
    if (isAdmin || isManager || isLeader) {
      setAdmin(true);
    }
    if (isAdmin || isManager) {
      setAdmins(true);
    }
    setUsersID(users.id);
  }, []);
  useEffect(() => {
    if (propsID) {
      setUsersID(propsID);
    } else {
      setUsersID(users.id);
    }
    setTimeout(() => {
      setIsLoad(true);
    }, 200);
  }, [propsID]);
  useEffect(() => {
    if (isload) {
      const fetchData = async () => {
        await Promise.all([fetchHolidays(), fetchDayoffs()]);
        await fetchTimecardOpen();
        setTimeout(() => {
          calculateTotalTime();
        }, 400);
      };
      fetchData();
    } else {
      const fetchData = async () => {
        await Promise.all([fetchHolidays(), fetchDayoffs()]);
        await fetchTimecardOpen();
        setTimeout(() => {
          calculateTotalTime();
        }, 400);
      };
      fetchData();
    }
    setIsLoad(false);
  }, [isload]);
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return (
    <>
      {allDays.map((day, rowIndex) => (
        <tr
          key={rowIndex}
          className={`
            ${getDayClassName(day)}
            ${isToday(day) ? 'today' : ''}
            ${(() => {
              const holidayInfo = isHoliday(day);
              return holidayInfo.isHoliday ? 'bg-purple' : '';
            })()}
            ${(() => {
              const dayoffInfo = isDayoff(day);
              return dayoffInfo.isDayoff
                ? dayoffInfo.status == 0
                  ? 'bg-orange'
                  : dayoffInfo.status == 1
                    ? 'bg-dayoffs '
                    : ''
                : '';
            })()}
          `}
        >
          {(new Date(day).getMonth() + 1 === parseInt(selectedMonth) &&
            new Date(day).getFullYear() === parseInt(selectedYear)) ||
            (new Date(day).getMonth() + 1 === currentMonth &&
              new Date(day).getFullYear() === currentYear) ? (
            <>
              <td>
                {format(day, 'dd/MM')} ({weekdays[day.getDay()]})
              </td>
              <td>
                {isHoliday(day).isHoliday || isDayoff(day).isDayoff ? (
                  isDayoff(day).isDayoff ? (
                    isDayoff(day).status != 1 && isToday(day) ? (
                      startClick ? (
                        timecardOpen.some(
                          (item) =>
                            item.timecard_date === format(day, 'dd-MM-yyyy'),
                        ) ? (
                          <>
                            {timecardOpen
                              .filter(
                                (item) =>
                                  item.timecard_date ===
                                  format(day, 'dd-MM-yyyy'),
                              )
                              .map((item, index) => (
                                <div
                                  className={
                                    compareTime(item.timecard_open, '7:30') == 1
                                      ? 'late'
                                      : ''
                                  }
                                  key={index}
                                >
                                  {item.id_groupwaretimecard ? (
                                    item.timecard_open
                                  ) : startClick ? (
                                    <button
                                      className="btn btn--medium"
                                      onClick={(event) => {
                                        handleButtonClick();
                                      }}
                                    >
                                      Bắt đầu
                                    </button>
                                  ) : null}
                                </div>
                              ))}
                          </>
                        ) : isToday(day) ? (
                          startClick ? (
                            <button
                              className="btn btn--medium"
                              onClick={(event) => {
                                handleButtonClick();
                              }}
                            >
                              Bắt đầu
                            </button>
                          ) : null
                        ) : (
                          ''
                        )
                      ) : null
                    ) : isDayoff(day).status == 2 ? null : (
                      'Đã xin nghỉ'
                    )
                  ) : null
                ) : timecardOpen.some(
                  (item) => item.timecard_date === format(day, 'dd-MM-yyyy'),
                ) ? (
                  <>
                    {timecardOpen
                      .filter(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      )
                      .map((item, index) => (
                        <div
                          className={
                            compareTime(item.timecard_open, `${timeLate}`) == 1
                              ? 'late'
                              : ''
                          }
                          key={index}
                        >
                          {item.id_groupwaretimecard ? (
                            item.timecard_open
                          ) : isToday(day) && startClick ? (
                            <button
                              className="btn btn--medium"
                              onClick={(event) => {
                                handleButtonClick(item.id, item.timecard_temp);
                              }}
                            >
                              Bắt đầu
                            </button>
                          ) : null}
                        </div>
                      ))}
                  </>
                ) : isToday(day) ? (
                  startClick ? (
                    <button
                      className="btn btn--medium"
                      onClick={(event) => {
                        handleButtonClick();
                      }}
                    >
                      Bắt đầu
                    </button>
                  ) : null
                ) : null}
              </td>
              <td>
                {isHoliday(day).isHoliday ? null : isDayoff(day).isDayoff &&
                  isDayoff(day).status == 1 ? null : timecardOpen.some(
                    (item) => item.timecard_date === format(day, 'dd-MM-yyyy'),
                  ) ? (
                  <>
                    {timecardOpen
                      .filter(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      )
                      .map((item, index) => (
                        <div key={index}>
                          {item.timecard_close !== null &&
                            item.timecard_close !== '' ? (
                            item.timecard_close
                          ) : isToday(day) ? (
                            !endClick ? null : (
                              <button
                                className="btn btn--medium"
                                onClick={(event) =>
                                  handleEndButtonClick(
                                    item.id_groupwaretimecard,
                                    item.timecard_open,
                                    event,
                                  )
                                }
                              >
                                Kết thúc
                              </button>
                            )
                          ) : null}
                        </div>
                      ))}
                  </>
                ) : null}
              </td>

              <td>
                {timecardOpen.some(
                  (item) => item.timecard_date === format(day, 'dd-MM-yyyy'),
                ) ? (
                  <>
                    {timecardOpen
                      .filter(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      )
                      .map((item, index) => (
                        <div key={index} className="timecard_time">
                          {item.timecard_close !== null &&
                            item.timecard_close !== ''
                            ? item.timecard_time
                            : null}
                        </div>
                      ))}
                  </>
                ) : null}
              </td>
              <td>
                {timecardOpen.some(
                  (item) => item.timecard_date === format(day, 'dd-MM-yyyy'),
                ) ? (
                  <>
                    {timecardOpen
                      .filter(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      )
                      .map((item, index) => (
                        <div key={index} className="timecard_overtime">
                          {item.timecard_close !== null &&
                            item.timecard_close !== ''
                            ? item.timecard_timeover
                            : null}
                        </div>
                      ))}
                  </>
                ) : null}
              </td>
              <td>
                {timecardOpen.some(
                  (item) => item.timecard_date === format(day, 'dd-MM-yyyy'),
                ) ? (
                  <>
                    {timecardOpen
                      .filter(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      )
                      .map((item, index) => (
                        <div key={index}>
                          {item.timecard_close !== null &&
                            item.timecard_close !== ''
                            ? item.timecard_timeinterval
                            : null}
                        </div>
                      ))}
                  </>
                ) : null}
              </td>
              <td>
                {isHoliday(day).isHoliday ? (
                  isHoliday(day).name
                ) : isDayoff(day).isDayoff && isDayoff(day).status != 2 ? (
                  <>{isDayoff(day).note}</>
                ) : (
                  <>
                    {timecardOpen.some(
                      (item) =>
                        item.timecard_date === format(day, 'dd-MM-yyyy'),
                    ) ? (
                      <>
                        {timecardOpen
                          .filter(
                            (item) =>
                              item.timecard_date === format(day, 'dd-MM-yyyy'),
                          )
                          .map((item, index) => (
                            <div key={index}>
                              {item.id_groupwaretimecard
                                ? item.timecard_comment
                                : item.timecard_temp}
                            </div>
                          ))}
                      </>
                    ) : null}
                  </>
                )}
              </td>
              <td className="box-menu">
                {isHoliday(day).isHoliday ? null : (
                  <a
                    className={
                      openMenuIndex === rowIndex
                        ? 'color-red box-menu__dropdown'
                        : 'box-menu__dropdown'
                    }
                    onClick={() => openMenu(rowIndex)}
                  >
                    [...]
                  </a>
                )}
                {openMenuIndex === rowIndex && (
                  <>
                    <ul className="list-menu">
                      {isHoliday(day).isHoliday ? null : isDayoff(day)
                        .isDayoff && isDayoff(day).status != 2 ? (
                        <li className="list-menu__item ">
                          <a
                            onClick={(event) => {
                              openModal(
                                isDayoff(day).id,
                                isDayoff(day).note,
                                1,
                                '',
                              );
                            }}
                            className="btn--yellow"
                          >
                            Ghi chú nghỉ phép
                          </a>
                        </li>
                      ) : (
                        <>
                          {timecardOpen.some(
                            (item) =>
                              item.timecard_date === format(day, 'dd-MM-yyyy'),
                          ) ? (
                            <>
                              {timecardOpen
                                .filter(
                                  (item) =>
                                    item.timecard_date ===
                                    format(day, 'dd-MM-yyyy'),
                                )
                                .map((item, index) => (
                                  <li className="list-menu__item " key={index}>
                                    <a
                                      onClick={(event) => {
                                        openModal(
                                          item.id_groupwaretimecard
                                            ? item.id_groupwaretimecard
                                            : item.id,
                                          item.id_groupwaretimecard
                                            ? item.timecard_comment
                                            : item.timecard_temp,
                                          item.id_groupwaretimecard ? 2 : 5,
                                          '',
                                        );
                                      }}
                                      className="btn--green"
                                    >
                                      Sửa ghi chú
                                    </a>
                                  </li>
                                ))}
                            </>
                          ) : (
                            <li className="list-menu__item ">
                              <a
                                onClick={(event) => {
                                  openModal(
                                    0,
                                    '',
                                    6,
                                    format(day, 'dd-MM-yyyy'),
                                  );
                                }}
                                className="btn--green"
                              >
                                Ghi chú
                              </a>
                            </li>
                          )}
                        </>
                      )}
                      {isHoliday(day).isHoliday ? null : isDayoff(day)
                        .isDayoff ? (
                        isDayoff(day).status == 0 ? (
                          <>
                            <li className="list-menu__item">
                              {propsID ? (
                                <a
                                  onClick={(event) =>
                                    refuseDayoffs(isDayoff(day).id, event)
                                  }
                                  className="btn--red"
                                >
                                  Từ chối nghỉ phép
                                </a>
                              ) : (
                                <a
                                  onClick={(event) =>
                                    deleteDayoffs(isDayoff(day).id)
                                  }
                                  className="btn--red"
                                >
                                  Hủy nghỉ phép
                                </a>
                              )}
                            </li>
                            {admin ? (
                              <li className="list-menu__item">
                                <a
                                  onClick={(event) =>
                                    updateDayoffs(isDayoff(day).id)
                                  }
                                  className="btn--blue"
                                >
                                  Duyệt nghỉ phép
                                </a>
                              </li>
                            ) : null}
                          </>
                        ) : null
                      ) : null}
                      {isHoliday(day).isHoliday ||
                        (isDayoff(day).isDayoff &&
                          isDayoff(day).status == 1) ? null : timecardOpen.some(
                            (item) =>
                              item.timecard_date === format(day, 'dd-MM-yyyy'),
                          ) ? (
                        <>
                          {timecardOpen
                            .filter(
                              (item) =>
                                item.timecard_date ===
                                format(day, 'dd-MM-yyyy'),
                            )
                            .map((item, index) =>
                              admins ? (
                                <li key={index} className="list-menu__item">
                                  {item.timecard_open !== null &&
                                    item.timecard_open !== '' ? (
                                    <a
                                      className="btn--yellow"
                                      onClick={(event) => {
                                        item.id_groupwaretimecard
                                          ? openModaldelete(
                                            item.id_groupwaretimecard,
                                            item.timecard_date,
                                            item.timecard_open,
                                            item.timecard_close,
                                            item.timecard_comment,
                                            1,
                                            '',
                                          )
                                          : openModaldelete(
                                            item.id,
                                            item.timecard_date,
                                            item.timecard_open,
                                            item.timecard_close,
                                            item.timecard_temp,
                                            2,
                                            format(day, 'dd-MM-yyyy'),
                                            1,
                                          );
                                      }}
                                    >
                                      Sửa thẻ giờ
                                    </a>
                                  ) : null}
                                </li>
                              ) : null,
                            )}
                        </>
                      ) : admins ? (
                        <li className="list-menu__item">
                          <a
                            className="btn--yellow"
                            onClick={(event) => {
                              openModaldelete(
                                0,
                                '',
                                '',
                                '',
                                '',
                                2,
                                format(day, 'dd-MM-yyyy'),
                              );
                            }}
                          >
                            Sửa giờ
                          </a>
                        </li>
                      ) : null}
                      {isDayoff(day).isDayoff && isDayoff(day).status == 1 ? (
                        <>
                          <li className="list-menu__item">
                            <a
                              className="btn--green"
                              onClick={(event) => {
                                openModal(
                                  isDayoff(day).id,
                                  '',
                                  3,
                                  isDayoff(day).owner,
                                );
                              }}
                            >
                              Thông tin chi tiết
                            </a>
                          </li>
                        </>
                      ) : timecardOpen.some(
                        (item) =>
                          item.timecard_date === format(day, 'dd-MM-yyyy'),
                      ) ? (
                        timecardOpen
                          .filter(
                            (item) =>
                              item.timecard_date === format(day, 'dd-MM-yyyy'),
                          )
                          .map((item, index) => (
                            <li className="list-menu__item" key={index}>
                              <a
                                className="btn--green"
                                onClick={(event) => {
                                  openModal(
                                    item.id_groupwaretimecard,
                                    '',
                                    4,
                                    item.editor,
                                  );
                                }}
                              >
                                Thông tin chi tiết
                              </a>
                            </li>
                          ))
                      ) : null}
                    </ul>
                    <div className="box-menu--bg" onClick={closeMenu}></div>
                  </>
                )}
              </td>
            </>
          ) : null}
        </tr>
      ))}

      <tr className="table--01__trLast">
        <td> Tổng số giờ</td>
        <td></td>
        <td></td>
        <td>
          {totalTime.hours}:{totalTime.minutes}
        </td>
        <td>
          {overTime.hours}:{overTime.minutes}
        </td>
        <td></td>
        <td></td>
        <td>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {isUpdatingDayoff == 3 ? (
              <>
                <h3 className="hdglv3">Thông tin chi tiết</h3>
                <p>Bạn đã được duyệt nghỉ phép bởi: {name}</p>
              </>
            ) : isUpdatingDayoff == 4 ? (
              <>
                <h3 className="hdglv3">Thông tin chi tiết</h3>
                <p>Thẻ giờ đã được chỉnh sửa bởi: {name}</p>
              </>
            ) : (
              <>
                <h3 className="hdglv3">Sửa ghi Chú</h3>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="wrp-button">
                  <button
                    className="btn"
                    onClick={() => {
                      if (isUpdatingDayoff == 1) {
                        handleUpdateCommentDayoffs(currentItemId || 0);
                      } else if (isUpdatingDayoff == 5) {
                        handleUpdateNewComment();
                      } else if (isUpdatingDayoff == 6) {
                        handleNewComment();
                      } else {
                        handleUpdateComment(currentItemId || 0);
                      }
                    }}
                  >
                    Xác nhận
                  </button>
                  <button className="btn btn--orange" onClick={closeModal}>
                    Hủy
                  </button>
                </div>
              </>
            )}
          </Modal>
          <Modaldelete
            isOpen={isDeleteModalOpen}
            onRequestClose={closeModaldelete}
          >
            <h2 className="mb15">
              Sửa thẻ giờ ngày: {timecardDate}
              {timecardDateEdit}
            </h2>
            <table className="table-modal">
              <tbody>
                <tr>
                  <td>Giờ bắt đầu</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={timecard_open_time}
                      onChange={(e) => settimecard_open_time(e.target.value)}
                    />
                    {validateErr == 1 ? (
                      <p className="text-error">
                        * Nhập sai định dạng(ví dụ: 7:03 hoặc 07:03)
                      </p>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td>Giờ kết thúc</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={timecardEnd}
                      onChange={(e) => setTimecardEnd(e.target.value)}
                    />
                    {validateErr == 2 ? (
                      <p className="text-error">
                        * Nhập sai định dạng(ví dụ: 7:03 hoặc 07:03)
                      </p>
                    ) : null}
                    {validateErr == 3 ? (
                      <p className="text-error">
                        * Thời gian kết thúc phải lớn hơn thời gian bắt đầu
                      </p>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td>Ghi chú</td>
                  <td>
                    <textarea
                      defaultValue={timecardNote}
                      onChange={(e) => setTimecardNote(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="wrp-button">
              <button
                className="btn btn--green"
                onClick={(event) => {
                  isOpenModal == 2
                    ? handleNewTimeCard()
                    : handleChangeTimecards(timecardID);
                }}
              >
                Đồng ý
              </button>
              <button className="btn btn--orange" onClick={closeModaldelete}>
                Hủy
              </button>
            </div>
          </Modaldelete>
        </td>
      </tr>
    </>
  );
};

export default CTableTimeCardBody;
