import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-width: 4rem;
  height: 1.5rem;
  border-radius: 0.6rem;
  background-color: #cce1fc;
  position: relative;
`
const YesNoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 0.6rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  & .labelTrue {
    flex: 1;
    text-align: center;
    line-height: 1.5rem;
    height: 100%;
    padding: 0 4px;

    color: ${(props) => (props.toggleState ? 'white' : 'grey')};
    font-weight: 600;
  }

  & .labelFalse {
    flex: 1;
    text-align: center;
    line-height: 1.5rem;
    height: 100%;
    padding: 0 4px;
    color: ${(props) => (!props.toggleState ? 'white' : 'grey')};
    font-weight: 600;
  }
`

const HighlightContent = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #0773ff;
  top: 0;
  left: ${(props) => (props.toggleState ? 0 : '50%')};
  text-align: center;
  transition: all 0.3s ease-in-out;
  border-radius: 0.6rem;
`

function CustomToggle({ value, setValue, disabled, yesLabel = 'Yes', noLabel = 'No' }) {
  // const [toggleState, setToggleState] = useState(false);
  return (
    <Container>
      <HighlightContent toggleState={value}></HighlightContent>
      <YesNoContainer toggleState={value} disabled={disabled}>
        <div className="labelTrue" disabled={true} onClick={() => !disabled && setValue(true)}>
          {yesLabel}
        </div>
        <div
          className="labelFalse"
          disabled={disabled}
          onClick={() => !disabled && setValue(false)}
        >
          {noLabel}
        </div>
      </YesNoContainer>
    </Container>
  )
}

export default CustomToggle
