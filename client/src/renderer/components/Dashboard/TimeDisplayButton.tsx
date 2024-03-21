import React, { useEffect, useState } from 'react';
import CardTime from '../Card/Card';
import { urlTimeApi } from '../../routes/server';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import axios from '../../api/axios';

interface TimeDisplayButtonProps {
  initialImage: string;
}

const TimeDisplayButton: React.FC<TimeDisplayButtonProps> = ({
  initialImage,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const [currentTime, setCurrentTime] = useState(0);
  const [buttonImage, setButtonImage] = useState(initialImage);
  const [startHours, setStartHours] = useState(0);
  const [startMinutes, setStartMinutes] = useState(0);

  const fetchCurrentTime = async () => {
    try {
      const response = await axios.get(urlTimeApi);
      const { datetime } = response.data;
      setCurrentTime(datetime);
    } catch (error) {
      console.error('Lỗi khi lấy thời gian hiện tại:', error);
    }
  };

  useEffect(() => {
    fetchCurrentTime();
  }, []); // useEffect chỉ chạy một lần sau khi component mount

  const handleClick = async () => {
    try {
      const response = await axios.get(urlTimeApi);
      const { datetime } = response.data;
      const hours = new Date(datetime).getHours();
      const minutes = new Date(datetime).getMinutes();

      setStartHours(hours);
      setStartMinutes(minutes);

      //  const formattedTime = `${startHours}:${startMinutes}`;
    } catch (error) {
      console.error('Lỗi khi lấy thời gian từ API:', error);
    }

    // Example: Change the image when the button is clicked
    // setButtonImage(require('../../../../assets/icon-play.png'));
  };

  return (
    <>
      <button className="Dashboard-action--circle" onClick={handleClick}>
        <img src={buttonImage} alt="" className="fluid-image" />
      </button>
      <CardTime defaultHours={startHours} defaultMinutes={startMinutes} />
    </>
  );
};

export default TimeDisplayButton;
