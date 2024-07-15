export const PercentOrDollarSelector = ({ value, onChange, disabled }) => {
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

  return (
    <select style={style} value={value} onChange={onChange} disabled={disabled}>
      <option value="dollar">Dollar</option>
      <option value="rate">Percent</option>
    </select>
  )
}

export default PercentOrDollarSelector
