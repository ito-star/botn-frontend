import React from 'react'
import Card from '../../components/Card'
import Chart from 'components/Charts/Chart'
import { Flex } from '../../components/CommonStyles'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import { styled } from '@mui/system'
import PieChart from '../../components/Charts/PieChart'
import LineChart from '../../components/Charts/LineChart'
const ExpensesContainer = styled('div')({
  flex: 1,
  '& .title': {
    color: '#999898',
    fontSize: '0.6rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
})
const IncomeVsExpensesContainer = styled('div')({
  flex: 2,
  '& .title': {
    color: '#999898',
    fontSize: '0.6rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  '& .incomeAndExpenseContent': {
    display: 'flex',
  },
  '& .chart-container': {
    flex: 1.2,
  },
  '& .incomeAndExpenseData': {
    flex: 1,
    fontSize: '0.5rem',
    padding: '0 2rem',
    '& .yearTitle': {
      fontSize: '0.7rem',
      fontWeight: 700,
    },
  },
})
function DebtAndExpenses() {
  return (
    <Card heading="Debt And Expenses">
      <Flex pt="1rem" jc="space-between">
        <ExpensesContainer>
          <div className="title">Expenses</div>
          <PieChart h="11.5rem" />
        </ExpensesContainer>
        <IncomeVsExpensesContainer>
          <div className="title">Income vs. Expenses</div>
          <div className="incomeAndExpenseContent">
            <div className="chart-container">
              <LineChart h="11.5rem"></LineChart>
            </div>
            <div className="incomeAndExpenseData">
              <Flex flexDirection="column" gap="0.2rem">
                <div className="yearTitle">First year</div>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between">
                  <div>Text here</div>
                  <div>Text here</div>
                </Flex>
                <Flex jc="space-between" pt="1rem">
                  <div style={{ fontWeight: 600 }}>Total:</div>
                  <div>$10,000,000.00</div>
                </Flex>
              </Flex>
            </div>
          </div>
        </IncomeVsExpensesContainer>
      </Flex>
    </Card>
  )
}

export default DebtAndExpenses
