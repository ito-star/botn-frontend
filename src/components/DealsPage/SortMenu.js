import React, { useEffect } from 'react'
import TextMenu from 'components/Menus/TextMenu'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  min-width: 10rem;
`

const SortText = styled.div`
  font-size: 0.7rem;
  margin-right: 0.7rem;
`
const SortDropdown = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
`
export const SortMenu = ({ currentSortOption, setCurrentSortOption }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const sortMenuOptions = [
    {
      ListItemText: 'Newest first',
      onClick: () => {
        setCurrentSortOption('Newest first')
        handleClose()
      },
    },
    {
      ListItemText: 'Oldest first',
      onClick: () => {
        setCurrentSortOption('Oldest first')
        handleClose()
      },
    },
    {
      ListItemText: 'IRR ascending',
      onClick: () => {
        setCurrentSortOption('IRR ascending')
        handleClose()
      },
    },
    {
      ListItemText: 'IRR descending',
      onClick: () => {
        setCurrentSortOption('IRR descending')
        handleClose()
      },
    },
  ]
  return (
    <>
      <Container
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SortText>Sort by</SortText>
        <SortDropdown>{currentSortOption}</SortDropdown>
      </Container>
      <TextMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={open}
        options={sortMenuOptions}
        handleClose={handleClose}
      />
    </>
  )
}
