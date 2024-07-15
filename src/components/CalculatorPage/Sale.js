import React, { useState, useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import CustomToggle from '../CustomToggle'
import { Flex } from '../CommonStyles'
import { Sale, TextWithToggleContainer } from '../../pages/Calculator/CalculatorStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'

const SaleComponent = () => {
  const [visibleSale, setVisibleSale] = useState(false)
  const {
    setIsSaleInput,
    salePrice,
    setSalePriceInput,
    exitCapRate,
    setExitCapRateInput,
    calculatorPageErrors,
    clearAllInputErrorInCalculatorPage,
    isSharedDeal,
  } = useContext(InvestmentInputContext)
  const handleVisibleSale = (visible) => {
    if (!visible) setIsSaleInput(visible)
    else if (salePrice || exitCapRate) setIsSaleInput(visible)
    setVisibleSale(visible)
  }

  return (
    <Sale>
      <Card heading="Sale" h={visibleSale ? '100%' : 'auto'}>
        <Flex>
          <TextWithToggleContainer className="TextWithToggleContainer">
            <div className="Text">Do you have an estimated Sale Price or Exit Cap Rate?</div>
            <CustomToggle
              disabled={isSharedDeal}
              value={visibleSale}
              setValue={handleVisibleSale}
            />
          </TextWithToggleContainer>
        </Flex>
        {visibleSale && (
          <>
            <Flex pt="0.6rem">
              <TextField
                label="Estimated Sale Price:"
                placeholder="X"
                value={salePrice}
                onChange={(value) => setSalePriceInput(value)}
                format="dollar"
                error={calculatorPageErrors.salePrice}
                onFocus={clearAllInputErrorInCalculatorPage}
                disabled={isSharedDeal}
              />
            </Flex>
            <div className="or-text">OR</div>
            <Flex pt="0.6rem">
              <TextField
                label="Exit Cap Rate:"
                placeholder="X"
                format="rate"
                value={exitCapRate}
                onChange={(value) => setExitCapRateInput(value)}
                error={calculatorPageErrors.exitCapRate}
                onFocus={clearAllInputErrorInCalculatorPage}
                disabled={isSharedDeal}
              />
            </Flex>
          </>
        )}
      </Card>
    </Sale>
  )
}

export default SaleComponent
