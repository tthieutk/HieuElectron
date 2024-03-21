import { useEffect, useState } from 'react';
import { urlTimeApi } from '../../routes/server';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import axios from '../../api/axios';

function DashboardTime() {
  const axiosPrivate = useAxiosPrivate();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(urlTimeApi);
        const data = response.data;
        // Create a Date object from the time string
        setCurrentTime(new Date(data.datetime));
      } catch (error) {
        console.error('Error fetching time:', error);
      }
    };

    fetchTime();
    const intervalId = setInterval(() => {
      setCurrentTime(
        (prevCurrentTime) => new Date(prevCurrentTime.getTime() + 1000),
      );
    }, 1000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  let formattedDay,
    formattedMonth,
    formattedDate,
    formattedHour,
    formattedMinute,
    formattedSecond,
    formattedDatef;
  if (currentTime) {
    formattedDay = weekdays[currentTime.getDay()];
    formattedMonth = currentTime.getMonth() + 1;
    formattedDate = currentTime.getDate();
    formattedHour = currentTime.getHours();
    formattedMinute = currentTime.getMinutes();
    formattedSecond = currentTime.getSeconds();
    formattedDatef = `${formattedDate}/${formattedMonth}`;
  }
  // Định dạng thời gian để hiển thị

  return (
    <div className="Dashboard-time">
      <div className="Dashboard-time--content">
        <p>
          {/* {currentDateTime} */}
          {formattedDatef} <em>({formattedDay})</em>
          <span>Ngày</span>
        </p>
        :
        <p>
          {/* {currentHour} */}
          {String(formattedHour).padStart(2, '0')}
          <span>Giờ</span>
        </p>
        :
        <p>
          {String(formattedMinute).padStart(2, '0')}
          <span>Phút</span>
        </p>
        :
        <p>
          {String(formattedSecond).padStart(2, '0')}
          <span>Giây</span>
        </p>
      </div>
    </div>
  );
}

export default DashboardTime;
