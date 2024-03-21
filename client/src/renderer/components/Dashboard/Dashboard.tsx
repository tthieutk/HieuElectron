import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from '../../api/axios';
import './Dashboard.scss';
import DashboardTime from './DashboardTime';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { format } from 'date-fns';

function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const [usersID, setUsersID] = useState();
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users) {
    useEffect(() => {
      setUsersID(users.id);
      loadStart();
    }, [usersID]);
  }
  const [startTime, setStartTime] = useState<
    { hours: string; minutes: string } | undefined
  >(undefined);
  const [endTime, setEndTime] = useState<
    { hours: string; minutes: string } | undefined
  >(undefined);
  const [checkStart, setCheckStart] = useState(false);
  const [checkEnd, setCheckEnd] = useState(false);
  const [checkDayoff, setCheckDayoff] = useState(false);

  const loadStart = async () => {
    try {
      const res = await axiosPrivate.get('dayoffs/getforuser/' + usersID);
      function isLeaveDateInConsData(leaveDate: string) {
        return leaveDate
          ? res.data.some(
              (item: { date: string; status: number }) =>
                item.date === leaveDate && item.status == 1,
            )
          : '';
      }
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US');
      const dateObject = new Date(formattedDate);
      const formattedString = format(dateObject, 'dd-MM-yyyy');
      if (!isLeaveDateInConsData(formattedString)) {
        const response = await axiosPrivate.get('timecards/load/' + usersID);
        if (response.data && response.data.timecard_close) {
          const timecardClose = response.data.timecard_close;
          const [hours, minutes] = timecardClose.split(':');
          setEndTime({ hours, minutes });
          setCheckEnd(true);
        }
        if (response.data && response.data.timecard_open) {
          const timecardOpen = response.data.timecard_open;
          const [hours, minutes] = timecardOpen.split(':');
          setStartTime({ hours, minutes });
          setCheckStart(true);
        }
      } else {
        setCheckDayoff(false);
      }
    } catch (error) {
      // console.log('Không có ngày nghỉ');
    }
  };
  const handleStart = async () => {
    try {
      let comment = '';
      const res = await axiosPrivate.get('timecards/loaduser/' + usersID);
      if (res.data) {
        await axiosPrivate.post('timecards/delete/' + res.data.id);
        comment = res.data.timecard_temp;
      }
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
      let timecard_open_time = `${currentHour}:${String(
        currentMinutes,
      ).padStart(2, '0')}`;

      const dataTimeCard = {
        timecard_year: currentYear,
        user_id: usersID,
        timecard_month: currentMonth,
        timecard_day: currentDate,
        timecard_date: `${currentDate}-${currentMonth}-${currentYear}`,
        timecard_temp: '',
        owner: 'admin',
      };
      const responseTimeCard = await axiosPrivate.post('timecards/add', {
        dataTimeCard,
      });
      const dataTimeCardDetails = {
        id_groupwaretimecard: responseTimeCard.data.id_timecard,
        timecard_open: timecard_open_time,
        timecard_originalopen: timecard_open_time,
        timecard_timeinterval: '1:30',
        timecard_comment: comment,
      };
      const responseTimeCardDetails = await axiosPrivate.post(
        'timecarddetails/add',
        {
          dataTimeCardDetails,
        },
      );
      responseTimeCardDetails.data;
      loadStart();
      setCheckStart(true);
    } catch (error) {
      console.error(
        'Lỗi khi lấy thời gian từ API hoặc gửi dữ liệu lên server:',
        error,
      );
    }
  };
  const formatTimeDigit = (digit: number): string => {
    return digit < 10 ? `0${digit}` : `${digit}`;
  };
  function findConfigValue(configArray: any[], key: string) {
    const configItem = configArray.find((item) => item.config_key === key);
    return configItem ? configItem.config_value : null;
  }
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
  const compareTime = (time1: string, time2: string): number => {
    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);

    if (hour1 > hour2) {
      return 1;
    } else if (hour1 < hour2) {
      return 2;
    } else {
      // Nếu giờ bằng nhau, so sánh phút
      if (minute1 > minute2) {
        return 1;
      } else if (minute1 < minute2) {
        return 2;
      } else {
        // Nếu cả giờ và phút đều bằng nhau
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

  const handleEnd = async () => {
    try {
      const res = await axiosPrivate.get('timecards/load/' + usersID);
      const response = await axios.get(
        'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh',
      );
      let { datetime } = response.data;
      let currentHour = new Date(datetime).getHours();
      let currentMinutes = new Date(datetime).getMinutes();
      let timecard_close_time = `${currentHour}:${String(
        currentMinutes,
      ).padStart(2, '0')}`;
      let timecard_time = '';
      const responseConfig = await axiosPrivate.post('config');
      const configData = responseConfig.data;
      const opentimeValue = findConfigValue(configData, 'opentime');
      const closetimeValue = findConfigValue(configData, 'closetime');
      const openlunchValue = findConfigValue(configData, 'openlunch');
      const closelunchValue = findConfigValue(configData, 'closelunch');
      let timecard_open_time = res.data.timecard_open;
      if (compareTime(timecard_open_time, timecard_close_time) == 0) {
        timecard_time = '00:00';
      } else if (compareTime(timecard_open_time, opentimeValue) != 1) {
        // bắt đầu trước 7:30
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
        //bắt đầu sau 7:30
        if (compareTime(timecard_open_time, openlunchValue) != 1) {
          // bắt đầu trước 11:30
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
      let timecard_timeover = '00:00';
      if (compareTime(timecard_close_time, closetimeValue) == 1) {
        timecard_timeover = calculateTime(closetimeValue, timecard_close_time);
      }
      const dataTime = {
        id: res.data.id_groupwaretimecard,
        timecard_open: res.data.timecard_open,
        timecard_now: timecard_close_time,
        timecard_time: timecard_time,
        timecard_interval: calculateTime(openlunchValue, closelunchValue),
        timecard_timeover: timecard_timeover,
      };
      const re = await axiosPrivate.post('timecarddetails/update', {
        dataTime,
      });
      console.log(re.data);

      loadStart();
      setCheckEnd(true);
    } catch (error) {}
  };

  return (
    <div className="Dashboard">
      <div className="Dashboard-content">
        <DashboardTime />
        <h4>Thời gian làm việc hôm nay</h4>
        {checkDayoff ? (
          <h3 className="center">Hôm nay đã được duyệt nghỉ phép</h3>
        ) : (
          <div className="Dashboard-action">
            <div className="Dashboard-action--start">
              <p>Bắt đầu</p>
              {checkStart ? (
                <div className="card-time">
                  <div className="card-time--hour">
                    <small>Giờ</small>
                    <input
                      value={startTime?.hours || '00:00'}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                  :
                  <div className="card-time--minute">
                    <small>Phút</small>
                    <input
                      value={startTime?.minutes || '00:00'}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                </div>
              ) : (
                <button
                  className="Dashboard-action--circle"
                  onClick={handleStart}
                >
                  <img
                    src={require('../../../../assets/icon-play.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
              )}
            </div>
            <div className="Dashboard-action--end">
              <p>Kết thúc</p>
              {checkEnd ? (
                <div className="card-time">
                  <div className="card-time--hour">
                    <small>Giờ</small>
                    <input
                      value={endTime?.hours || '00:00'}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                  :
                  <div className="card-time--minute">
                    <small>Phút</small>
                    <input
                      value={endTime?.minutes || '00:00'}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                </div>
              ) : (
                <button
                  className="Dashboard-action--circle"
                  onClick={handleEnd}
                >
                  <img
                    src={require('../../../../assets/icon-check.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
