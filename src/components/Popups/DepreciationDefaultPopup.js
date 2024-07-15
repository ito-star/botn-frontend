import React, { useState, useEffect, useContext } from 'react'
import PopupBackground from './PopupBackground'
import styled from 'styled-components'
import { Flex, Button } from '../CommonStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import {
  getCurrency,
  getNumber,
  getRate,
  isCurrencyValid,
  isInputValid,
  isNumberValid,
  isRateValid,
  validateErrorObjectForInput,
} from '../../utils/inputFormatter'
import { formatter } from '../TextField'

const BottomContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 1px 3px rgb(110, 110, 110);
`

const TabContainer = styled.div`
  display: flex;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: #dbe9ff;
`
const Tab = styled.div`
  flex: 1;
  padding: 0.5rem 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  flex-wrap: wrap;

  &.active {
    background-color: var(--theme-color);
    color: white;
    border-radius: inherit;
  }

  &:hover {
    cursor: pointer;
  }
`
const SideLabel = styled.div`
  flex: 1.2;
  font-size: 0.75rem;
`

const TopLabel = styled.div`
  flex: 1;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`

const Content = styled.div`
  padding: 1rem;
  height: 17.25rem;
`

const Input = styled.input`
  width: 100%;
  border: 1px solid ${(props) => (props.error ? 'red' : '#e2e2e1')};
  border-radius: 0.6rem;
  background-color: ${(props) => (props.error ? '#ff000012' : '#f5f6fb')};
  position: relative;
  flex: 0.9;
  min-width: 0;
  min-height: 2.3rem;
  padding: 0.4rem;

  &:focus {
    outline: none;
  }
`

const Dummy = styled.div`
  flex: 1;
  width: 100%;
`

function DepreciationDefaultPopup({ onClose }) {
  const clearInputErrorObject = {
    improvementsFastAmount: false,
    improvementsMedAmount: false,
    improvementsSlowAmount: false,
    improvementsFastMonths: false,
    improvementsMedMonths: false,
    improvementsSlowMonths: false,
    improvementsFastRate: false,
    improvementsMedRate: false,
    improvementsSlowRate: false,
    improvementsUndepriceAmount: false,
    improvementsUndepriceRate: false,
    landValueRate: false,
  }
  const {
    setAppreciationAndDepreciationDataInput,
    appreciationAndDepreciationData = {},
    setIsAppreciationDepreciationSimpleInput,
    isSharedDeal,
  } = useContext(InvestmentInputContext)

  const [improvementsFastAmount, setImprovementsFastAmount] = useState(
    appreciationAndDepreciationData.improvementsFastAmount
  )
  const [improvementsMedAmount, setImprovementsMedAmount] = useState(
    appreciationAndDepreciationData.improvementsMedAmount
  )
  const [improvementsSlowAmount, setImprovementsSlowAmount] = useState(
    appreciationAndDepreciationData.improvementsSlowAmount
  )
  const [improvementsFastMonths, setImprovementsFastMonths] = useState(
    appreciationAndDepreciationData.improvementsFastMonths
  )
  const [improvementsMedMonths, setImprovementsMedMonths] = useState(
    appreciationAndDepreciationData.improvementsMedMonths
  )
  const [improvementsSlowMonths, setImprovementsSlowMonths] = useState(
    appreciationAndDepreciationData.improvementsSlowMonths
  )
  const [improvementsFastRate, setImprovementsFastRate] = useState(
    appreciationAndDepreciationData.improvementsFastRate
  )
  const [improvementsMedRate, setImprovementsMedRate] = useState(
    appreciationAndDepreciationData.improvementsMedRate
  )
  const [improvementsSlowRate, setImprovementsSlowRate] = useState(
    appreciationAndDepreciationData.improvementsSlowRate
  )
  const [improvementsUndepriceAmount, setImprovementsUndepriceAmount] = useState(
    appreciationAndDepreciationData.improvementsUndepriceAmount
  )
  const [improvementsUndepriceRate, setImprovementsUndepriceRate] = useState(
    appreciationAndDepreciationData.improvementsUndepriceRate
  )
  const [landValueRate, setLandValueRate] = useState(appreciationAndDepreciationData.landValueRate)
  const [inputError, setInputError] = useState(clearInputErrorObject)

  const handleSave = () => {
    if (validateInput()) {
      setAppreciationAndDepreciationDataInput((prevData) => {
        return {
          ...prevData,
          improvementsFastAmount,
          improvementsMedAmount,
          improvementsSlowAmount,
          improvementsFastMonths,
          improvementsMedMonths,
          improvementsSlowMonths,
          improvementsFastRate,
          improvementsMedRate,
          improvementsSlowRate,
          improvementsUndepriceAmount,
          improvementsUndepriceRate,
          landValueRate,
        }
      })

      onClose()
    }
  }

  const isAllFieldsEmpty = () => {
    return (
      !isInputValid(improvementsFastAmount) &&
      !isInputValid(improvementsMedAmount) &&
      !isInputValid(improvementsSlowAmount) &&
      !isInputValid(improvementsFastMonths) &&
      !isInputValid(improvementsMedMonths) &&
      !isInputValid(improvementsSlowMonths) &&
      !isInputValid(improvementsFastRate) &&
      !isInputValid(improvementsMedRate) &&
      !isInputValid(improvementsSlowRate) &&
      !isInputValid(improvementsUndepriceAmount) &&
      !isInputValid(improvementsUndepriceRate) &&
      !isInputValid(landValueRate)
    )
  }

  const validateInput = () => {
    if (isAllFieldsEmpty()) {
      console.log('all fields are empty')
      setIsAppreciationDepreciationSimpleInput(true)
      return true
    } else {
      setIsAppreciationDepreciationSimpleInput(false)
    }

    const validatedObject = {}

    if (
      isInputValid(improvementsFastAmount) ||
      isInputValid(improvementsFastMonths) ||
      isInputValid(improvementsFastRate)
    ) {
      validatedObject.improvementsFastAmount = !isCurrencyValid(improvementsFastAmount)
      validatedObject.improvementsFastMonths = !isNumberValid(improvementsFastMonths)
      validatedObject.improvementsFastRate = !isRateValid(improvementsFastRate)
    }

    if (
      isInputValid(improvementsMedAmount) ||
      isInputValid(improvementsMedMonths) ||
      isInputValid(improvementsMedRate)
    ) {
      validatedObject.improvementsMedAmount = !isCurrencyValid(improvementsMedAmount)
      validatedObject.improvementsMedMonths = !isNumberValid(improvementsMedMonths)
      validatedObject.improvementsMedRate = !isRateValid(improvementsMedRate)
    }

    if (
      isInputValid(improvementsSlowAmount) ||
      isInputValid(improvementsSlowMonths) ||
      isInputValid(improvementsSlowRate)
    ) {
      validatedObject.improvementsSlowAmount = !isCurrencyValid(improvementsSlowAmount)
      validatedObject.improvementsSlowMonths = !isNumberValid(improvementsSlowMonths)
      validatedObject.improvementsSlowRate = !isRateValid(improvementsSlowRate)
    }

    if (isInputValid(improvementsUndepriceAmount) || isInputValid(improvementsUndepriceRate)) {
      validatedObject.improvementsUndepriceAmount = !isCurrencyValid(improvementsUndepriceAmount)
      validatedObject.improvementsUndepriceRate = !isRateValid(improvementsUndepriceRate)
    }

    if (isInputValid(landValueRate)) {
      validatedObject.landValueRate = !isRateValid(landValueRate)
    }
    // const validatedObject = {
    //   improvementsFastAmount: isCurrencyValid(improvementsFastAmount),
    //   improvementsMedAmount: isCurrencyValid(improvementsMedAmount),
    //   improvementsSlowAmount: isCurrencyValid(improvementsSlowAmount),
    //   improvementsFastMonths: isNumberValid(improvementsFastMonths),
    //   improvementsMedMonths: isNumberValid(improvementsMedMonths),
    //   improvementsSlowMonths: isNumberValid(improvementsSlowMonths),
    //   improvementsFastRate: isRateValid(improvementsFastRate),
    //   improvementsMedRate: isRateValid(improvementsMedRate),
    //   improvementsSlowRate: isRateValid(improvementsSlowRate),
    //   improvementsUndepriceAmount: isCurrencyValid(improvementsUndepriceAmount),
    //   improvementsUndepriceRate: isRateValid(improvementsUndepriceRate),
    //   landValueRate: isRateValid(landValueRate)
    // }
    setInputError(validatedObject)
    return validateErrorObjectForInput(validatedObject)
  }

  const clearAllInputError = () => {
    setInputError(clearInputErrorObject)
  }

  return (
    <PopupBackground>
      <TabContainer>
        <Tab className="active">Custom Depreciation | Annual Appreciation</Tab>
        {/* <Tab className={tabIndex === 1 && "active"} onClick={() => { setTabIndex(1) }}>Detailed View</Tab> */}
      </TabContainer>

      <Content>
        <>
          <Flex>
            <SideLabel></SideLabel>
          </Flex>
          <Flex>
            <SideLabel></SideLabel>
            <TopLabel>$ Amount to Depreciate</TopLabel>
            <TopLabel># of Months To Depreciate</TopLabel>
            <TopLabel>Annual Appreciation</TopLabel>
          </Flex>
          <Flex pt="0.5rem">
            <SideLabel>Improvements Fast:</SideLabel>
            <Input
              value={improvementsFastAmount}
              onChange={(e) => {
                setImprovementsFastAmount(formatter(e, 'dollar'))
              }}
              format="dollar"
              error={inputError.improvementsFastAmount}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsFastMonths}
              onChange={(e) => {
                setImprovementsFastMonths(formatter(e, 'number'))
              }}
              error={inputError.improvementsFastMonths}
              onFocus={clearAllInputError}
              format="number"
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsFastRate}
              onChange={(e) => {
                setImprovementsFastRate(formatter(e, 'rate'))
              }}
              error={inputError.improvementsFastRate}
              onFocus={clearAllInputError}
              format="rate"
              disabled={isSharedDeal}
            />
          </Flex>
          <Flex pt="0.5rem">
            <SideLabel>Improvements Medium:</SideLabel>
            <Input
              value={improvementsMedAmount}
              onChange={(e) => {
                setImprovementsMedAmount(formatter(e, 'dollar'))
              }}
              format="dollar"
              error={inputError.improvementsMedAmount}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsMedMonths}
              format="number"
              onChange={(e) => {
                setImprovementsMedMonths(formatter(e, 'number'))
              }}
              error={inputError.improvementsMedMonths}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsMedRate}
              format="rate"
              onChange={(e) => {
                setImprovementsMedRate(formatter(e, 'rate'))
              }}
              error={inputError.improvementsMedRate}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
          </Flex>
          <Flex pt="0.5rem">
            <SideLabel>Improvements Slow:</SideLabel>
            <Input
              value={improvementsSlowAmount}
              onChange={(e) => {
                setImprovementsSlowAmount(formatter(e, 'dollar'))
              }}
              format="dollar"
              error={inputError.improvementsSlowAmount}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsSlowMonths}
              format="number"
              onChange={(e) => {
                setImprovementsSlowMonths(formatter(e, 'number'))
              }}
              error={inputError.improvementsSlowMonths}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Input
              value={improvementsSlowRate}
              format="rate"
              onChange={(e) => {
                setImprovementsSlowRate(formatter(e, 'rate'))
              }}
              error={inputError.improvementsSlowRate}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
          </Flex>
          <Flex pt="0.5rem">
            <SideLabel>Undepriciable Improvement</SideLabel>
            <Input
              value={improvementsUndepriceAmount}
              onChange={(e) => {
                setImprovementsUndepriceAmount(formatter(e, 'dollar'))
              }}
              format="dollar"
              error={inputError.improvementsUndepriceAmount}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
            <Dummy></Dummy>
            <Input
              value={improvementsUndepriceRate}
              format="rate"
              onChange={(e) => {
                setImprovementsUndepriceRate(formatter(e, 'rate'))
              }}
              error={inputError.improvementsUndepriceRate}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
          </Flex>
          <Flex pt="0.5rem">
            <SideLabel>Land Value</SideLabel>
            <Dummy></Dummy>
            <Dummy></Dummy>
            <Input
              value={landValueRate}
              format="rate"
              onChange={(e) => {
                setLandValueRate(formatter(e, 'rate'))
              }}
              error={inputError.landValueRate}
              onFocus={clearAllInputError}
              disabled={isSharedDeal}
            />
          </Flex>
        </>
      </Content>

      <BottomContainer>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="white" backgroundColor="#4fd165" onClick={handleSave}>
          Save
        </Button>
      </BottomContainer>
    </PopupBackground>
  )
}

export default DepreciationDefaultPopup
