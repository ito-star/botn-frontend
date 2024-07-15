import styled from 'styled-components'
import { font_md } from '../constants/font-sizes'

export const Button = styled.button`
  width: min(280px, 90%);
  background-color: #4faaf7;
  padding: 0.7em 2em;
  border-radius: 0.5em;
  border: none;
  margin: 1em 0 0 0;
  transition: 0.3s;
  font-size: ${font_md};
  &:hover {
    transform: translateY(-2px);
    background-color: #bebebe;
  }
`
