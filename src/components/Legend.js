import { styled } from '@mui/system'
import React from 'react'

const Label = styled('span')(({ color }) => ({
  fontSize: '0.6rem',
  color: color,
  fontWeight: 600,
}))
const LabelColor = styled('div')(({ color }) => ({
  width: '0.7rem',
  height: '0.7rem',
  backgroundColor: color,
  marginRight: '0.5rem',
  borderRadius: '0.2rem',
}))

function Legend({ label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
      <LabelColor color={color}></LabelColor>
      <Label color={color}>{label}</Label>
    </div>
  )
}

export default Legend
