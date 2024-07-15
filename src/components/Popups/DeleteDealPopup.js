import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import { styled } from '@mui/system'

const Container = styled('div', {
  name: 'Container',
})({
  display: 'flex',
  flexDirection: 'column',
  width: '22rem',
  alignItems: 'center',
  padding: '1rem 3rem',
})

const DeleteButton = styled('img')({
  width: '1.2rem',
  margin: '0 1rem',
  transition: 'all 0.2s',
  '&:hover': {
    filter:
      'invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)',
  },
})

const DeleteIcon = styled('img')({
  width: '5rem',
  filter:
    'invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)',
})

const DeleteText = styled('div')({
  fontWeight: 600,
  marginTop: '1rem',
  marginBottom: '0.5rem',
})

const DeleteSubText = styled('div')({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'gray',
  textAlign: 'center',
})

const ActionButtonsContainer = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-around',
})

const ActionButton = styled(Button)({
  marginTop: '2rem',
  marginLeft: '0.5rem',
  textTransform: 'none',
  // border: '2px solid black',
})

export default function DeletePopup({ dealId, dealName, handleDeleteDeal }) {
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
  }

  return (
    <div>
      <DeleteButton src="/images/delete.png" onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Container>
          <DeleteIcon src="/images/delete.png" />
          <DeleteText>You are about to delete a deal</DeleteText>
          <DeleteSubText>This action cannot be reversed</DeleteSubText>
          <DeleteSubText>Are you sure?</DeleteSubText>
          <ActionButtonsContainer>
            <ActionButton onClick={handleClose} variant="contained">
              Cancel
            </ActionButton>
            <ActionButton
              onClick={(e) => {
                handleDeleteDeal(e, dealId, handleClose)
              }}
              color="error"
              variant="contained"
            >
              Delete
            </ActionButton>
          </ActionButtonsContainer>
        </Container>
      </Dialog>
    </div>
  )
}
