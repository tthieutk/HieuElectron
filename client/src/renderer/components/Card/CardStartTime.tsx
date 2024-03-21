import { useTimeContext } from "../../context/TimeProvider";
import './Card.scss';

function CardStartTime(){
  const { startTime, setStartTime } = useTimeContext();
  return(
    <div className="card-time">
      <div className="card-time--hour">
        <small>hours</small>
        <input
          value={startTime.sHours} onChange={(e) => (e.target.value)}
        />
      </div>
      :
      <div className="card-time--minute">
        <small>minutes</small>
        <input
          value={startTime.sMinutes} onChange={(e) => (e.target.value)}
        />
      </div>
    </div>
  )
}

export default CardStartTime;
