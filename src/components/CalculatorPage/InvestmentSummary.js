import React, { useState, useContext } from 'react'
import Card from '../Card'
import { Flex } from '../CommonStyles'
import {
  SummaryLabel,
  SummaryValue,
  BtnWithIcon,
  SummaryHeader,
  SummaryContent,
} from '../../pages/Calculator/CalculatorStyles'
import Chart from '../Charts/Chart'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import CustomRange from '..//CustomRange'
import LineChart from '../Charts/LineChart'
import { fontSize } from '@mui/system'
import {
  ProfitAnalysisTableContainer,
  Title,
  Value,
} from '../../views/DetailedSummary/return-or-profit-analysis.styles'
import CustomSlider from '../CustomSlider'
import PurchasePriceTable from '../../components/PurchasePriceTable'
import Legend from '../Legend'

const InvestmentSummary = () => {
  const [yearsRangeInputValue, setYearsRangeInputValue] = useState(5)
  const { investmentSummary, summaryPercent, setSummaryPercentSlider } =
    useContext(InvestmentInputContext)

  const handleSliderChange = (e, newValue) => {
    setSummaryPercentSlider(newValue)
  }

  return (
    <Card heading="Investment Summary" padding="0.5rem 0" h="100%">
      <SummaryContent>
        <Flex h="93vh" jc="space-between" flexDirection="column">
          <div style={{ flex: 1 }}>
            {/* ALWAYS DISPLAY LEVERED IRR, USERS WILL ASSUME LEVERED IS DISPLAYED
            <Flex>
              <SummaryLabel>IRR:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.IRR : ' '}</SummaryValue>
            </Flex> */}
            <Flex>
              <SummaryLabel>IRR:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.LeveredIRR : ' '}</SummaryValue>
            </Flex>

            {/* ALWAYS DISPLAY LEVERED IRR, USERS WILL ASSUME LEVERED IS DISPLAYED
            <Flex>
              <SummaryLabel>After Tax IRR:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.AfterTaxIRR : ' '}</SummaryValue>
            </Flex> */}

            <Flex>
              <SummaryLabel>Cash on Cash:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.CashOnCash : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Profit:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.Profit : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Equity Multiple:</SummaryLabel>
              <SummaryValue>
                {investmentSummary ? investmentSummary.EquityMultiple : ' '}
              </SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>ROI:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.ROI : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Cap Rate:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.CapRate : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>NPV:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.NPV : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Price per Door (Unit)</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.CostPerDoor : ' '}</SummaryValue>
            </Flex>

            {/* <Flex>
              <SummaryLabel>Unlevered IRR:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.IRR : ' '}</SummaryValue>
            </Flex> */}

            <Flex>
              <SummaryLabel>After Tax IRR:</SummaryLabel>
              <SummaryValue>
                {investmentSummary ? investmentSummary.AfterTaxLeveredIRR : ' '}
              </SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Monthly Debt Payment:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.MonthlyDebt : ' '}</SummaryValue>
            </Flex>

            <Flex>
              <SummaryLabel>Annual Expenses:</SummaryLabel>
              <SummaryValue>
                {investmentSummary ? investmentSummary.AnnualExpenses : ' '}
              </SummaryValue>
            </Flex>

            <Flex>
              <PurchasePriceTable percent={summaryPercent}></PurchasePriceTable>
            </Flex>
            <Flex>
              <div style={{ display: 'flex' }}>
                <div>
                  {/* <LineChart w="12rem" h="9rem" /> */}
                  <CustomSlider
                    min={1}
                    max={20}
                    prefix="%"
                    value={summaryPercent}
                    onChange={handleSliderChange}
                  />
                </div>
                {/* <div style={{ alignSelf: 'center', marginLeft: '1rem' }}>
                  <Legend label='IRR' color="red" />
                  <Legend label='Levered Return LIRR' color="#0773ff" />
                  <Legend label='COC' color="#4fd165" />
                </div> */}
              </div>
            </Flex>
            {/* <Flex>
              <SummaryLabel>GRM:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.GRM : ' '}</SummaryValue>
            </Flex> */}

            {/* <Flex>
              <SummaryLabel>Rule of 72:</SummaryLabel>
              <SummaryValue>{investmentSummary ? investmentSummary.PaybackPeriod : ' '}</SummaryValue>
            </Flex> */}

            {/* <Flex>
              <LineChart lineColor="#25d662" areaColor="rgba(128,227,162,255)" h="12rem" dataArray={investmentSummary ? investmentSummary.monthlyPaymentsAfterExpensesArray : null} />
            </Flex>
            <div className='Text'
              style={{fontSize: '0.6rem', visibility: (isLoan ? true : false)}}
            >{`Loan Amount is fixed to ${loanAmountPercentage} of the Purchase Price in the graph above`}
            </div> */}
            {/* <Flex>
        <SummaryLabel>Price:</SummaryLabel>
      </Flex>
      <Flex>
        <Chart lineColor="#0773ff" areaColor="#0773ff" />
      </Flex> */}
            {/* <Flex><CustomRange value={yearsRangeInputValue} setValue={setYearsRangeInputValue} /></Flex> */}
          </div>
          {/* <Flex>
            <BtnWithIcon backgroundColor={'#0773ff'} color={'white'} w="100%" onClick={() => { scrollRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' }) }}>
              <img src="/images/summary.svg" className="btn-icon" />
              <div>See More Detailed Summary</div>
            </BtnWithIcon>
          </Flex> */}
          {/* <div>Hello</div> */}
        </Flex>
      </SummaryContent>
      <Flex pt="2rem">
        <SummaryHeader>Return Metrics</SummaryHeader>
      </Flex>
      <SummaryContent>
        <Flex>
          <SummaryLabel>IRR:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.IRR : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Levered IRR:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.LeveredIRR : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Cash on Cash (Apts):</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.CashOnCash : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Profit:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.Profit : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Multiple:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>ROI:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.ROI : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>After Tax IRR:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.AfterTaxIRR : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>NPV:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Cap Rate:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.CapRate : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Duration:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Rule of 72(Payback time):</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.PaybackPeriod : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>GRM:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.GRM : ' '}</SummaryValue>
        </Flex>
      </SummaryContent>

      <Flex pt="1rem">
        <SummaryHeader>Per Square Foot</SummaryHeader>
      </Flex>
      <SummaryContent>
        <Flex>
          <SummaryLabel>(Average) Rent PSF Monthly:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.RentPerSF : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Annual Rent PSF:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.AnnualRentPerSF : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Building Cost PSF:</SummaryLabel>
          <SummaryValue>
            {investmentSummary ? investmentSummary.BuildingPricePerSF : ' '}
          </SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Land Cost PSF:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.LandPricePerSF : ' '}</SummaryValue>
        </Flex>
      </SummaryContent>
      <Flex pt="1rem">
        <SummaryHeader>Debt</SummaryHeader>
      </Flex>
      <SummaryContent>
        <Flex>
          <SummaryLabel>Monthly Debt PMT:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.MonthlyDebt : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Annual Debt PMT:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.AnnualDebt : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>DCR:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>LTV:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
      </SummaryContent>

      <Flex pt="1rem">
        <SummaryHeader>Expenses, Income, Cash Flow</SummaryHeader>
      </Flex>
      <SummaryContent>
        <Flex>
          <SummaryLabel>Monthly Expenses:</SummaryLabel>
          <SummaryValue>
            {investmentSummary ? investmentSummary.AnnualExpenses / 12 : ' '}
          </SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Annual Expenses:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.AnnualExpenses : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Opex %:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Opex Ratio:</SummaryLabel>
          <SummaryValue>{investmentSummary ? investmentSummary.OpexRatio : ' '}</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Gross Income:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Monthly:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Annual:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>NOI:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Monthly:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>Annual:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
      </SummaryContent>
      <Flex pt="1rem">
        <SummaryHeader>Taxes</SummaryHeader>
      </Flex>
      <SummaryContent>
        <Flex>
          <SummaryLabel>Cap Gains:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
        <Flex>
          <SummaryLabel>After Tax Cash Flow:</SummaryLabel>
          <SummaryValue>X</SummaryValue>
        </Flex>
      </SummaryContent>
    </Card>
  )
}

export default InvestmentSummary
