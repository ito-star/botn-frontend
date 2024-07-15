import React, { useState } from 'react'
import PopupBackground from './PopupBackground'
import Card from '../Card'
import TextField from '../TextField'
import { Button } from '../CommonStyles'
import styled from 'styled-components'

const BottomContainer = styled.div`
  padding: 0.8rem 0;
  display: flex;
  justify-content: space-between;
`
const CustomRecurringExpensePopup = ({
  setClose,
  setCustomisedRecurringExpenses,
  title,
  label,
}) => {
  const [expenseText, setExpenseText] = useState('')
  const [expenseTextError, setExpenseTextError] = useState(false)
  const handleSave = () => {
    if (validateInputFields()) {
      setCustomisedRecurringExpenses((prevData) => {
        return [...prevData, { label: expenseText }]
      })
      setClose()
    }
  }

  const validateInputFields = () => {
    const error = expenseText == null || expenseText.length == 0
    setExpenseTextError(error)
    return !error
  }

  const clearInputError = () => {
    setExpenseTextError(false)
  }
  return (
    <PopupBackground width="25rem">
      <Card heading={title}>
        <TextField
          label={label}
          placeholder="X"
          value={expenseText}
          onChange={(value) => setExpenseText(value)}
          onFocus={clearInputError}
          error={expenseTextError}
        />
        <BottomContainer>
          <Button onClick={setClose}>Cancel</Button>
          <Button color="white" backgroundColor="#4fd165" onClick={handleSave}>
            Save
          </Button>
        </BottomContainer>
      </Card>
    </PopupBackground>
  )
}

export default CustomRecurringExpensePopup
