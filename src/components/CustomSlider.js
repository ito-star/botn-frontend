import * as React from 'react'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/system'

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '19.4rem',
})
const Label = styled('span')(({ left }) => ({
  paddingRight: left ? '0.7rem' : 0,
  paddingLeft: left ? '0' : '0.5rem',
  fontSize: '0.5rem',
}))

export default function CustomSlider({ min, max, step, prefix, suffix, value, onChange }) {
  return (
    <Container>
      <Label left={true}>
        {(prefix == undefined ? '' : prefix + '') + min + '' + (suffix == undefined ? '' : suffix)}
      </Label>
      <Slider
        size="small"
        step={step}
        min={min}
        max={max}
        aria-label="Small"
        value={value}
        onChange={onChange}
        valueLabelDisplay="auto"
      />
      <Label>
        {(prefix == undefined ? '' : prefix + '') + max + '' + (suffix == undefined ? '' : suffix)}
      </Label>
    </Container>
  )
}
