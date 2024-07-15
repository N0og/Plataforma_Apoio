import React, { SetStateAction, useEffect, useState } from 'react';
import './FiltroData.css';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pt } from 'date-fns/locale/pt';

registerLocale('pt', pt)

export const FiltroData: React.FC<{
  changeFilter: React.Dispatch<SetStateAction<Array<string>>>
  }> = ({changeFilter}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(()=>{
    if (startDate! > endDate!){
      setStartDate
    }
    if (startDate && endDate){
      changeFilter([startDate.toJSON().split('T')[0], endDate.toJSON().split('T')[0]])
    }
  }, [startDate, endDate])

  const changeData = (date:Date|null) => {
    if (endDate && endDate > date!) setStartDate(date)
    
  }

  return (
    <div className="filterData-container">
      <div className="filterIcon">
        <i className="fa-solid fa-calendar-days"></i>
      </div>
      <div className="datePicker-container">
        <DatePicker
          selected={startDate}
          onChange={date => changeData(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale="pt"
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
          locale="pt"
          placeholderText="Data Final"
          className="fimSelect"
          dateFormat={'dd/MM/yyyy'}
        />
      </div>

    </div>
  )
}
