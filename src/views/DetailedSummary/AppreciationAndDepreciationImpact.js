import React from 'react'
import Card from '../../components/Card'
import Chart from 'components/Charts/Chart'
import { Flex } from '../../components/CommonStyles'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import { styled } from '@mui/system'
const ExpensesContainer = styled('div')({
  flex: 1,
  '& .title': {
    color: '#999898',
    fontSize: '0.6rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
})

function AppreciationAndDepreciationImpact() {
  return (
    <Card heading="Depreciation & Appreciation Impact">
      <Flex pt="1rem" jc="space-between">
        <ExpensesContainer>
          <div className="title">Depreciation</div>
          <Chart h="13rem"></Chart>
        </ExpensesContainer>
        <ExpensesContainer>
          <div className="title">Appreciation</div>
          <Chart h="13rem"></Chart>
        </ExpensesContainer>
      </Flex>
    </Card>
  )
}

export default AppreciationAndDepreciationImpact
