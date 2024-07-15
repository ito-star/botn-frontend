import { useState, useEffect, useContext } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate'
import { Stack, Button } from '@mui/material'
import Container from '../../components/Container'
import React from 'react'
import {
  CalculatorContainer,
  LeftPane,
  RightPane,
  PurchaseAndSale,
  ExpensesDebtDepContainer,
  ExpensesDepreciationMoreContainer,
  DebtAndCalculate,
  BtnWithIcon,
  CenterWrapper,
} from './CalculatorStyles'
import { Flex } from '../../components/CommonStyles'
import HeaderComponent from '../../components/CalculatorPage/Header'
import PurchaseComponent from '../../components/CalculatorPage/Purchase'
import SaleComponent from '../../components/CalculatorPage/Sale'
import { ExpensesComponent } from '../../components/CalculatorPage/Expenses'
import DepreciationAppreciationComponent from '../../components/CalculatorPage/DepreciationAppreciation'
import MoreComponent from '../../components/CalculatorPage/More'
import DebtComponent from '../../components/CalculatorPage/Debt'
import InvestmentSummaryComponent from '../../components/CalculatorPage/InvestmentSummary'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import AddToDatabasePopup from '../../components/Popups/AddToDatabasePopup'
import { UserContext } from 'context/UserContext'
import { loginUrl } from 'constants/clientRouteConstants'
import { PopupContext } from 'context/PopupContext'
import { useNotification } from '../../context/Notification'
import { useParams } from 'react-router-dom'
import { GetSingleSharedDealService } from '../../services/dealServices'
import ReturnOrProfitAnalysis from '../../views/DetailedSummary/ReturnOrProfitAnalysis'
import DebtAndExpenses from '../../views/DetailedSummary/DebtAndExpenses'
import HoldPeriod from '../../views/DetailedSummary/HoldPeriod'
import AppreciationAndDepreciationImpact from '../../views/DetailedSummary/AppreciationAndDepreciationImpact'
import IncomeStatement from '../../views/DetailedSummary/IncomeStatement'
function Calculator() {
  const {
    calculateInvestment,
    validateAndSetSummary,
    dealInfo,
    setDeal,
    isSharedDeal,
    clearAllInputs,
    resetFormInputs,
    investmentSummary,
  } = useContext(InvestmentInputContext)
  const { senderEmail, dealId } = useParams()
  const { setAddToDatabasePopupOpen, setSharePopupOpen } = useContext(PopupContext)
  const { userData } = useContext(UserContext)
  const { setLoginPopupOpen } = useContext(PopupContext)
  const { getSingleSharedDealData, sharedDealApiState } = GetSingleSharedDealService()
  const showNotification = useNotification()

  useEffect(() => {
    const onGetSharedDealSuccess = (dealData) => {
      dealData.isSharedDeal = true
      setDeal(dealData)
    }
    const onGetSharedDealFail = () => {}
    if (senderEmail != null && dealId != null) {
      const params = {
        senderEmail,
        dealId,
        userEmail: userData.email,
      }
      getSingleSharedDealData(params, onGetSharedDealSuccess, onGetSharedDealFail)
    }
  }, [])

  const handleAddToDbButtonClicked = () => {
    if (validateAndSetSummary()) {
      if (userData.isLoggedIn) {
        setAddToDatabasePopupOpen(true)
      } else {
        setLoginPopupOpen(true)
      }
    }
  }

  const handleShareButtonClicked = () => {
    if (userData.isLoggedIn) {
      if (dealInfo !== null) {
        setSharePopupOpen(true)
      } else {
        showNotification({ type: 'error', text: 'Save the deal to share it' })
        handleAddToDbButtonClicked()
      }
    } else {
      setLoginPopupOpen(true)
    }
  }
  return (
    <>
      <CenterWrapper>
        <Container>
          <CalculatorContainer className="CalculatorContainer">
            <LeftPane className="LeftPane">
              <HeaderComponent />
              <PurchaseAndSale>
                <PurchaseComponent />
                <SaleComponent />
              </PurchaseAndSale>
              <ExpensesDebtDepContainer>
                <ExpensesDepreciationMoreContainer>
                  <ExpensesComponent />
                  <DepreciationAppreciationComponent />
                  <MoreComponent />
                </ExpensesDepreciationMoreContainer>
                <DebtAndCalculate>
                  <DebtComponent />
                  <Stack>
                    <Stack direction="row" spacing={1.5}>
                      <BtnWithIcon
                        onClick={clearAllInputs}
                        flex={1}
                        backgroundColor={'#ffffff'}
                        color={'#0773ff'}
                      >
                        <span>Clear</span>
                      </BtnWithIcon>
                      <BtnWithIcon
                        onClick={resetFormInputs}
                        flex={1}
                        backgroundColor={'#ffffff'}
                        color={'red'}
                      >
                        <span>Reset</span>
                      </BtnWithIcon>
                    </Stack>
                    <Flex pt="0.6rem">
                      <BtnWithIcon
                        onClick={calculateInvestment}
                        flex={1}
                        backgroundColor={'#4fd165'}
                        color={'white'}
                      >
                        <CalculateIcon fontSize="small" />
                        &nbsp;&nbsp;<span>Calculate</span>
                      </BtnWithIcon>
                    </Flex>
                  </Stack>
                </DebtAndCalculate>
              </ExpensesDebtDepContainer>
              <Flex
                style={{
                  position: 'sticky',
                  top: '3.5rem',
                  background: 'var(--background-color)',
                  zIndex: '99',
                  paddingBottom: '0.6rem',
                }}
              >
                <BtnWithIcon
                  disabled={isSharedDeal}
                  onClick={handleAddToDbButtonClicked}
                  flex={1}
                  backgroundColor={'white'}
                  color={'#4fd165'}
                >
                  <img src="/images/add_data.svg" className="btn-icon" />
                  <div>Add to Database</div>
                </BtnWithIcon>
                <BtnWithIcon
                  disabled={isSharedDeal}
                  onClick={handleShareButtonClicked}
                  flex={1}
                  backgroundColor={'white'}
                  color={'#0773ff;'}
                >
                  <img src="/images/share_blue.svg" className="btn-icon" />
                  <div>Share</div>
                </BtnWithIcon>
              </Flex>
              <Flex pt="1rem">
                <ReturnOrProfitAnalysis investmentSummary={investmentSummary} />
              </Flex>
              <Flex pt="1rem">
                <DebtAndExpenses />
              </Flex>
              <Flex pt="1rem">
                <HoldPeriod />
              </Flex>
              <Flex pt="1rem">
                <AppreciationAndDepreciationImpact />
              </Flex>
              <Flex pt="1rem">
                <IncomeStatement />
              </Flex>
            </LeftPane>
            <RightPane>
              <InvestmentSummaryComponent />
            </RightPane>
          </CalculatorContainer>
        </Container>
      </CenterWrapper>
    </>
  )
}

export default Calculator
