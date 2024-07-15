import styled from 'styled-components'
import { font_md } from '../constants/font-sizes'

export const Input = styled.input`
  width: min(280px, 90%);
  padding: 0.5em 2em;
  border-radius: 0.5em;
  border: 2px solid #adadad;
  /* border:none; */
  margin: 1em 0 0 0;
  /* box-shadow:0 0 2px grey; */
  font-size: ${font_md};
  transition: 0.3s;
  &:focus {
    outline: none;
    background-color: #fff9f9;
  }
`
