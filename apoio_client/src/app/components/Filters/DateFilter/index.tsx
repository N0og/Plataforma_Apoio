import React, {
  SetStateAction,
  useEffect, useState
} from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import { pt } from 'date-fns/locale/pt';
import { useNotifyEvent } from '../../../hooks';

import {
  FilterDataCalendar,
  FilterDataContainer,
  FilterIcon
} from '../../../styles';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt', pt)

export const DateFilter: React.FC<{
  changeFilter: React.Dispatch<SetStateAction<Array<string>>>
}> = ({ changeFilter }) => {

  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (startDate! > endDate!) {
      null
    }
    if (startDate && endDate) {
      changeFilter([startDate.toJSON().split('T')[0], endDate.toJSON().split('T')[0]])
    }
  }, [startDate, endDate])

  const changeData = (date: Date | null, setDate: (date: any) => any) => {
    if (endDate &&
      endDate > date! &&
      date! <= new Date()) {
      setDate(date)
    }

    else {
      useNotifyEvent('Data Inválida', 1000, 'error')
    }
  }

  return (
    <FilterDataContainer>
      <FilterIcon>
        <i className="fa-solid fa-calendar-days"></i>
      </FilterIcon>
      <FilterDataCalendar>
        <DatePicker
          selected={startDate}
          onChange={date => changeData(date, setStartDate)}
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
          onChange={date => changeData(date, setEndDate)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale="pt"
          placeholderText="Data Final"
          className="fimSelect"
          dateFormat={'dd/MM/yyyy'}
        />
      </FilterDataCalendar>

    </FilterDataContainer>
  )
}
