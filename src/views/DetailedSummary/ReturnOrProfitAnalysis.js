import React, { useContext, useState } from 'react'
import Card from '../../components/Card'
import Chart from 'components/Charts/Chart'
import { Flex } from '../../components/CommonStyles'
import { ProfitAnalysisTableContainer, Title, Value } from './return-or-profit-analysis.styles'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import InterestRateOnLoanTable from '../../components/InterestRateOnLoanTable'
import CustomSlider from '../../components/CustomSlider'
import LineChart from '../../components/Charts/LineChart'
import Legend from '../../components/Legend'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'

function ReturnOrProfitAnalysis() {
  const { scrollRef, purchasePrice } = useContext(InvestmentInputContext)
  const [value, setValue] = useState(1)

  const handleSliderChange = (e, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <div ref={scrollRef}></div>
      <Card heading="Return/Profit Analysis">
        <Flex pt="1rem" jc="space-between">
          <div style={{ display: 'flex' }}>
            <div>
              <div style={{ display: 'flex' }}>
                <Title>Purchase Price:</Title>
                <Value>{purchasePrice ? purchasePrice : ' '}</Value>
              </div>
              <LineChart w="12rem" h="9rem" />
              <CustomSlider
                min={1}
                max={10}
                prefix="%"
                value={value}
                onChange={handleSliderChange}
              />
            </div>
            <div style={{ alignSelf: 'center', marginLeft: '1rem' }}>
              <Legend label="IRR" color="red" />
              <Legend label="Levered Return LIRR" color="#0773ff" />
              <Legend label="COC" color="#4fd165" />
            </div>
          </div>
          <div>
            <Title>Annual Rent % Change:</Title>
            <Chart w="14rem" h="11rem" />
          </div>
        </Flex>
        <Flex>
          <ProfitAnalysisTableContainer>
            <div style={{ display: 'flex' }}>
              <Title>Purchase Price:</Title>
              <Value>{purchasePrice ? purchasePrice : ' '}</Value>
            </div>
            <PurchasePriceTable percent={value}></PurchasePriceTable>
          </ProfitAnalysisTableContainer>
          <ProfitAnalysisTableContainer>
            <Title>Interest Rate On Loan:</Title>
            <InterestRateOnLoanTable></InterestRateOnLoanTable>
          </ProfitAnalysisTableContainer>
        </Flex>
      </Card>
    </>
  )
}

export default ReturnOrProfitAnalysis
