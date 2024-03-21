import React, { useState, useEffect, useCallback } from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import Modal from './Modal';

interface TimeSelectProps {
  defaultValue?: string;
  onChange?: (newValue: string) => void;
}

const TimePickerButton: React.FC<TimeSelectProps> = ({
  defaultValue,
  onChange,
}) => {
  const initialTime = setHours(setMinutes(new Date(), 0), 8);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [inputValue, setInputValue] = useState('');
  const [tempHours, setTempHours] = useState(8 || null);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempInputValue, setTempInputValue] = useState('');
  const [confirmButtonClicked, setConfirmButtonClicked] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      const hours = parseInt(defaultValue.split(':')[0], 10);
      const minutes = parseInt(defaultValue.split(':')[1], 10);

      setTempHours(hours);
      setTempMinutes(minutes);
      const updatedTime = setHours(setMinutes(selectedTime, minutes), hours);
      setTempInputValue(format(updatedTime, 'HH:mm'));
    }
  }, [defaultValue, selectedTime]);
  // const padStart2Digits = (value: number) => value.toString().padStart(2, '0');
  const increaseHour = () => {
    setTempHours((prevHours) => prevHours + 1);
  };

  const decreaseHour = () => {
    setTempHours((prevHours) => prevHours - 1);
  };

  const increaseMinute = () => {
    setTempMinutes((prevMinutes) => (prevMinutes + 5) % 60);
  };

  const decreaseMinute = () => {
    setTempMinutes((prevMinutes) => (prevMinutes - 5 + 60) % 60);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSetTime = useCallback(() => {
    if (
      !isNaN(tempHours) &&
      !isNaN(tempMinutes) &&
      tempHours >= 0 &&
      tempHours <= 23 &&
      tempMinutes >= 0 &&
      tempMinutes <= 59
    ) {
      const updatedTime = setHours(
        setMinutes(selectedTime, tempMinutes),
        tempHours,
      );
      setSelectedTime(updatedTime);
      closeModal();
      setConfirmButtonClicked(true);
      // Gọi hàm onChange để truyền giá trị mới
      if (onChange) {
        onChange(format(updatedTime, 'HH:mm'));
      }
    } else {
      console.error('Giá trị thời gian không hợp lệ.');
    }
  }, [tempHours, tempMinutes, selectedTime, closeModal, onChange]);

  const openModal = () => {
    setModalOpen(true);
    if (defaultValue) {
      const hours = parseInt(defaultValue.split(':')[0], 10);
      const minutes = parseInt(defaultValue.split(':')[1], 10);
      setTempHours(hours);
      setTempMinutes(minutes);
    } else {
      setTempHours(7);
      setTempMinutes(30);
    }
  };

  useEffect(() => {
    // Chỉ cập nhật tempInputValue khi nút Xác nhận được nhấn
    if (confirmButtonClicked) {
      setTempInputValue(format(selectedTime, 'HH:mm'));
      setConfirmButtonClicked(false); // Đặt lại trạng thái của nút
    }
  }, [confirmButtonClicked, selectedTime]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  const handleChange = () => {};

  return (
    <div>
      <input
        className="form-input"
        onFocus={openModal}
        onChange={handleInputChange}
        onClick={openModal}
        value={inputValue || tempInputValue || defaultValue || '07:30'}
        readOnly
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {
          <div className="modal-setTime">
            <div className="modal-setTime--content">
              <div className="modal-setTime--number">
                <button className="plus" onClick={increaseHour}>
                  <img
                    src={require('../../../../assets/icon-plus.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
                <span>{tempHours}</span>
                <button className="minus" onClick={decreaseHour}>
                  <img
                    src={require('../../../../assets/icon-minus.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
              </div>
              <div className="modal-setTime--number">
                <button className="plus" onClick={increaseMinute}>
                  <img
                    src={require('../../../../assets/icon-plus.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
                <span>{tempMinutes}</span>
                <button className="minus" onClick={decreaseMinute}>
                  <img
                    src={require('../../../../assets/icon-minus.png')}
                    alt=""
                    className="fluid-image"
                  />
                </button>
              </div>
            </div>
            <div className="wrp-button">
              <button className="btn" onClick={handleSetTime}>
                Xác nhận
              </button>
              <button className="btn btn--orange" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        }
      </Modal>
    </div>
  );
};

export default TimePickerButton;
