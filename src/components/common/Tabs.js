import { styled } from '@mui/system'
import TabsUnstyled from '@mui/base/TabsUnstyled'
import TabsListUnstyled from '@mui/base/TabsListUnstyled'
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled'
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled'
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled'

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
}

export const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-weight: bold;
  background-color: #dbe9ff;
  padding: 0.25rem 0.8rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  justify-content: center;
  color: #000;
  transition: all 0.3s ease-in;
  white-space: nowrap;

  &:hover {
    background-color: ${blue[400]};
    color: ${blue[50]};
  }

  &:focus {
    color: #fff;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[600]};
    color: ${blue[50]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`

export const TabsList = styled(TabsListUnstyled)`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  overflow: auto;
`
