import styled from 'styled-components'
import { getCurrency, getRate, getNumber } from '../utils/inputFormatter'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Tooltip } from '@mui/material'

const Input = styled.input`
  border: none;
  background: transparent;
  padding: 1.3rem 0.6rem 0rem 0.6rem;
  font-size: 0.7rem;
  color: gray;
  &:focus {
    outline: none;
  }
  cursor: ${(props) => (props.disabled ? 'not-allowed' : '')};
`

const Container = styled.div`
  width: 100%;
  min-width: 200px;
  border: 1px solid ${(props) => (props.error ? 'red' : '#e2e2e1')};
  border-radius: 0.6rem;
  background-color: ${(props) => (props.error ? '#ff000012' : '#f5f6fb')};
  position: relative;
  flex: 1;
  min-width: 0;
`

const LabelContainer = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  left: 0.6rem;
  top: 0.2rem;
`

const Label = styled.div`
  font-weight: 600;
  top: 0.2rem;
  left: 0.5rem;
  font-size: 0.6rem;
  color: ${(props) => (props.disabled ? 'grey' : 'black')};
  margin-right: 0.2rem;
`

export const formatter = (e, format) => {
  if (format === 'dollar') {
    return getCurrency(e.target.value)
  } else if (format === 'rate') {
    const rate = getRate(e.target.value)
    if (rate) {
      window.requestAnimationFrame(() => {
        e.target.setSelectionRange(rate.length - 1, rate.length - 1)
      })
    }
    return rate
  } else if (format === 'number') {
    return getNumber(e.target.value)
  } else if (format === 'input') {
    return e.target.value
  } else {
    return e.target.value
  }
}

const triggerOnChange = (e, onChange, format) => {
  onChange(formatter(e, format))
}

const triggerOnBlur = (e, onBlur, format) => {
  onBlur(formatter(e, format))
}

function TextField({
  label,
  placeholder,
  value,
  style,
  disabled,
  onChange,
  format,
  error,
  onFocus,
  onBlur = () => null,
  tooltip,
}) {
  return (
    <Container style={style} error={error}>
      <LabelContainer>
        <Label disabled={disabled}>{label}&nbsp;</Label>
        {tooltip && (
          <Tooltip title={tooltip} placement="top">
            <InfoOutlinedIcon sx={{ fontSize: 14, transform: 'translateY(-1px)' }} />
          </Tooltip>
        )}
      </LabelContainer>
      <Input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => triggerOnChange(e, onChange, format)}
        onFocus={onFocus}
        onBlur={(e) => triggerOnBlur(e, onBlur, format)}
      />
    </Container>
  )
}

export default TextField
