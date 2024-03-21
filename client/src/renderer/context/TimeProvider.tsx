import React, { ReactNode, createContext, useContext, useState } from 'react';

interface StartTimeState {
  sHours: string;
  sMinutes: string;
}

const initialStartTimeState: StartTimeState = {
  sHours: "00",
  sMinutes: "00",
};

interface DelayTimeState {
  dHours: string;
  dMinutes: string;
}

const initialDelayTimeState: DelayTimeState = {
  dHours: "00",
  dMinutes: "00",
};

interface EndTimeState {
  eHours: string;
  eMinutes: string;
}

const initialEndTimeState: EndTimeState = {
  eHours: "00",
  eMinutes: "00",
};

const TimeContext = createContext<{
  startTime: StartTimeState;
  setStartTime: React.Dispatch<any>;
  delayTime: DelayTimeState;
  setDelayTime: React.Dispatch<any>;
  endTime: EndTimeState;
  setEndTime: React.Dispatch<any>;
}>({
  startTime: initialStartTimeState,
  setStartTime: () => null,
  delayTime: initialDelayTimeState,
  setDelayTime: () => null,
  endTime: initialEndTimeState,
  setEndTime: () => null,
});

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startTime, setStartTime] = useState(initialStartTimeState);
  const [delayTime, setDelayTime] = useState(initialDelayTimeState);
  const [endTime, setEndTime] = useState(initialEndTimeState);

  return (
    <TimeContext.Provider value={{ startTime, setStartTime, delayTime, setDelayTime, endTime, setEndTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTimeContext = () => useContext(TimeContext);
