import React, { useEffect, useContext } from 'react'
import Card from '../Card'
import TextField from '../TextField'
import CustomToggle from '../CustomToggle'
import { Flex, InputWithDropdownContainer, TextWithIcon } from '../CommonStyles'
import { Purchase, TextWithToggleContainer } from '../../pages/Calculator/CalculatorStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import { usePopupContext } from '../../context/PopupContext'
import MonthOrYearSelector from '../MonthOrYearSelector'
import PercentOrDollarSelector from '../RateOrDollarSelector'
import { getCurrency, getRate } from '../../utils/inputFormatter'
const PurchaseComponent = () => {
  const {
    purchasePrice,
    setPurchasePriceInput,
    leaseLength,
    setLeaseLengthInput,
    noiAnnual,
    setNoiAnnualInput,
    annualRentIncreases,
    setAnnualRentIncreasesInput,
    appartmentVacancy,
    setAppartmentVacancyInput,
    appartmentUnits,
    setAppartmentUnitsInput,
    appartmentManagementFee,
    setAppartmentManagementFeeInput,
    calculatorPageErrors,
    customizedRentalInfo,
    clearAllInputErrorInCalculatorPage,
    leaseLengthUnit,
    setLeaseLengthUnitInput,
    setLoanTermUnitInput,
    setLoanAmortizationTermUnitInput,
    isAppartment,
    setIsAppartmentInput,
    appartmentManagementFeeUnit,
    setAppartmentManagementFeeUnitInput,
    isSharedDeal,
    loanTerm,
    setLoanTermInput,
  } = useContext(InvestmentInputContext)
  const { setRentalIncomeAndLeasePopupOpen } = usePopupContext()

  useEffect(() => {
    setAppartmentManagementFeeInput(
      appartmentManagementFeeUnit === 'dollar'
        ? getCurrency(appartmentManagementFee)
        : getRate(appartmentManagementFee)
    )
  }, [appartmentManagementFeeUnit])

  return (
    <Purchase>
      <Card heading="Purchase">
        <Flex>
          <TextField
            label="Price:"
            placeholder="$1,000,000"
            value={purchasePrice}
            onChange={(value) => setPurchasePriceInput(value)}
            format="dollar"
            error={calculatorPageErrors.purchasePrice}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <InputWithDropdownContainer>
            <TextField
              label="Hold Length:"
              placeholder="10"
              value={leaseLength}
              format="number"
              onChange={(value) => setLeaseLengthInput(value)}
              error={calculatorPageErrors.leaseLength}
              onFocus={clearAllInputErrorInCalculatorPage}
              onBlur={(value) => value < Number(loanTerm) && setLoanTermInput(value)}
              disabled={isSharedDeal}
            />
            <MonthOrYearSelector
              disabled={isSharedDeal}
              value={leaseLengthUnit}
              onChange={(e) => {
                setLoanAmortizationTermUnitInput(e.target.value)
                setLoanTermUnitInput(e.target.value)
                setLeaseLengthUnitInput(e.target.value)
              }}
              pluralLabels
            />
          </InputWithDropdownContainer>
        </Flex>
        <Flex pt="0.5rem">
          <TextField
            label="Annual Rent/Income:"
            placeholder="$80,000"
            value={noiAnnual}
            onChange={(value) => setNoiAnnualInput(value)}
            format="dollar"
            error={calculatorPageErrors.noiAnnual}
            disabled={customizedRentalInfo?.length > 0 || isSharedDeal}
            onFocus={clearAllInputErrorInCalculatorPage}
          />
          <TextField
            label="Annual Rent increases:"
            placeholder="2%"
            value={annualRentIncreases}
            onChange={(value) => setAnnualRentIncreasesInput(value)}
            format="rate"
            error={calculatorPageErrors.annualRentIncreases}
            disabled={customizedRentalInfo?.length > 0 || isSharedDeal}
            onFocus={clearAllInputErrorInCalculatorPage}
          />
        </Flex>
        <Flex pt="0.2rem">
          <TextWithIcon
            onClick={() => {
              setRentalIncomeAndLeasePopupOpen(true)
            }}
          >
            <div className="icon" />
            <div>Customize Rent/Income: Rent Adjustments and Individual Tenants</div>
          </TextWithIcon>
        </Flex>
        <Flex pt="0.2rem">
          <TextWithToggleContainer>
            <div className="Text">Is this an Apartment or Multi-Family?</div>
            <CustomToggle
              disabled={isSharedDeal}
              value={isAppartment}
              setValue={setIsAppartmentInput}
            />
          </TextWithToggleContainer>
          <TextField
            label="Vacancy:"
            placeholder="X"
            style={{ visibility: isAppartment ? 'visible' : 'hidden' }}
            value={appartmentVacancy}
            format="rate"
            onChange={(value) => setAppartmentVacancyInput(value)}
            error={calculatorPageErrors.appartmentVacancy}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
        </Flex>
        <Flex pt="0.5rem">
          <TextField
            label="Units:"
            placeholder="X"
            style={{ visibility: isAppartment ? 'visible' : 'hidden' }}
            value={appartmentUnits}
            format="number"
            onChange={(value) => setAppartmentUnitsInput(value)}
            error={calculatorPageErrors.appartmentUnits}
            onFocus={clearAllInputErrorInCalculatorPage}
            disabled={isSharedDeal}
          />
          <InputWithDropdownContainer style={{ visibility: isAppartment ? 'visible' : 'hidden' }}>
            <TextField
              label="Annual Management Fee:"
              placeholder="X"
              value={appartmentManagementFee}
              format={appartmentManagementFeeUnit === 'dollar' ? 'dollar' : 'rate'}
              onChange={(value) => setAppartmentManagementFeeInput(value)}
              error={calculatorPageErrors.appartmentManagementFee}
              onFocus={clearAllInputErrorInCalculatorPage}
              disabled={isSharedDeal}
            />
            <PercentOrDollarSelector
              value={appartmentManagementFeeUnit}
              onChange={(e) => {
                setAppartmentManagementFeeUnitInput(e.target.value)
              }}
              disabled={isSharedDeal}
            />
          </InputWithDropdownContainer>
        </Flex>
      </Card>
    </Purchase>
  )
}

export default PurchaseComponent
