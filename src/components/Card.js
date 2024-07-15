import styled from 'styled-components'
import React from 'react'

const CardContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.h ? props.h : '')};
  border-radius: 10px;
  box-shadow: 1px 1px 10px #d1d1d1;
  display: flex;
  flex-direction: column;
`

const CardHeader = styled.div`
  width: 100%;
  padding: 0.25rem 0.6rem;
  background-color: #0773ff;
  border-radius: 0.6rem 0.6rem 0 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
`

const CardContent = styled.div`
  background-color: white;
  /* padding: 8px; */
  padding: ${(props) => (props.padding ? props.padding : '0.5rem')};
  border-radius: 0px 0px 0.5rem 0.5rem;
  flex: 2;
  display: flex;
  flex-direction: column;
`

function Card({ heading, children, padding, h }) {
  return (
    <CardContainer h={h}>
      <CardHeader padding={padding}> {heading}</CardHeader>
      <CardContent padding={padding}>{children}</CardContent>
    </CardContainer>
  )
}

export default Card
