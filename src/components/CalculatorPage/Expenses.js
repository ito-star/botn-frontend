import React, { useState, useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import { Flex, TextWithIcon } from '../CommonStyles'
import { ExpensesContainer } from '../../pages/Calculator/CalculatorStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import { PopupContext } from 'context/PopupContext'
export const ExpensesComponent = () => {
  const {
    recurringExpenseSimple,
    setRecurringExpenseSimpleInput,
    nonRecurringExpenseSimple,
    setNonRecurringExpenseSimpleInput,
    calculatorPageErrors,
    isExpensesSimple,
    clearAllInputErrorInCalculatorPage,
    isSharedDeal,
  } = useContext(InvestmentInputContext)
  const { setRecurringExpensePopupOpen } = useContext(PopupContext)
  return (
    <ExpensesContainer>
      <Card heading="Expenses">
        <Flex>
          <TextField
            label="Recurring:"
            placeholder="$5000"
            onChange={(value) => setRecurringExpenseSimpleInput(value)}
            value={recurringExpenseSimple}
            format="dollar"
            error={calculatorPageErrors.recurringExpenseSimple}
            disabled={!isExpensesSimple || isSharedDeal}
            onFocus={clearAllInputErrorInCalculatorPage}
          />
          <TextField
            label="Non-Recurring:"
            placeholder="$10000"
            onChange={(value) => setNonRecurringExpenseSimpleInput(value)}
            value={nonRecurringExpenseSimple}
            format="dollar"
            error={calculatorPageErrors.nonRecurringExpenseSimple}
            disabled={!isExpensesSimple || isSharedDeal}
            onFocus={clearAllInputErrorInCalculatorPage}
          />
        </Flex>
        <Flex>
          <div className="text">
            (Opex, Property Tax, Insurance, Maintenance, Management fee, etc)
          </div>
          <div className="text">Closing costs, Repairs, Renovation</div>
        </Flex>
        <Flex>
          <div
            className="dark-text"
            onClick={() => {
              setRecurringExpensePopupOpen(true)
            }}
          >
            <TextWithIcon>
              <div className="icon" />
              Add Custom Expenses
            </TextWithIcon>
          </div>
        </Flex>
      </Card>
    </ExpensesContainer>
  )
}
