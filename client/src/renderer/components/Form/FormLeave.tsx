import { useEffect, useState } from 'react';

import './From.scss';
import 'react-datepicker/dist/react-datepicker.css';
import TimePickerButton from '../Modal/TimeSelect';
import { isBefore, format, parse } from 'date-fns';
import Modaldelete from '../Modal/Modaldelete';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import DatePicker from 'react-multi-date-picker';

export const FormLeave: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [note, setNote] = useState('');
  const [timeStart, setTimeStart] = useState('07:30');
  const [timeEnd, setTimeEnd] = useState('17:00');
  const [leaveDate, setLeaveDate] = useState([new Date()]);
  const [usersID, setUsersID] = useState();
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const [noteErr, setNoteErr] = useState(0);

  const [isChecked, setIsChecked] = useState(true);
  const [opentimeValue, setOpentimeValue] = useState<string | undefined>(
    undefined,
  );

  const [closetimeValue, setClosetimeValue] = useState<string | undefined>(
    undefined,
  );
  const [openlunchValue, setOpenlunchValue] = useState<string | undefined>(
    undefined,
  );
  const [closelunchValue, setCloselunchValue] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();
  useEffect(() => {
    setUsersID(users.id);
  }, []);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const openModaldelete = () => {
    setDeleteModalOpen(true);
  };
  const closeModaldelete = () => {
    setDeleteModalOpen(false);
  };
  const handleLeaveDateChange = (date: any) => {
    if (date !== null) {
      const dateObjects = date.map((dateString: any) => new Date(dateString));
      setLeaveDate(dateObjects);
    }
  };
  const formatTimeDigit = (digit: number): string => {
    return digit < 10 ? `0${digit}` : `${digit}`;
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
  const compareTime = (time1: string, time2: string): number => {
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
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
    const formattedHours = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
    const formattedMinutes =
      totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  };
  function findConfigValue(configArray: any[], key: string) {
    const configItem = configArray.find((item) => item.config_key === key);
    return configItem ? configItem.config_value : null;
  }

  const handleConfirmClick = async () => {
    let timeLeave = '';
    let dayLeave = '';
    let error = 0;
    if (opentimeValue && openlunchValue && closelunchValue && closetimeValue) {
      if (compareTime(timeStart, timeEnd) == 0) {
        timeLeave = '00:00';
      } else if (compareTime(timeStart, opentimeValue) != 1) {
        if (compareTime(timeEnd, opentimeValue) != 1) {
          timeLeave = '00:00';
        } else if (compareTime(timeEnd, openlunchValue) != 1) {
          timeLeave = calculateTime(opentimeValue, timeEnd);
        } else if (compareTime(timeEnd, closelunchValue) != 1) {
          timeLeave = calculateTime(opentimeValue, openlunchValue);
        } else if (compareTime(timeEnd, closetimeValue) != 1) {
          timeLeave = addTimes(
            calculateTime(opentimeValue, openlunchValue),
            calculateTime(closelunchValue, timeEnd),
          );
        } else {
          timeLeave = addTimes(
            calculateTime(opentimeValue, openlunchValue),
            calculateTime(closelunchValue, closetimeValue),
          );
        }
      } else {
        if (compareTime(timeStart, openlunchValue) != 1) {
          if (compareTime(timeEnd, openlunchValue) != 1) {
            timeLeave = calculateTime(timeStart, timeEnd);
          } else if (compareTime(timeEnd, closelunchValue) != 1) {
            timeLeave = calculateTime(timeStart, openlunchValue);
          } else if (compareTime(timeEnd, closetimeValue) != 1) {
            timeLeave = addTimes(
              calculateTime(timeStart, openlunchValue),
              calculateTime(closelunchValue, timeEnd),
            );
          } else {
            timeLeave = addTimes(
              calculateTime(timeStart, openlunchValue),
              calculateTime(closelunchValue, closetimeValue),
            );
          }
        } else if (compareTime(timeStart, closelunchValue) == 1) {
          if (compareTime(timeStart, closetimeValue) == 1) {
            timeLeave = '00:00';
          } else if (compareTime(timeEnd, closetimeValue) != 1) {
            timeLeave = calculateTime(timeStart, timeEnd);
          } else {
            timeLeave = calculateTime(timeStart, closetimeValue);
          }
        } else {
          if (compareTime(timeEnd, closelunchValue) != 1) {
            timeLeave = '00:00';
          } else if (compareTime(timeEnd, closetimeValue) != 1) {
            timeLeave = calculateTime(closelunchValue, timeEnd);
          } else {
            timeLeave = calculateTime(closelunchValue, closetimeValue);
          }
        }
      }
      let timeWork = addTimes(
        calculateTime(opentimeValue, openlunchValue),
        calculateTime(closelunchValue, closetimeValue),
      );
      if (leaveDate.length > 1) {
        if (compareTime(timeLeave, timeWork) == 0) {
          dayLeave = leaveDate.length + ' ngày';
        } else {
          dayLeave = leaveDate.length - 1 + ' ngày ' + timeLeave + ' giờ';
        }
      } else {
        if (compareTime(timeLeave, timeWork) == 0) {
          dayLeave = leaveDate.length + ' ngày';
        } else {
          dayLeave = timeLeave + ' giờ';
        }
      }
    }
    const formattedLeaveDate = leaveDate
      .map((date) => format(date, 'dd-MM-yyyy'))
      .join(', ');
    const group_data = {
      user_id: usersID,
      date: formattedLeaveDate,
      time_start: timeStart,
      time_end: timeEnd,
      note: note,
      day_number: dayLeave,
      status: 0,
      owner: '',
    };
    let cons = await axiosPrivate.get('dayoffs/getforuser/' + users.id);
    const leaveDatesArray = formattedLeaveDate.split(', ');
    function isLeaveDateInConsData(leaveDate: string) {
      return cons.data.some(
        (item: { date: string }) => item.date === leaveDate,
      );
    }
    type LeaveDateItem = Date;
    function checkLeaveDate(leaveDateArray: LeaveDateItem[]) {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      for (const leaveDateTime of leaveDateArray) {
        if (leaveDateTime < yesterday) {
          setNoteErr(4);
          error = 4;
        }
      }
    }
    if (note) {
      setNoteErr(0);
      leaveDatesArray.forEach((leaveDate) => {
        if (isLeaveDateInConsData(leaveDate)) {
          setNoteErr(2);
          error = 2;
        }
      });
      if (formattedLeaveDate.length == 0) {
        setNoteErr(3);
        error = 3;
      }
      checkLeaveDate(leaveDate);
    } else if (!note && formattedLeaveDate.length == 0) {
      setNoteErr(5);
      error = 5;
    } else {
      setNoteErr(1);
      error = 1;
    }
    if (error == 0) {
      axiosPrivate
        .post('dayoffs/add', { group_data })
        .then((response) => {
          // console.log(response.data);
          navigate('/dayoffs');
        })
        .catch((error) => {
          console.error('Error inserting data:', error);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Server error message:', error.response.data);
          }
        });
    }
    closeModaldelete();
  };

  const handleCheckboxChange = () => {
    if (isChecked == true) {
      if (
        opentimeValue &&
        openlunchValue &&
        closelunchValue &&
        closetimeValue
      ) {
        setTimeStart(opentimeValue);
        setTimeEnd(closetimeValue);
      }
    }
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    const fetchData = async () => {
      const responseConfig = await axiosPrivate.post('config');
      const configData = responseConfig.data;
      setOpentimeValue(findConfigValue(configData, 'opentime'));
      setClosetimeValue(findConfigValue(configData, 'closetime'));
      setOpenlunchValue(findConfigValue(configData, 'openlunch'));
      setCloselunchValue(findConfigValue(configData, 'closelunch'));
    };
    fetchData();
  });

  return (
    <div className="form-leave form">
      <div className="form-content">
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label>
                Ngày nghỉ phép
                <img
                  src={require('../../../../assets/icon-time.jpg')}
                  alt=""
                  className="fluid-image"
                />
              </label>
              <div>
                <DatePicker
                  onChange={(date) => handleLeaveDateChange(date)}
                  multiple
                  value={leaveDate}
                  format="DD-MM-YYYY"
                />
                {noteErr == 2 ? (
                  <p className="text-error">* Xin nghỉ phép có ngày trùng!</p>
                ) : null}
                {noteErr == 3 || noteErr == 5 ? (
                  <p className="text-error">* Không được để trống!</p>
                ) : null}
                {noteErr == 4 ? (
                  <p className="text-error">
                    * Không được xin nghỉ ngày trong quá khứ!
                  </p>
                ) : null}
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  cả ngày
                </label>
              </div>
            </div>
          </div>
          {isChecked ? (
            ''
          ) : (
            <>
              <div className="col-12">
                <div className="form-group form-group--small">
                  <label>
                    Giờ bắt đầu
                    <img
                      src={require('../../../../assets/icon-time.jpg')}
                      alt=""
                      className="fluid-image"
                    />
                  </label>
                  <TimePickerButton
                    defaultValue={timeStart}
                    onChange={(newValue) => setTimeStart(newValue)}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group form-group--small">
                  <label>
                    Giờ kết thúc
                    <img
                      src={require('../../../../assets/icon-time.jpg')}
                      alt=""
                      className="fluid-image"
                    />
                  </label>
                  <TimePickerButton
                    defaultValue={timeEnd}
                    onChange={(newValue) => setTimeEnd(newValue)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="col-12">
            <div className="form-group">
              <label>
                Lý do nghỉ
                <img
                  src={require('../../../../assets/icon-practice.jpg')}
                  alt=""
                  className="fluid-image"
                />
              </label>
              <div>
                <textarea
                  className="form-input"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                {noteErr == 1 || noteErr == 5 ? (
                  <p className="text-error">* Phải nhập lý do nghỉ!</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="wrp-button">
          <button
            className="btn btn--green"
            onClick={(event) => {
              openModaldelete();
            }}
          >
            Xác nhận
          </button>
          <button
            className="btn btn--orange"
            onClick={(event) => {
              setLeaveDate([new Date()]);
              setNote('');
            }}
          >
            Hủy
          </button>
        </div>
      </div>
      <Modaldelete isOpen={isDeleteModalOpen} onRequestClose={closeModaldelete}>
        <>
          <h2 className="mb15">Xác nhận xin nghỉ phép:</h2>
          <table className="table-modal">
            <tbody>
              <tr>
                <td>Ngày xin nghỉ</td>
                <td>
                  {leaveDate.map((date, index) => (
                    <span key={index}>
                      {format(date, 'dd-MM-yyyy').toString()} ,
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Giờ bắt đầu</td>
                <td>{timeStart}</td>
              </tr>
              <tr>
                <td>Giờ kết thúc</td>
                <td>{timeEnd}</td>
              </tr>
              <tr>
                <td>Lý do nghỉ</td>
                <td>{note}</td>
              </tr>
            </tbody>
          </table>
          <div className="wrp-button">
            <button className="btn btn--green" onClick={handleConfirmClick}>
              Đồng ý
            </button>
            <button className="btn btn--orange" onClick={closeModaldelete}>
              Hủy
            </button>
          </div>
        </>
      </Modaldelete>
    </div>
  );
};
