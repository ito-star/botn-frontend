import styled from 'styled-components'
export const Flex = styled.div`
  display: flex;
  gap: ${(props) => (props.gap ? props.gap : '10px')};
  flex-wrap: wrap;
  padding-top: ${(props) => (props.pt ? props.pt : 0)};
  justify-content: ${(props) => (props.jc ? props.jc : 'space-between')};
  flex-direction: ${(props) => (props.flexDirection ? props.flexDirection : 'row')};
  height: ${(props) => (props.h ? props.h : 'auto')};
`

export const TextWithIcon = styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  flex: ${(props) => (props.flex ? props.flex : 1)};
  display: flex;
  align-items: center;

  & .icon {
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
    background-image: url('/images/add.svg');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }

  &:hover {
    color: #0773ff;
    cursor: pointer;
  }

  &:hover .icon {
    background-image: url('/images/add_hover.svg');
  }
`

export const Button = styled.button`
  min-width: 10rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0 2px grey;
  font-weight: 600;
  color: ${(props) => (props.color ? props.color : 'black')};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : 'rgb(239,239,239)'};
`

export const TextArea = styled.textarea`
  flex: 1;
  height: ${(props) => (props.h ? props.h : '4rem')};
  border: 1px solid #e2e2e1;
  border-radius: 0.6rem;
  background-color: #f5f6fb;
  padding: 0.4rem 0.6rem 0.3rem 0.6rem;
`

export const InputWithDropdownContainer = styled.div`
  flex: 1;
  flex-basis: 0;
  position: relative;
`
