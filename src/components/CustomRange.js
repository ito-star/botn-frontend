import React, { useState, useEffect } from 'react'
import './CustomRange.style.css'
import styled from 'styled-components'
import Container from './Container'
const InputContainer = styled.div`
  width: 100%;
  margin: 0.6rem 0;
  padding: 0 1.5rem;
  position: relative;
  display: flex;
  align-items: center;

  & input {
    width: 100%;
    height: 0.2rem;
  }

  & .label-left {
    position: absolute;
    /* top:-5; */
    left: 0;
    font-size: 0.65rem;
  }

  & .label-right {
    position: absolute;
    /* top:0; */
    right: -0.6rem;
    font-size: 0.65rem;
  }
`

const CurrentInputLabel = styled.div`
  position: absolute;
  left: ${(props) => 'calc(((98% - 3rem) * ' + (props.value - 1) + ') / 9 )'};
  top: 1rem;
  font-size: 0.7rem;
  background: white;
  box-shadow: 1px 1px 10px #d1d1d1;
  margin: 0 0rem 0 1.5rem;
  padding: 0.2rem;
  width: 40px;
  text-align: center;
  /* left:0; */
  /* width:calc(100% - 3rem); */
  /* background-color: aqua; */
  transform: translateX(-50%);
`
function CustomRange({ value, setValue }) {
  // const [value, setValue] = useState(0)

  useEffect(() => {
    const rangeInputFunction = (e) => {
      setValue(e.target.value)
    }
    var rangeInputElement = document.getElementById('rangeInput')
    rangeInputElement.addEventListener('input', rangeInputFunction)

    return () => {
      rangeInputElement.removeEventListener('input', rangeInputFunction)
    }
  }, [])
  return (
    <InputContainer>
      <input id="rangeInput" min="1" max="10" type="range" value={value} />
      <div className="label-left">1 Yr</div>
      <div className="label-right">10 Yrs</div>
      <CurrentInputLabel value={value}>{value} Yrs</CurrentInputLabel>
    </InputContainer>
  )
}

export default CustomRange
