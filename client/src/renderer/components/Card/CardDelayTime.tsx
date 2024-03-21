import { useTimeContext } from "../../context/TimeProvider";
import './Card.scss';

function CardDelayTime(){
  const { delayTime, setDelayTime } = useTimeContext();
  return(
    <div className="card-time">
      <div className="card-time--hour">
        <small>hours</small>
        <input
          value={delayTime.dHours} onChange={(e) => (e.target.value)}
        />
      </div>
      :
      <div className="card-time--minute">
        <small>minutes</small>
        <input
          value={delayTime.dMinutes} onChange={(e) => (e.target.value)}
        />
      </div>
    </div>
  )
}

export default CardDelayTime;
