import React, { useEffect, useState, useContext, useRef } from 'react'
import {
  isInputValid,
  isCurrencyValid,
  isNumberValid,
  isRateValid,
  unformatCurrency,
  unformatRate,
  formatRate,
  validateErrorObjectForInput,
  getCurrency,
} from '../utils/inputFormatter.js'
import calculateInvestmentUtil, { getTransformedDataForCalculator } from '../utils/jsCalc.js'

export const InvestmentInputContext = React.createContext()

let debounceTimer

const debounce = (callback, time) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(callback, time)
}

const clearInputErrorObject = {
  purchasePrice: false,
  leaseLength: false,
  noiAnnual: false,
  annualRentIncreases: false,

  appartmentVacancy: false,
  appartmentUnits: false,
  appartmentManagementFee: false,

  salePrice: false,
  exitCapRate: false,

  recurringExpenseSimple: false,
  nonRecurringExpenseSimple: false,

  loanAmount: false,
  loanRate: false,
  loanTerm: false,
  loanAmortizationTerm: false,
  // loanAmortizationFee: false,

  depreciationRate: false,
  appreciationRate: false,
  depreciationTerm: false,

  commission: false,
  marketRentPsf: false,
  buildingSF: false,
  landSF: false,
  capGainRate: false,
  incomeTaxRate: false,
  probability1031: false,
}
export const InvestmentInputProvider = ({ children }) => {
  const [isLogarithmic, setIsLogarithmic] = useState(true)
  const [purchasePrice, setPurchasePrice] = useState('$1,000,000')
  const [leaseLength, setLeaseLength] = useState(10)
  const [leaseLengthUnit, setLeaseLengthUnit] = useState('years')
  const [noiAnnual, setNoiAnnual] = useState('$80,000')
  const [annualRentIncreases, setAnnualRentIncreases] = useState('2%')
  const [customizedRentalInfo, setCustomizedRentalInfo] = useState()
  const [appartmentVacancy, setAppartmentVacancy] = useState('4%')
  const [isAppartment, setIsAppartment] = useState(false)
  const [appartmentUnits, setAppartmentUnits] = useState(1)
  const [appartmentManagementFee, setAppartmentManagementFee] = useState('0')
  const [appartmentManagementFeeUnit, setAppartmentManagementFeeUnit] = useState('rate')
  const [visibleDebt, setVisibleDebt] = useState(false)
  const [isSale, setIsSale] = useState(false)
  const [salePrice, setSalePrice] = useState()
  const [exitCapRate, setExitCapRate] = useState()
  const [isLoan, setIsLoan] = useState(false)
  const [loanAmount, setLoanAmount] = useState()
  const [loanAmountPercentage, setLoanAmountPercentage] = useState('60%')
  const [loanRate, setLoanRate] = useState()
  const [loanTerm, setLoanTerm] = useState()
  const [loanTermUnit, setLoanTermUnit] = useState('years')
  const [loanAmortizationTerm, setLoanAmortizationTerm] = useState()
  const [loanAmortizationTermUnit, setLoanAmortizationTermUnit] = useState('years')
  // const [loanAmortizationFee, setLoanAmortizationFee] = useState()
  const [commission, setCommission] = useState('3%')
  const [marketRentPsf, setMarketRentPsf] = useState()
  const [buildingSF, setBuildingSF] = useState()
  const [landSF, setLandSF] = useState()
  const [capGainRate, setCapGainRate] = useState('13%')
  const [incomeTaxRate, setIncomeTaxRate] = useState('45%')
  const [probability1031, setProbability1031] = useState('50%')
  const [termCap, setTermCap] = useState()
  const [depreciationRate, setDepreciationRate] = useState()
  const [appreciationRate, setAppreciationRate] = useState('1.5%')
  const [depreciationTerm, setDepreciationTerm] = useState()
  const [appreciationAndDepreciationData, setAppreciationAndDepreciationData] = useState({
    improvementsFastAmount: '$0',
    improvementsFastMonths: 20,
    improvementsFastRate: '1.5%',
    improvementsMedAmount: '$0',
    improvementsMedMonths: 60,
    improvementsMedRate: '1.5%',
    improvementsSlowAmount: '$0',
    improvementsSlowMonths: 468,
    improvementsSlowRate: '1.5%',
    improvementsUndepriceAmount: '$0',
    improvementsUndepriceRate: '1.5%',
    landValueRate: '2.0%',
  })
  const [rentalInfoData, setRentalInfoData] = useState({
    isCustomized: false,
  })
  const [investmentSummary, setInvestmentSummary] = useState()
  const [recurringExpensesData, setRecurringExpensesData] = useState()
  const [nonRecurringExpensesData, setNonRecurringExpensesData] = useState()
  const [repairsAndRenovationsData, setRepairsAndRenovationsData] = useState()
  const [recurringExpenseSimple, setRecurringExpensesSimple] = useState()
  const [nonRecurringExpenseSimple, setNonRecurringExpensesSimple] = useState()
  const [calculatorPageErrors, setCalculatorPageErrors] = useState(clearInputErrorObject)
  const [isExpensesSimple, setIsExpensesSimple] = useState(true)
  const [isAppreciationDepreciationSimple, setIsAppreciationDepreciationSimple] = useState(true)
  const [dealInfo, setDealInfo] = useState(null)
  const [dealSharedToEmailArray, setDealSharedToEmailArray] = useState(null)
  const [isSharedDeal, setIsSharedDeal] = useState(false)
  const [summaryPercent, setSummaryPercent] = useState(10)
  const [investmentSummaryBreakdown, setInvestmentSummaryBreakdown] = useState([{}, {}, {}, {}, {}])
  const scrollRef = useRef()

  // If any sale values are modified, parse all sale variables into a boolean value for isSale
  useEffect(() => {
    setIsSale(!!(salePrice || exitCapRate))
  }, [salePrice, exitCapRate])

  // If any loan values are modified, parse all loan variables into a boolean value for isLoan
  useEffect(() => {
    setIsLoan(!!(loanAmount || loanRate || loanTerm || loanAmortizationTerm))
  }, [loanAmount, loanRate, loanTerm, loanAmortizationTerm])

  useEffect(() => {
    setLoanAmountPercentage(
      formatRate((unformatCurrency(loanAmount) / unformatCurrency(purchasePrice)) * 100)
    )
  }, [loanAmount, purchasePrice])

  useEffect(() => {
    if (customizedRentalInfo) {
      // set earlistTenant to first tenant in the array
      let earliestTenant = customizedRentalInfo[0]
      // iterate through customizedRentalInfo array of tennants
      for (let oneTenant of customizedRentalInfo) {
        // if next tenant in the array started earlier than the previous tenant
        if (oneTenant.startTime < earliestTenant.startTime) {
          // that tenant becomes the earliestTentant
          earliestTenant = oneTenant
        }
      }16
      // iterate through array of tenants
      for (let tenantOne of customizedRentalInfo) {
        // if multiple tenants do not start at the same time
        if (earliestTenant.startTime !== tenantOne.startTime) {
          // noi annual is the cashflow of the earliest tenant
          setNoiAnnual(earliestTenant.cashflow)
          break
        } else {
          // otherwise sum up the cashflow of all tenants
          setNoiAnnual(
            getCurrency(
              `${customizedRentalInfo.reduce((acc, tenant) => {
                let cashflow = unformatCurrency(tenant.cashflow)
                return tenant.cashFlowUnit === 'years' ? acc + cashflow : acc + cashflow * 12
              }, 0)}`
            )
          )
        }
      }
    }
  }, [customizedRentalInfo])

  useEffect(() => {
    const transformedRentalInfo =
      customizedRentalInfo != null && customizedRentalInfo != undefined
        ? JSON.parse(JSON.stringify(customizedRentalInfo))
        : null
    let apartmentMgntFeeDollars = 0
    let noiAnnualTransformed = unformatCurrency(noiAnnual)
    const appartmentVacancyRateTransformed =
      isAppartment && isRateValid(appartmentVacancy) ? unformatRate(appartmentVacancy) / 100 : 0
    if (customizedRentalInfo?.length > 0) {
      transformedRentalInfo.map((tenantItem) => {
        tenantItem.cashflow =
          tenantItem.cashflowUnit === 'months'
            ? unformatCurrency(tenantItem.cashflow)
            : unformatCurrency(tenantItem.cashflow) / 12

        let appartmentManagementFeeInDollars = 0
        if (appartmentManagementFeeUnit === 'dollar' && isCurrencyValid(appartmentManagementFee)) {
          appartmentManagementFeeInDollars = unformatCurrency(appartmentManagementFee)
        } else if (appartmentManagementFeeUnit === 'rate' && isRateValid(appartmentManagementFee)) {
          appartmentManagementFeeInDollars = tenantItem.cashflow * (appartmentManagementFee / 100)
        }

        apartmentMgntFeeDollars += appartmentManagementFeeInDollars
      })
    } else {
      const appartmentVacancyInDollars =
        (noiAnnualTransformed / 12) * appartmentVacancyRateTransformed
      if (appartmentManagementFeeUnit === 'dollar' && isCurrencyValid(appartmentManagementFee)) {
        apartmentMgntFeeDollars = unformatCurrency(appartmentManagementFee)
      } else if (appartmentManagementFeeUnit === 'rate' && isRateValid(appartmentManagementFee)) {
        // %mgmt fee based on noi - vacancy losses, not based on full capacity
        apartmentMgntFeeDollars =
          (noiAnnualTransformed / 12 - appartmentVacancyInDollars) *
          (unformatRate(appartmentManagementFee) / 100)
      }
    }

    setRecurringExpensesData((prev) => ({
      ...prev,
      managementFee: getCurrency(apartmentMgntFeeDollars.toFixed(2)),
    }))
  }, [
    customizedRentalInfo,
    appartmentManagementFeeUnit,
    appartmentManagementFee,
    noiAnnual,
    isAppartment,
    appartmentVacancy,
  ])

  const clearAllInputs = () => {
    setPurchasePrice('')
    setLeaseLength('')
    setNoiAnnual('')
    setAnnualRentIncreases('')
    setCustomizedRentalInfo()
    setAppartmentVacancy('')
    setIsAppartment(false)
    setAppartmentUnits('')
    setAppartmentManagementFee('')
    setAppartmentManagementFeeUnit('rate')
    setIsSale(false)
    setSalePrice()
    setExitCapRate('')
    setIsLoan(false)
    setVisibleDebt(false)
    setLoanAmount('')
    setLoanAmountPercentage('')
    setLoanRate('')
    setLoanTerm('')
    setLoanAmortizationTerm('')
    // setLoanAmortizationFee('')
    setCommission('')
    setMarketRentPsf('')
    setBuildingSF('')
    setLandSF('')
    setCapGainRate('')
    setIncomeTaxRate('')
    setProbability1031('')
    setTermCap('')
    setDepreciationRate('')
    setAppreciationRate('')
    setDepreciationTerm('')
    setAppreciationAndDepreciationData({})
    setRentalInfoData({ isCustomized: false })
    setInvestmentSummary('')
    setRecurringExpensesData('')
    setNonRecurringExpensesData('')
    setRecurringExpensesSimple('')
    setNonRecurringExpensesSimple('')
    setCalculatorPageErrors(clearInputErrorObject)
    setIsExpensesSimple(true)
    setIsAppreciationDepreciationSimple(true)
    setDealInfo(null)
    setDealSharedToEmailArray(null)
    setIsSharedDeal(false)
  }

  const resetFormInputs = () => {
    setPurchasePrice('$1,000,000')
    setLeaseLength('10')
    setLeaseLengthUnit('years')
    setNoiAnnual('$80,000')
    setAnnualRentIncreases('2%')
    setCustomizedRentalInfo()
    setAppartmentVacancy('4%')
    setIsAppartment(false)
    setAppartmentUnits('1')
    setAppartmentManagementFee('0')
    setAppartmentManagementFeeUnit('rate')
    setIsSale(false)
    setSalePrice()
    setExitCapRate()
    setIsLoan(true)
    setVisibleDebt(true)
    setLoanAmount('$600,000')
    setLoanAmountPercentage('60%')
    setLoanRate('4%')
    setLoanTerm('10')
    setLoanTermUnit('years')
    setLoanAmortizationTerm('30')
    setLoanAmortizationTermUnit('years')
    // setLoanAmortizationFee('')
    setCommission('3%')
    setMarketRentPsf('')
    setBuildingSF('')
    setLandSF('')
    setCapGainRate('13%')
    setIncomeTaxRate('45%')
    setProbability1031('')
    setTermCap('')
    setDepreciationRate('')
    setAppreciationRate('')
    setDepreciationTerm('')
    setAppreciationAndDepreciationData({
      improvementsFastAmount: '$0',
      improvementsFastMonths: 20,
      improvementsFastRate: '1.5%',
      improvementsMedAmount: '$0',
      improvementsMedMonths: 60,
      improvementsMedRate: '1.5%',
      improvementsSlowAmount: '$0',
      improvementsSlowMonths: 468,
      improvementsSlowRate: '1.5%',
      improvementsUndepriceAmount: '$0',
      improvementsUndepriceRate: '1.5%',
      landValueRate: '2.0%',
    })
    setRentalInfoData({ isCustomized: false })
    setInvestmentSummary('')
    setRecurringExpensesData('')
    setNonRecurringExpensesData('')
    setRepairsAndRenovationsData('')
    setRecurringExpensesSimple('')
    setNonRecurringExpensesSimple('')
    setCalculatorPageErrors(clearInputErrorObject)
    setIsExpensesSimple(true)
    setIsAppreciationDepreciationSimple(true)
    setDealInfo(null)
    setDealSharedToEmailArray(null)
    setIsSharedDeal(false)
  }

  const setLeaseLengthUnitInput = (value) => {
    setLeaseLengthUnit(value)
  }

  const setLoanTermUnitInput = (value) => {
    setLoanTermUnit(value)
  }

  const setAppartmentManagementFeeUnitInput = (value) => {
    setAppartmentManagementFeeUnit(value)
  }

  const setLoanAmortizationTermUnitInput = (value) => {
    setLoanAmortizationTermUnit(value)
  }

  const setIsExpensesSimpleInput = (value) => {
    setIsExpensesSimple(value)
  }

  const setIsAppreciationDepreciationSimpleInput = (value) => {
    setIsAppreciationDepreciationSimple(value)
  }

  const setRecurringExpensesDataInput = (value) => {
    setRecurringExpensesData(value)
  }

  const setNonRecurringExpensesDataInput = (value) => {
    setNonRecurringExpensesData(value)
  }

  const setRecurringExpenseSimpleInput = (value) => {
    setRecurringExpensesSimple(value)
  }

  const setNonRecurringExpenseSimpleInput = (value) => {
    setNonRecurringExpensesSimple(value)
  }

  const setRepairsAndRenovationsDataInput = (value) => {
    setRepairsAndRenovationsData(value)
  }

  const setIsLoanInput = (value) => {
    setIsLoan(value)
  }
  const setLoanAmountInput = (value) => {
    setLoanAmount(value)
  }
  const setLoanRateInput = (value) => {
    setLoanRate(value)
  }
  const setLoanTermInput = (value) => {
    setLoanTerm(value)
  }
  const setIsSaleInput = (value) => {
    setIsSale(value)
  }
  const setLoanAmortizationTermInput = (value) => {
    setLoanAmortizationTerm(value)
  }

  // const setLoanAmortizationFeeInput = (value) => {
  //   setLoanAmortizationFee(value)
  // }

  const setSalePriceInput = (value) => {
    setSalePrice(value)
  }

  const setExitCapRateInput = (value) => {
    setExitCapRate(value)
  }

  const setPurchasePriceInput = (value) => {
    setPurchasePrice(value)
  }

  const setLeaseLengthInput = (value) => {
    setLeaseLength(value)
  }

  const setNoiAnnualInput = (value) => {
    setNoiAnnual(value)
  }

  const setCommissionInput = (value) => {
    setCommission(value)
  }

  const setMarketRentPsfInput = (value) => {
    setMarketRentPsf(value)
  }

  const setBuildingSFInput = (value) => {
    setBuildingSF(value)
  }

  const setLandSFInput = (value) => {
    setLandSF(value)
  }

  const setCapGainRateInput = (value) => {
    setCapGainRate(value)
  }
  const setIncomeTaxRateInput = (value) => {
    setIncomeTaxRate(value)
  }

  const setProbability1031Input = (value) => {
    setProbability1031(value)
  }
  const setTermCapInput = (value) => {
    setTermCap(value)
  }

  const setAppreciationAndDepreciationDataInput = (value) => {
    setAppreciationAndDepreciationData(value)
  }

  const setRentalInfoDataInput = (value) => {
    setRentalInfoData(value)
  }

  const setAnnualRentIncreasesInput = (value) => {
    setAnnualRentIncreases(value)
  }

  const setDepreciationRateInput = (value) => {
    setDepreciationRate(value)
  }

  const setDepreciationTermInput = (value) => {
    setDepreciationTerm(value)
  }

  const setAppreciationRateInput = (value) => {
    setAppreciationRate(value)
  }

  const setInvestmentSummaryInput = (value) => {
    setInvestmentSummary(value)
  }

  const setCustomizedRentalInfoInput = (value) => {
    setCustomizedRentalInfo(value)
  }

  const setIsAppartmentInput = (value) => {
    setIsAppartment(value)
  }

  const setAppartmentVacancyInput = (value) => {
    setAppartmentVacancy(value)
  }

  const setAppartmentUnitsInput = (value) => {
    setAppartmentUnits(value)
  }

  const setAppartmentManagementFeeInput = (value) => {
    setAppartmentManagementFee(value)
  }

  const setSummaryPercentSlider = (value) => {
    setSummaryPercent(value)

    // Wait 1 second before calculating with new price % changes
    debounce(() => calculateInvestment(), 1000)
  }

  const clearAllInputErrorInCalculatorPage = () => {
    setCalculatorPageErrors(clearInputErrorObject)
  }

  const resetDealData = () => {
    setDeal({
      dealInfo: null,
      dealCalculationInfo: {
        leaseLengthUnit: 'years',
        appartmentManagementFeeUnit: 'dollar',
        loanTermUnit: 'years',
        rentalInfoData: { isCustomized: false },
        isExpensesSimple: true,
        isAppreciationDepreciationSimple: true,
        isSharedDeal: true,
      },
    })
  }

  const setDeal = (deal) => {
    const { dealCalculationInfo, dealInfo, sharedTo, isSharedDeal } = deal
    setPurchasePrice(dealCalculationInfo.purchasePrice)
    setLeaseLength(dealCalculationInfo.leaseLength)
    setLeaseLengthUnit(dealCalculationInfo.leaseLengthUnit)
    setNoiAnnual(dealCalculationInfo.noiAnnual)
    setAnnualRentIncreases(dealCalculationInfo.annualRentIncreases)
    setCustomizedRentalInfo(dealCalculationInfo.customizedRentalInfo)
    setAppartmentVacancy(dealCalculationInfo.appartmentVacancy)
    setIsAppartment(dealCalculationInfo.isAppartment)
    setAppartmentUnits(dealCalculationInfo.appartmentUnits)
    setAppartmentManagementFee(dealCalculationInfo.appartmentManagementFee)
    setAppartmentManagementFeeUnit(dealCalculationInfo.appartmentManagementFeeUnit)
    setIsSale(dealCalculationInfo.isSale)
    setSalePrice(dealCalculationInfo.salePrice)
    setExitCapRate(dealCalculationInfo.exitCapRate)
    setIsLoan(dealCalculationInfo.isLoan)
    setVisibleDebt(dealCalculationInfo.visibleDebt)
    setLoanAmount(dealCalculationInfo.loanAmount)
    setLoanRate(dealCalculationInfo.loanRate)
    setLoanTerm(dealCalculationInfo.loanTerm)
    setLoanTermUnit(dealCalculationInfo.loanTermUnit)
    setLoanAmortizationTerm(dealCalculationInfo.loanAmortizationTerm)
    setLoanAmortizationTermUnit(dealCalculationInfo.loanAmortizationTermUnit)
    // setLoanAmortizationFee(dealCalculationInfo.loanAmortizationFee)
    setCommission(dealCalculationInfo.commission)
    setMarketRentPsf(dealCalculationInfo.marketRentPsf)
    setBuildingSF(dealCalculationInfo.buildingSF)
    setLandSF(dealCalculationInfo.landSF)
    setCapGainRate(dealCalculationInfo.capGainRate)
    setIncomeTaxRate(dealCalculationInfo.incomeTaxRate)
    setProbability1031(dealCalculationInfo.probability1031)
    setTermCap(dealCalculationInfo.termCap)
    setDepreciationRate(dealCalculationInfo.depreciationRate)
    setAppreciationAndDepreciationData(dealCalculationInfo.appreciationAndDepreciationData)
    setRentalInfoData(dealCalculationInfo.rentalInfoData)
    setRecurringExpensesData(dealCalculationInfo.recurringExpensesData)
    setNonRecurringExpensesData(dealCalculationInfo.nonRecurringExpensesData)
    setRepairsAndRenovationsData(dealCalculationInfo.repairsAndRenovationsData)
    setRecurringExpensesSimple(dealCalculationInfo.recurringExpenseSimple)
    setNonRecurringExpensesSimple(dealCalculationInfo.nonRecurringExpenseSimple)
    setIsExpensesSimple(dealCalculationInfo.isExpensesSimple)
    setIsAppreciationDepreciationSimple(dealCalculationInfo.isAppreciationDepreciationSimple)
    if (dealInfo) {
      dealInfo._id = deal._id
    }
    setDealInfo(dealInfo)
    setDealSharedToEmailArray(sharedTo)
    setIsSharedDeal(isSharedDeal)
  }

  const getAllInputs = () => {
    return {
      purchasePrice,
      leaseLength,
      leaseLengthUnit,
      noiAnnual,
      annualRentIncreases,
      customizedRentalInfo,
      appartmentVacancy,
      isAppartment,
      appartmentUnits,
      appartmentManagementFee,
      appartmentManagementFeeUnit,
      isSale,
      salePrice,
      exitCapRate,
      isLoan,
      visibleDebt,
      loanAmount,
      loanRate,
      loanTerm,
      loanTermUnit,
      loanAmortizationTerm,
      loanAmortizationTermUnit,
      // loanAmortizationFee,
      commission,
      marketRentPsf,
      buildingSF,
      landSF,
      capGainRate,
      incomeTaxRate,
      probability1031,
      termCap,
      depreciationRate,
      appreciationRate,
      depreciationTerm,
      appreciationAndDepreciationData,
      rentalInfoData,
      recurringExpensesData,
      nonRecurringExpensesData,
      repairsAndRenovationsData,
      recurringExpenseSimple,
      nonRecurringExpenseSimple,
      isExpensesSimple,
      isAppreciationDepreciationSimple,
    }
  }

  const validateInput = () => {
    const validatedObject = {
      purchasePrice: !isCurrencyValid(purchasePrice),
      leaseLength: !isNumberValid(leaseLength),
      noiAnnual:
        !isCurrencyValid(noiAnnual) &&
        !(customizedRentalInfo != null && customizedRentalInfo.length > 0),
      annualRentIncreases:
        !isCurrencyValid(annualRentIncreases) &&
        !(customizedRentalInfo != null && customizedRentalInfo.length > 0),

      // appartmentVacancy: isAppartment && !isNumberValid(appartmentVacancy),
      // appartmentUnits: isAppartment && !isNumberValid(appartmentUnits),
      // appartmentManagementFee: isAppartment && !isRateValid(appartmentManagementFee),
      appartmentVacancy: false,
      appartmentUnits: false,
      appartmentManagementFee: false,

      salePrice: isSale && !(isCurrencyValid(salePrice) || isRateValid(exitCapRate)),
      exitCapRate: isSale && !(isCurrencyValid(salePrice) || isRateValid(exitCapRate)),

      // recurringExpenseSimple: !isCurrencyValid(recurringExpenseSimple) && isExpensesSimple,
      // nonRecurringExpenseSimple: !isCurrencyValid(nonRecurringExpenseSimple) && isExpensesSimple,
      recurringExpenseSimple: false,
      nonRecurringExpenseSimple: false,
      loanAmount: isLoan && !isCurrencyValid(loanAmount),
      loanRate: isLoan && !isRateValid(loanRate),
      loanTerm: isLoan && !isNumberValid(loanTerm),
      loanAmortizationTerm: isLoan && !isNumberValid(loanAmortizationTerm),
      // loanAmortizationFee: isLoan && !isRateValid(loanAmortizationFee),

      depreciationRate: isInputValid(depreciationRate) && !isRateValid(depreciationRate),
      appreciationRate: isInputValid(appreciationRate) && !isRateValid(appreciationRate),
      depreciationTerm: isInputValid(depreciationTerm) && !isNumberValid(depreciationTerm),

      commission: isInputValid(commission) && !isRateValid(commission),
      marketRentPsf: isInputValid(marketRentPsf) && !isCurrencyValid(marketRentPsf),
      buildingSF: isInputValid(buildingSF) && !isNumberValid(buildingSF),
      landSF: isInputValid(landSF) && !isNumberValid(landSF),
      capGainRate: isInputValid(capGainRate) && !isRateValid(capGainRate),
      incomeTaxRate: isInputValid(incomeTaxRate) && !isRateValid(incomeTaxRate),
      probability1031: isInputValid(probability1031) && !isRateValid(probability1031),
    }

    setCalculatorPageErrors(validatedObject)

    return validateErrorObjectForInput(validatedObject)
  }

  const validateAndSetSummary = () => {
    if (validateInput()) {
      const summaryPercents = [
        1 - (summaryPercent / 100) * 2,
        1 - summaryPercent / 100,
        1,
        1 + summaryPercent / 100,
        1 + (summaryPercent / 100) * 2,
      ]
      let investmentSummaries = summaryPercents.map((per) => {
        const transformedData = getTransformedDataForCalculator(
          getCurrency(`${unformatCurrency(purchasePrice) * per}`),
          leaseLength,
          noiAnnual,
          annualRentIncreases,
          customizedRentalInfo,
          isAppartment,
          appartmentVacancy,
          appartmentUnits,
          appartmentManagementFee,
          appartmentManagementFeeUnit,
          isSale,
          salePrice,
          exitCapRate,
          isLoan,
          loanAmount,
          loanRate,
          loanTerm,
          loanAmortizationTerm,
          // loanAmortizationFee,
          depreciationRate,
          depreciationTerm,
          appreciationRate,
          appreciationAndDepreciationData,
          commission,
          marketRentPsf,
          buildingSF,
          landSF,
          capGainRate,
          incomeTaxRate,
          probability1031,
          recurringExpensesData,
          nonRecurringExpensesData,
          repairsAndRenovationsData,
          recurringExpenseSimple,
          nonRecurringExpenseSimple,
          isExpensesSimple,
          isAppreciationDepreciationSimple,
          leaseLengthUnit,
          loanTermUnit,
          loanAmortizationTermUnit,
          isLogarithmic
        )

        console.log('transformed data', transformedData)
        const investmentSummary = calculateInvestmentUtil(transformedData)
        console.log('investment summary', investmentSummary)
        return investmentSummary
      })

      setInvestmentSummaryBreakdown(investmentSummaries)

      setInvestmentSummaryInput(investmentSummaries[2])


      return true
    } else {
      return false
    }
  }

  const calculateInvestment = () => {
    validateAndSetSummary()

    // console.log("purchasePrice", purchasePrice)
    // console.log("leaseLength", leaseLength)
    // console.log("leaseLengthUnit", leaseLengthUnit)
    // console.log("noiAnnual", noiAnnual)
    // console.log("annualRentIncreases", annualRentIncreases)
    // console.log("customizedRentalInfo", customizedRentalInfo)
    // console.log("is appartment", isAppartment)
    // console.log("appartment vacancy", appartmentVacancy)
    // console.log("appartment units", appartmentUnits)
    // console.log("appartment management fee", appartmentManagementFee)
    // console.log("is sale", isSale)
    // console.log("sale price", salePrice)
    // console.log("exit cap rate", exitCapRate)
    // console.log("is loan", isLoan)
    // console.log("loan Amount", loanAmount)
    // console.log("loan Rate", loanRate)
    // console.log("loan term", loanTerm)
    // console.log("loan Amortization Term", loanAmortizationTerm)
    // console.log("loan Amortization Fee", loanAmortizationFee)
    // console.log("depreciationRate", depreciationRate)
    // console.log("depreciationTerm", depreciationTerm)
    // console.log("appreciationRate", appreciationRate)
    // console.log("appreciationAndDepreciationData", appreciationAndDepreciationData)
    // console.log("commission", commission)
    // console.log("marketRentPsf", marketRentPsf)
    // console.log("buildingSF", buildingSF)
    // console.log("landSF", landSF)
    // console.log("capGainRate", capGainRate)
    // console.log("incomeTax", incomeTaxRate)
    // console.log("recurringExpensesData", recurringExpensesData);
    // console.log("nonRecurringExpensesData", nonRecurringExpensesData)
    // console.log("recurringExpenseSimple", recurringExpenseSimple);
    // console.log("nonRecurringExpenseSimple", nonRecurringExpenseSimple)
    // console.log("isExpensesSimple", isExpensesSimple)
    // console.log("isAppreciationDepreciationSimple", isAppreciationDepreciationSimple)
  }

  return (
    <InvestmentInputContext.Provider
      value={{
        purchasePrice,
        leaseLength,
        noiAnnual,
        annualRentIncreases,
        setAnnualRentIncreasesInput,
        commission,
        marketRentPsf,
        buildingSF,
        landSF,
        capGainRate,
        incomeTaxRate,
        probability1031,
        termCap,
        appreciationAndDepreciationData,
        rentalInfoData,
        setPurchasePriceInput,
        setLeaseLengthInput,
        setNoiAnnualInput,
        setCommissionInput,
        setMarketRentPsfInput,
        setBuildingSFInput,
        setLandSFInput,
        setCapGainRateInput,
        setIncomeTaxRateInput,
        setProbability1031Input,
        setTermCapInput,
        setAppreciationAndDepreciationDataInput,
        setRentalInfoDataInput,
        calculateInvestment,
        depreciationRate,
        setDepreciationRateInput,
        appreciationRate,
        setAppreciationRateInput,
        depreciationTerm,
        setDepreciationTermInput,
        investmentSummary,
        setInvestmentSummaryInput,
        customizedRentalInfo,
        setCustomizedRentalInfoInput,
        isAppartment,
        setIsAppartmentInput,
        appartmentVacancy,
        setAppartmentVacancyInput,
        appartmentUnits,
        setAppartmentUnitsInput,
        appartmentManagementFee,
        setAppartmentManagementFeeInput,
        isSale,
        setIsSaleInput,
        salePrice,
        setSalePriceInput,
        exitCapRate,
        setExitCapRateInput,
        isLoan,
        visibleDebt,
        setVisibleDebt,
        setIsLoanInput,
        loanAmount,
        setLoanAmountInput,
        loanAmountPercentage,
        loanRate,
        setLoanRateInput,
        loanTerm,
        setLoanTermInput,
        loanAmortizationTerm,
        setLoanAmortizationTermInput,
        // loanAmortizationFee,
        // setLoanAmortizationFeeInput,
        recurringExpensesData,
        setRecurringExpensesDataInput,
        nonRecurringExpensesData,
        repairsAndRenovationsData,
        setRepairsAndRenovationsDataInput,
        setNonRecurringExpensesDataInput,
        recurringExpenseSimple,
        setRecurringExpenseSimpleInput,
        nonRecurringExpenseSimple,
        setNonRecurringExpenseSimpleInput,
        calculatorPageErrors,
        isExpensesSimple,
        setIsExpensesSimpleInput,
        isAppreciationDepreciationSimple,
        setIsAppreciationDepreciationSimpleInput,
        clearAllInputErrorInCalculatorPage,
        leaseLengthUnit,
        setLeaseLengthUnitInput,
        loanAmortizationTermUnit,
        setLoanAmortizationTermUnitInput,
        loanTermUnit,
        setLoanTermUnitInput,
        appartmentManagementFeeUnit,
        setAppartmentManagementFeeUnitInput,
        validateAndSetSummary,
        getAllInputs,
        setDeal,
        dealInfo,
        setDealInfo,
        dealSharedToEmailArray,
        isSharedDeal,
        resetDealData,
        scrollRef,
        clearAllInputs,
        resetFormInputs,
        isLogarithmic,
        setIsLogarithmic,
        summaryPercent,
        setSummaryPercentSlider,
        investmentSummaryBreakdown,
      }}
    >
      {children}
    </InvestmentInputContext.Provider>
  )
}

export const useInvestmentInputContext = () => useContext(InvestmentInputContext)
