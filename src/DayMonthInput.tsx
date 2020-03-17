import React from 'react';

interface MonthObj {
  name: string;
  label: string;
  days: number;
}

const range = (size: number) => new Array(size).fill(null).map((_, i) => i);

const MONTHS: Array<MonthObj> = [
  { name: 'january', label: 'Janvier', days: 31 },
  { name: 'february', label: 'Février', days: 29 },
  { name: 'march', label: 'Mars', days: 31 },
  { name: 'april', label: 'Avril', days: 30 },
  { name: 'may', label: 'Mai', days: 31 },
  { name: 'june', label: 'Juin', days: 30 },
  { name: 'july', label: 'Juillet', days: 31 },
  { name: 'august', label: 'Août', days: 31 },
  { name: 'september', label: 'Septembre', days: 30 },
  { name: 'october', label: 'Octobre', days: 31 },
  { name: 'november', label: 'Novembre', days: 30 },
  { name: 'december', label: 'Décembre', days: 31 }
];

interface Props {
  day: number;
  month: number;
  setDay: (value: number) => void;
  setMonth: (value: number) => void;
  label: string;
}

export const DayMonthInput: React.FC<Props> = ({ label, month, day, setDay, setMonth }) => {
  const monthObj = MONTHS[month];

  React.useEffect(() => {
    if (day > monthObj.days) {
      setDay(monthObj.days);
    }
  });

  return (
    <div className="DayMonthInput">
      <p className="label">{label}</p>
      <div className="DayMonthInput--block">
        <select
          value={day}
          onChange={e => {
            setDay(parseInt(e.target.value, 10));
          }}
        >
          {range(monthObj.days)
            .map(v => v + 1)
            .map(num => (
              <option value={num} key={num}>
                {num.toFixed().padStart(2, '0')}
              </option>
            ))}
        </select>
        <select
          value={monthObj.name}
          onChange={e => {
            const index = MONTHS.findIndex(v => v.name === e.target.value);
            setMonth(index);
          }}
        >
          {MONTHS.map(select => (
            <option value={select.name} key={select.name}>
              {select.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
