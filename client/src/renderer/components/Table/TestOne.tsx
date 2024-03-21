
import axios from 'axios';
import { useEffect, useState } from 'react';


const TextOne = () =>{

const [currentTime, setCurrentTime] = useState('');
const fetchCurrentTime = async () => {
        try {
            const response = await axios.get('https://worldtimeapi.org/api/ip');
            const { datetime } = response.data;
            setCurrentTime(datetime);
        } catch (error) {
            console.error('Lỗi khi lấy thời gian hiện tại:', error);
            
        }
        };

        useEffect(() => {
        fetchCurrentTime();
        }, []);


        return(
            <td>{currentTime}</td>
        )
}

export default TextOne;