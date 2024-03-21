import React, { useEffect, useState } from 'react';
import './Card.scss';
// import { urlControl } from '../../routes/server';
// import axios from 'axios';

interface TimeProps {
  defaultHours?: number;
  defaultMinutes?: number;
  onChange?: (hours: number, minutes: number) => void;
}

const CardTime: React.FC<TimeProps> = ({ defaultHours = 0, defaultMinutes = 0, onChange }) => {
  const [editedHours, setEditedHours] = useState<string>(String(defaultHours).padStart(2, '0'));
  const [editedMinutes, setEditedMinutes] = useState<string>(String(defaultMinutes).padStart(2, '0'));

  useEffect(() => {
    // Cập nhật state khi nhận được dữ liệu mặc định mới từ props
    setEditedHours(String(defaultHours).padStart(2, '0'));
    setEditedMinutes(String(defaultMinutes).padStart(2, '0'));
  }, [defaultHours, defaultMinutes]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = e.target.value.slice(0, 2);
    newHours = Math.min(Math.max(parseInt(newHours, 10) || 0, 0), 23).toString();
    setEditedHours(newHours);

    onChange && onChange(parseInt(newHours, 10) || 0, parseInt(editedMinutes, 10) || 0);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = e.target.value.slice(0, 2);
    newMinutes = Math.min(Math.max(parseInt(newMinutes, 10) || 0, 0), 59).toString();
    setEditedMinutes(newMinutes);

    onChange && onChange(parseInt(editedHours, 10) || 0, parseInt(newMinutes, 10) || 0);
  };



  // setIsTimerActive(true);

  return (
    <div className="card-time">
      <div className="card-time--hour">
        <small>Giờ</small>
        <input
          value={editedHours}
          onChange={handleHoursChange}
        />
      </div>
      :
      <div className="card-time--minute">
        <small>Phút</small>
        <input
          value={editedMinutes}
          onChange={handleMinutesChange}
        />
      </div>
    </div>
  );
};

export default CardTime;
