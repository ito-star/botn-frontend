import React from 'react'
import Card from '../../components/Card'
import Chart from 'components/Charts/Chart'
import { Flex } from '../../components/CommonStyles'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import { styled } from '@mui/system'
import HoldPeriodTable from '../../components/HoldPriceTable'
import CustomSlider from '../../components/CustomSlider'
const EquityAccumulatedContainer = styled('div')({
  // flex: 1,
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
    fontSize: '0.6rem',
    padding: '0 2rem',
    '& .yearTitle': {
      fontSize: '0.7rem',
      fontWeight: 700,
    },
  },
})
function HoldPeriod() {
  return (
    <Card heading="Hold Period">
      <Flex pt="1rem" jc="space-between">
        <HoldPeriodTable />
        <EquityAccumulatedContainer>
          <div className="title">Equity Accumulated</div>
          <Chart h="10rem" w="13rem"></Chart>
          <CustomSlider min={1} max={10} prefix="$" />
        </EquityAccumulatedContainer>
      </Flex>
    </Card>
  )
}

export default HoldPeriod
