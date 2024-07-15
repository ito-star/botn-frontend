import React, { useState, useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import { Flex, InputWithDropdownContainer } from '../CommonStyles'
import { DebtContainer, TextWithToggleContainer } from '../../pages/Calculator/CalculatorStyles'
import CustomToggle from '../CustomToggle'
import MonthOrYearSelector from '../MonthOrYearSelector'
import { getCurrency, unformatCurrency } from '../../utils/inputFormatter.js'

import { InvestmentInputContext } from '../../context/InvestmentInputContext'
const Debt = () => {
  const {
    setIsLoanInput,
    loanAmount,
    setLoanAmountInput,
    loanRate,
    setLoanRateInput,
    loanTerm,
    setLoanTermInput,
    loanAmortizationTerm,
    setLoanAmortizationTermInput,
    calculatorPageErrors,
    clearAllInputErrorInCalculatorPage,
    loanTermUnit,
    setLoanTermUnitInput,
    loanAmortizationTermUnit,
    setLoanAmortizationTermUnitInput,
    isSharedDeal,
    leaseLength,
    setLeaseLengthUnitInput,
    purchasePrice,
    visibleDebt,
    setVisibleDebt,
  } = useContext(InvestmentInputContext)

  const handleToggleChange = (value) => {
    setVisibleDebt(value)
    if (!value) setIsLoanInput(false)
    setLoanAmountInput(
      value ? getCurrency((unformatCurrency(purchasePrice) * 0.6).toString()) : undefined
    )
    setLoanRateInput(value ? '4%' : undefined)
    setLoanTermInput(value ? 10 : undefined)
    setLoanAmortizationTermInput(value ? 30 : undefined)
  }

  return (
    <DebtContainer>
      <Card heading="Debt" h={visibleDebt ? '80%' : 'auto'}>
        <Flex>
          <TextWithToggleContainer>
            <div className="Text">Loan?</div>
            <CustomToggle
              value={visibleDebt}
              setValue={handleToggleChange}
              disabled={isSharedDeal}
            />
          </TextWithToggleContainer>
        </Flex>
        {visibleDebt && (
          <>
            <Flex pt="0.6rem">
              <TextField
                label="Loan Amount:"
                placeholder="X"
                value={loanAmount}
                onChange={(value) => setLoanAmountInput(value)}
                format="dollar"
                error={calculatorPageErrors.loanAmount}
                onFocus={clearAllInputErrorInCalculatorPage}
                disabled={isSharedDeal}
              />
            </Flex>

            <Flex pt="0.6rem">
              <TextField
                label="APR:"
                placeholder="X"
                value={loanRate}
                format="rate"
                onChange={(value) => setLoanRateInput(value)}
                error={calculatorPageErrors.loanRate}
                onFocus={clearAllInputErrorInCalculatorPage}
                disabled={isSharedDeal}
              />
            </Flex>
            <Flex pt="0.6rem">
              <InputWithDropdownContainer>
                <TextField
                  label="Loan Term:"
                  format="number"
                  placeholder="X"
                  value={loanTerm}
                  onChange={(value) => {
                    setLoanTermInput(value)
                    value > Number(loanAmortizationTerm) && setLoanAmortizationTermInput(loanTerm)
                  }}
                  error={calculatorPageErrors.loanTerm}
                  onFocus={clearAllInputErrorInCalculatorPage}
                  onBlur={(value) => {
                    value > Number(leaseLength) && setLoanTermInput(leaseLength)
                    value > Number(loanAmortizationTerm) && setLoanAmortizationTermInput(loanTerm)
                  }}
                  disabled={isSharedDeal}
                />
                <MonthOrYearSelector
                  value={loanTermUnit}
                  onChange={(e) => {
                    setLoanAmortizationTermUnitInput(e.target.value)
                    setLoanTermUnitInput(e.target.value)
                    setLeaseLengthUnitInput(e.target.value)
                  }}
                  pluralLabels
                />
              </InputWithDropdownContainer>
            </Flex>
            <Flex pt="0.6rem">
              <InputWithDropdownContainer>
                <TextField
                  label="Amortization Term:"
                  format="number"
                  value={loanAmortizationTerm}
                  onChange={(value) => setLoanAmortizationTermInput(value)}
                  error={calculatorPageErrors.loanAmortizationTerm}
                  onFocus={clearAllInputErrorInCalculatorPage}
                  onBlur={(value) => {
                    value < Number(loanTerm) && setLoanAmortizationTermInput(loanTerm)
                  }}
                  disabled={isSharedDeal}
                />
                <MonthOrYearSelector
                  value={loanAmortizationTermUnit}
                  onChange={(e) => {
                    setLoanAmortizationTermUnitInput(e.target.value)
                    setLoanTermUnitInput(e.target.value)
                    setLeaseLengthUnitInput(e.target.value)
                  }}
                  pluralLabels
                />
              </InputWithDropdownContainer>
            </Flex>
          </>
        )}
      </Card>
    </DebtContainer>
  )
}

export default Debt
