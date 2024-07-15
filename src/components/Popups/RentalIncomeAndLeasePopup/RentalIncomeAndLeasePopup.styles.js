import styled from 'styled-components'

export const BottomContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  /* box-shadow: 0px 1px 3px rgb(110,110,110); */
  bottom: 0;
  width: 90%;
`

export const TabContainer = styled.div`
  display: flex;
  background-color: #dbe9ff;
`
export const Tab = styled.div`
  flex: 1;
  padding: 0.5rem 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  flex-wrap: wrap;

  &.active {
    background-color: var(--theme-color);
    color: white;
    border-radius: inherit;
  }

  &:hover {
    cursor: pointer;
  }
`

export const ListContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-height: 15rem;
  overflow-y: auto;
  gap: 0.5rem;
  align-items: flex-start;
`

export const Content = styled.div`
  position: relative;
  padding: 1rem;
  display: flex;
  grid-gap: 1rem;
  background: var(--background-color);
  box-shadow: 0px 1px 3px rgb(210, 210, 210);
  border-radius: 0.5rem;
  flex-direction: column;
  overflow: hidden;
`

export const MainTabView = styled.div`
  border-radius: 0.5rem;
  background: white;
  overflow: hidden;
  padding: 1rem;
`

export const NavigateOrDeleteContainer = styled.div`
  flex: 0 1 auto;
  display: flex;
  align-items: center;

  .delete-button {
    &:hover {
      color: #0773ff;
    }
  }
`

export const Divider = styled.hr`
  width: 100%;
  margin: 1rem 0;
  border-top: 1px solid lightgray;
`

export const Select = styled.select`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  backgroundcolor: transparent;
  fontsize: 0.7rem;
  border: none;
  boxshadow: 0px 0px 2px gray;
  color: #494949;
  borderradius: 0.2rem;
`

export const YearsOrMonthsSelector = ({ value, onChange, disabled }) => {
  const style = {
    position: 'absolute',
    right: '0.5rem',
    bottom: '0.5rem',
    backgroundColor: 'transparent',
    fontSize: '0.7rem',
    border: 'none',
    boxShadow: '0px 0px 2px gray',
    color: '#494949',
    borderRadius: '0.2rem',
  }

  return (
    <select style={style} value={value} onChange={onChange} disabled={disabled}>
      <option value="years">Per Year</option>
      <option value="months">Per month</option>
    </select>
  )
}
