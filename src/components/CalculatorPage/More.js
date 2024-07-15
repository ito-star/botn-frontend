import React, { useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import { Flex } from '../CommonStyles'
import { MoreContainer } from '../../pages/Calculator/CalculatorStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
const More = () => {
  const {
    commission,
    marketRentPsf,
    buildingSF,
    landSF,
    capGainRate,
    incomeTaxRate,
    probability1031,
    setCommissionInput,
    setMarketRentPsfInput,
    setBuildingSFInput,
    setLandSFInput,
    setCapGainRateInput,
    setIncomeTaxRateInput,
    setProbability1031Input,
    calculatorPageErrors,
    clearAllInputErrorInCalculatorPage,
    isSharedDeal,
  } = useContext(InvestmentInputContext)
  return (
    <MoreContainer>
      <Card heading="More">
        <Flex>
          <TextField
            label="Commision:"
            placeholder="3%"
            format="rate"
            value={commission}
            onChange={(value) => setCommissionInput(value)}
            error={calculatorPageErrors.commission}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <TextField
            label="Market Rent:"
            placeholder="X"
            format="dollar"
            value={marketRentPsf}
            onChange={(value) => setMarketRentPsfInput(value)}
            error={calculatorPageErrors.marketRentPsf}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
            tooltip="Add"
          />
          <TextField
            label="Building SF:"
            placeholder="0"
            value={buildingSF}
            onChange={(value) => setBuildingSFInput(value)}
            format="number"
            error={calculatorPageErrors.buildingSF}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <TextField
            label="Land SF:"
            placeholder="0"
            value={landSF}
            onChange={(value) => setLandSFInput(value)}
            format="number"
            error={calculatorPageErrors.landSF}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
        </Flex>
        <Flex pt="0.5rem">
          <TextField
            label="Capital Gains Rate:"
            placeholder="16%"
            value={capGainRate}
            format="rate"
            onChange={(value) => setCapGainRateInput(value)}
            error={calculatorPageErrors.capGainRate}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <TextField
            label="Income Tax Rate:"
            placeholder="X"
            value={incomeTaxRate}
            format="rate"
            onChange={(value) => {
              setIncomeTaxRateInput(value)
            }}
            error={calculatorPageErrors.incomeTaxRate}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <TextField
            label="Probability of 1031:"
            placeholder="50%"
            value={probability1031}
            format="rate"
            onChange={(value) => {
              setProbability1031Input(value)
            }}
            error={calculatorPageErrors.probability1031}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
            tooltip="Add"
          />
        </Flex>
      </Card>
    </MoreContainer>
  )
}

export default More
