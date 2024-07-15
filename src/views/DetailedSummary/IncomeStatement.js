import React from 'react'
import Card from '../../components/Card'
import Chart from 'components/Charts/Chart'
import { Flex } from '../../components/CommonStyles'
import { ProfitAnalysisTableContainer } from './return-or-profit-analysis.styles'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import InterestRateOnLoanTable from '../../components/InterestRateOnLoanTable'
import IncomeStatementTable from '../../components/IncomeStatementTable'

function IncomeStatement() {
  return (
    <Card heading="Income Statement">
      <Flex>
        <IncomeStatementTable />
      </Flex>
    </Card>
  )
}

export default IncomeStatement
