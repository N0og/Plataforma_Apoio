import React, { SetStateAction, useEffect, useState } from 'react';
import './FiltroData.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const FiltroData: React.FC<{
  changeFilter: React.Dispatch<SetStateAction<string>>
}> = ({changeFilter}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(()=>{
    if (startDate && endDate){
      changeFilter(startDate.toJSON().split('T')[0]+' '+endDate.toJSON().split('T')[0])
    }
  }, [startDate, endDate])

  return (
    <div className="filterData-container">
      <div className="filterIcon">
        <i className="fa-solid fa-calendar-days"></i>
      </div>
      <div className="datePicker-container">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Data Início"
          className="inicioSelect"
          dateFormat={'dd/MM/yyyy'}
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Data Final"
          className="fimSelect"
          dateFormat={'dd/MM/yyyy'}
        />
      </div>

    </div>
  )
}
