import React, { useState, useContext, useEffect } from 'react'
import PopupBackground from './PopupBackground'
import styled from 'styled-components'
import Card from '../Card'
import TextField from '../TextField'
import { Flex, TextWithIcon, Button, InputWithDropdownContainer } from '../CommonStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import CustomRecurringExpensePopup from './CustomRecurringExpensePopup'
import {
  isCurrencyValid,
  isRateValid,
  validateErrorObjectForInput,
  isInputValid,
  getRate,
  getCurrency,
} from '../../utils/inputFormatter'

const Select = styled.select`
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

const TopContainer = styled.div`
  padding: 1rem;
  display: flex;
  grid-gap: 1rem;
  background: var(--background-color);
  box-shadow: 0px 1px 3px rgb(210, 210, 210);
  border-radius: 0.5rem 0.5rem 0 0;
`
const RecurringExpenseContainer = styled.div`
  flex: 3;
`

const TopRightContainer = styled.div`
  flex: 5;
`

const BottomContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`

const PercentOrDollarSelector = ({ value, onChange, disabled }) => {
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
    cursor: disabled ? 'not-allowed' : '',
  }

  return (
    <select style={style} value={value} onChange={onChange} disabled={disabled}>
      <option value="rate">Percent</option>
      <option value="dollar">Dollar</option>
    </select>
  )
}

const getRepairRenovationValues = [
  {
    name: 'Roof',
    cost: '$0',
    when: '1',
    frequency: 'year',
  },
  {
    name: 'Unit Turnover',
    cost: '$0',
    when: '5',
    frequency: 'year',
  },
]

function RecurringAndNonrecurringExpensePopup({ onClose }) {
  const {
    setRecurringExpensesDataInput,
    setNonRecurringExpensesDataInput,
    setRepairsAndRenovationsDataInput,
    recurringExpensesData = {},
    nonRecurringExpensesData = {},
    repairsAndRenovationsData = getRepairRenovationValues,
    setRecurringExpenseSimpleInput,
    setNonRecurringExpenseSimpleInput,
    setIsExpensesSimpleInput,
    setAppartmentManagementFeeInput,
    isSharedDeal,
    appartmentManagementFee,
    appartmentManagementFeeUnit
  } = useContext(InvestmentInputContext)

  const clearInputErrorObject = {
    propertyTax: false,
    insurance: false,
    maintenance: false,
    managementFee: false,
    otherClosingCosts: false,
    legalFees: false,
  }

  const [propertyTax, setPropertyTax] = useState(recurringExpensesData.propertyTax)
  const [propertyTaxUnit, setPropertyTaxUnit] = useState(
    recurringExpensesData.propertyTaxUnit == null ? 'rate' : recurringExpensesData.propertyTaxUnit
  )
  const [insurance, setInsurance] = useState(recurringExpensesData.insurance)
  const [maintenance, setMaintenance] = useState(recurringExpensesData.maintenance)
  const [managementFee, setManagementFee] = useState(recurringExpensesData.managementFee)
  const [customisedRecurringExpenses, setCustomisedRecurringExpenses] = useState(
    recurringExpensesData.customisedRecurringExpenses == null
      ? []
      : recurringExpensesData.customisedRecurringExpenses
  )
  const [customizedNonRecurringExpenses, setCustomizedNonRecurringExpenses] = useState(
    recurringExpensesData.customizedNonRecurringExpenses == null
      ? []
      : recurringExpensesData.customizedNonRecurringExpenses
  )
  const [otherClosingCosts, setOtherClosingCosts] = useState(
    nonRecurringExpensesData.otherClosingCosts
  )
  const [legalFees, setLegalFees] = useState(nonRecurringExpensesData.legalFees)
  const [customRecurringExpensePopupOpen, setCustomRecurringExpensePopupOpen] = useState(false)
  const [customNonRecurringExpensePopupOpen, setCustomNonRecurringExpensePopupOpen] =
    useState(false)
  const [inputError, setInputError] = useState(clearInputErrorObject)
  const [repairValues, setRepairValues] = useState(repairsAndRenovationsData == null ? [] : repairsAndRenovationsData)

  useEffect(() => {
    let formattedValue
    if (propertyTaxUnit === 'rate') {
      formattedValue = getRate(propertyTax)
    } else {
      formattedValue = getCurrency(propertyTax)
    }
    setPropertyTax(formattedValue)
  }, [propertyTaxUnit])

  const handleSave = () => {
    if (isAllFieldsEmpty()) {
      console.log('all fields empty')
      setRecurringAndNonrecurringExpensesDataGlobal()
      setRepairsAndRenovationsDataGlobal()
      setIsExpensesSimpleInput(true)
    } else {
      console.log('all fields not empty')
      setIsExpensesSimpleInput(false)
      setRecurringExpenseSimpleInput('')
      setNonRecurringExpenseSimpleInput('')
      setRecurringAndNonrecurringExpensesDataGlobal()
      setRepairsAndRenovationsDataGlobal()
    }
    onClose()
  }

  const setRecurringAndNonrecurringExpensesDataGlobal = () => {
    const recurringExpensesData = {
      propertyTax,
      propertyTaxUnit,
      insurance,
      maintenance,
      managementFee,
      customisedRecurringExpenses,
    }
    const nonRecurringExpensesData = {
      otherClosingCosts,
      legalFees,
      customizedNonRecurringExpenses,
    }
    setRecurringExpensesDataInput(recurringExpensesData)
    setNonRecurringExpensesDataInput(nonRecurringExpensesData)
  }

  const setRepairsAndRenovationsDataGlobal = () => {
    console.log('repairs saved')
    setRepairsAndRenovationsDataInput(repairValues)
  }


  const isAllFieldsEmpty = () => {
    for (let i = 0; i < customisedRecurringExpenses.length; i++) {
      if (isInputValid(customisedRecurringExpenses[i].value)) {
        return false
      }
    }
    return (
      !isInputValid(propertyTax) &&
      !isInputValid(insurance) &&
      !isInputValid(maintenance) &&
      !isInputValid(managementFee) &&
      !isInputValid(otherClosingCosts) &&
      !isInputValid(legalFees)
    )
  }

  const validateInput = () => {
    const validatedObject = {
      propertyTax:
        propertyTaxUnit == 'rate' ? isRateValid(propertyTax) : isCurrencyValid(propertyTax),
      insurance: isCurrencyValid(insurance),
      maintenance: isCurrencyValid(maintenance),
      managementFee: isCurrencyValid(managementFee),
      otherClosingCosts: isCurrencyValid(otherClosingCosts),
      legalFees: isCurrencyValid(legalFees),
    }
    setInputError(validatedObject)
    return validateErrorObjectForInput(validatedObject)
  }

  const setCustomisedRecurringExpenseValue = (value, index) => {
    setCustomisedRecurringExpenses((prevValue) => {
      prevValue[index].value = value
      return [...prevValue]
    })
  }

  const setCustomizedNonRecurringExpenseValue = (value, index) => {
    setCustomizedNonRecurringExpenses((prevValue) => {
      prevValue[index].value = value
      return [...prevValue]
    })
  }

  const handleAddRepairRenovation = () => {
    const newAddRepairRenovation = [...repairValues]
    newAddRepairRenovation.push({
      name: '',
      cost: '',
      when: '',
      frequency: 'year',
    })
    setRepairValues(newAddRepairRenovation)
  }

  const handleChangeRepairRenovation = (key, value, index) => {
    const newRepairData = [...repairValues]
    newRepairData[index][key] = value
    setRepairValues([...newRepairData])
  }

  const clearAllInputError = () => {
    console.log('clearInputErrorObject', clearInputErrorObject)
    setInputError(clearInputErrorObject)
  }

  return (
    <PopupBackground>
      <TopContainer>
        <RecurringExpenseContainer>
          <Card heading="Recurring Expenses">
            <Flex>
              <InputWithDropdownContainer>
                <TextField
                  label="Property Tax:"
                  placeholder="X"
                  value={propertyTax}
                  onChange={(value) => setPropertyTax(value)}
                  error={inputError.propertyTax}
                  onFocus={clearAllInputError}
                  format={propertyTaxUnit === 'rate' ? 'rate' : 'dollar'}
                  disabled={isSharedDeal}
                />
                <PercentOrDollarSelector
                  value={propertyTaxUnit}
                  onChange={(e) => {
                    setPropertyTaxUnit(e.target.value)
                  }}
                  disabled={isSharedDeal}
                />
              </InputWithDropdownContainer>
            </Flex>
            <Flex pt="0.5rem">
              <TextField
                label="Insurance:"
                placeholder="X"
                value={insurance}
                format="dollar"
                onChange={(value) => setInsurance(value)}
                error={inputError.insurance}
                onFocus={clearAllInputError}
                disabled={isSharedDeal}
              />
            </Flex>
            <Flex pt="0.5rem">
              <TextField
                label="Maintenance:"
                placeholder="X"
                value={maintenance}
                onChange={(value) => setMaintenance(value)}
                format="dollar"
                error={inputError.maintenance}
                onFocus={clearAllInputError}
                disabled={isSharedDeal}
              />
            </Flex>
            <Flex pt="0.5rem">
              <InputWithDropdownContainer>
                <TextField
                  label="Annual Management Fee:"
                  placeholder="X"
                  value={appartmentManagementFee}
                  onChange={value => {
                    setManagementFee(value);
                    setAppartmentManagementFeeInput(value);
                  }}
                  format={appartmentManagementFeeUnit === 'rate' ? 'rate' : 'dollar'}
                  error={inputError.managementFee}
                  onFocus={clearAllInputError}
                  disabled={appartmentManagementFeeUnit === 'rate' || isSharedDeal}
                />
                <PercentOrDollarSelector
                  value={appartmentManagementFeeUnit}
                  onChange={(e) => {
                    setPropertyTaxUnit(e.target.value)
                  }}
                  disabled={isSharedDeal}
                />
              </InputWithDropdownContainer>
            </Flex>
            {customisedRecurringExpenses &&
              customisedRecurringExpenses.map((expenseItem, index) => (
                <Flex pt="0.5rem" key={index}>
                  <TextField
                    label={expenseItem.label}
                    placeholder="X"
                    value={expenseItem.value}
                    format="dollar"
                    onChange={(value) => setCustomisedRecurringExpenseValue(value, index)}
                    disabled={isSharedDeal}
                  />
                </Flex>
              ))}
            {!isSharedDeal && <TextWithIcon onClick={() => setCustomRecurringExpensePopupOpen(true)}>
              <div className="icon" />
              <div>Add recurring expenses</div>
            </TextWithIcon>}
          </Card>
        </RecurringExpenseContainer>
        <TopRightContainer>
          <Card heading="Non Recurring Expenses">
            <Flex>
              <TextField
                label="Other Closing Costs:"
                placeholder="X"
                value={otherClosingCosts}
                onChange={(value) => setOtherClosingCosts(value)}
                error={inputError.otherClosingCosts}
                onFocus={clearAllInputError}
                format="dollar"
                disabled={isSharedDeal}
              />
            </Flex>
            <Flex pt="0.5rem">
              <TextField
                label="Legal Fees:"
                placeholder="X"
                value={legalFees}
                onChange={(value) => setLegalFees(value)}
                error={inputError.legalFees}
                onFocus={clearAllInputError}
                format="dollar"
                disabled={isSharedDeal}
              />
            </Flex>
            {customizedNonRecurringExpenses && customizedNonRecurringExpenses.map((expenseItem, index) => (
              <Flex pt="0.5rem" key={index}>
                <TextField
                  label={expenseItem.label}
                  placeholder="X"
                  value={expenseItem.value}
                  format="dollar"
                  onChange={value => setCustomizedNonRecurringExpenseValue(value, index)}
                  disabled={isSharedDeal}
                />
              </Flex>
            ))}
            <TextWithIcon onClick={() => setCustomNonRecurringExpensePopupOpen(true)}>
              <div className="icon" />
              <div>Add Non-Recurring Expenses</div>
            </TextWithIcon>
          </Card>
          <Flex pt="1rem"></Flex>
          <Card heading="Repairs/Renovations">
            {repairValues &&
              repairValues.map((repair, index) => (
                <Flex key={index} style={{ marginBottom: 8 }}>
                  <TextField
                    label="Name of Repair:"
                    value={repair.name}
                    placeholder="X"
                    onChange={(value) => {
                      handleChangeRepairRenovation('name', value, index)
                    }}
                  />
                  <TextField
                    label="$ Cost:"
                    value={repair.cost}
                    placeholder="X"
                    format="dollar"
                    onChange={(value) => {
                      handleChangeRepairRenovation('cost', value, index)
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <TextField
                      label="When:"
                      value={repair.when}
                      placeholder="X"
                      onChange={(value) => {
                        handleChangeRepairRenovation('when', value, index)
                      }}
                    />
                    <Select
                      value={repair.frequency === '' ? 'year' : repair.frequency}
                      onChange={(e) => {
                        handleChangeRepairRenovation('frequency', e.target.value, index)
                      }}
                    >
                      <option value="year">Year</option>
                      <option value="month">Month</option>
                    </Select>
                  </div>
                </Flex>
              ))}
            <TextWithIcon onClick={handleAddRepairRenovation}>
              <div className="icon" />
              <div>Add Repair/Renovation</div>
            </TextWithIcon>
          </Card>
        </TopRightContainer>
      </TopContainer>
      <BottomContainer>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="white" backgroundColor="#4fd165" onClick={handleSave}>
          Save
        </Button>
      </BottomContainer>

      {customRecurringExpensePopupOpen && (
        <CustomRecurringExpensePopup
          title="Add Recurring Expense"
          label="Custom Expense Name"
          setClose={() => {
            setCustomRecurringExpensePopupOpen(false)
          }}
          setCustomisedRecurringExpenses={setCustomisedRecurringExpenses}
        />
      )}
      {customNonRecurringExpensePopupOpen && (
        <CustomRecurringExpensePopup
          title="Add Non-Recurring Expense"
          label="Custom Expense Name"
          setClose={() => {
            setCustomNonRecurringExpensePopupOpen(false)
          }}
          setCustomisedRecurringExpenses={setCustomizedNonRecurringExpenses}
        />
      )}
    </PopupBackground>
  )
}

export default RecurringAndNonrecurringExpensePopup
