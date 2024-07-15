import React, { useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import { Flex, TextWithIcon } from '../CommonStyles'
import { DepreciationContainer } from '../../pages/Calculator/CalculatorStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import { PopupContext } from 'context/PopupContext'
const DepreciationAppreciation = () => {
  const {
    depreciationRate,
    setDepreciationRateInput,
    appreciationRate,
    setAppreciationRateInput,
    depreciationTerm,
    setDepreciationTermInput,
    calculatorPageErrors,
    clearAllInputErrorInCalculatorPage,
    isAppreciationDepreciationSimple,
    isSharedDeal,
  } = useContext(InvestmentInputContext)
  const { setDepreciationDefaultPopupOpen } = useContext(PopupContext)
  return (
    <DepreciationContainer>
      <Card heading="Depreciation | Annual Appreciation Rate">
        <Flex>
          <TextField
            label="Depreciation %:"
            placeholder="60%"
            value={depreciationRate}
            onChange={(value) => setDepreciationRateInput(value)}
            error={calculatorPageErrors.depreciationRate}
            onFocus={clearAllInputErrorInCalculatorPage}
            format="rate"
            disabled={!isAppreciationDepreciationSimple || isSharedDeal}
            tooltip="Add"
          />
          <TextField
            label="Depreciation Yrs:"
            placeholder="39 years"
            value={depreciationTerm}
            onChange={(value) => setDepreciationTermInput(value)}
            error={calculatorPageErrors.depreciationTerm}
            onFocus={clearAllInputErrorInCalculatorPage}
            format="number"
            disabled={!isAppreciationDepreciationSimple || isSharedDeal}
          />
          <TextField
            label="Annual Apprec. Rate:"
            placeholder="1.5%"
            value={appreciationRate}
            onChange={(value) => setAppreciationRateInput(value)}
            error={calculatorPageErrors.appreciationRate}
            onFocus={clearAllInputErrorInCalculatorPage}
            format="rate"
            disabled={!isAppreciationDepreciationSimple || isSharedDeal}
          />
        </Flex>
        <Flex>
          <div
            className="first-text"
            onClick={() => {
              setDepreciationDefaultPopupOpen(true)
            }}
          >
            <TextWithIcon>
              <div className="icon" />
              See Depreciation Table
            </TextWithIcon>
          </div>
        </Flex>
      </Card>
    </DepreciationContainer>
  )
}

export default DepreciationAppreciation
