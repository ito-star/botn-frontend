export const YearsOrMonthsSelector = ({ value, onChange, disabled, pluralLabels = false, customLabels = false}) => {
  const style = {
    position: 'absolute',
    right: '0.5rem',
    bottom: '0.5rem',
    backgroundColor: 'transparent',
    fontSize: '0.7rem',
    border: 'none',
    boxShadow: '0px 0px 2px gray',
    color: '#494949',
    borderRadius: '0.2rem',
  }

  if (!customLabels) return (
    <select style={style} value={value} onChange={onChange} disabled={disabled}>
      <option value="years">{pluralLabels ? "Years" : "Year"}</option>
      <option value="months">{pluralLabels ? "Months" : "Month"}</option>
    </select>
  ) 
  else return (
    <select style={style} value={value} onChange={onChange} disabled={disabled}>
      <option value="years">{customLabels.year}</option>
      <option value="months">{customLabels.month}</option>
    </select>
  )
}

export default YearsOrMonthsSelector
