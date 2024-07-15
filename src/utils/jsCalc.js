import { irr } from 'node-irr'
import {
  isCurrencyValid,
  isRateValid,
  isNumberValid,
  unformatCurrency,
  formatCurrency,
  unformatRate,
  formatRate,
} from './inputFormatter'

//Cap Rate
const getCapRate = (purchasePrice, noiAnnual) => ((100 * noiAnnual) / purchasePrice).toFixed(2)

//Rent/SF
const getRentPsf = (noiAnnual, buildingSF) => (buildingSF ? noiAnnual / buildingSF : 0)

//Price/SF
const getPricePsf = (price, squareFeet) => (squareFeet ? price / squareFeet : 0)

// //Market Annual Rent
// const getAnnualMarketRent = (buildingSF, marketRentPsf) => {
//   if (!buildingSF || !marketRentPsf) return 0
//   return marketRentPsf * buildingSF
// }

// //Market Rent at End of Lease
// const getMarketRentEndOfLease = (annualMarketRent, leaseLength, landValueRate) =>
//   annualMarketRent * (1 + landValueRate) ** (leaseLength / 12)

//Capital Gain on Sale
const getCapGainOnSale = (salePrice, depreciations, purchasePrice) => {
  const depreciationsSum = depreciations.reduce((partialSum, nextDepreciation) => {
    return partialSum + nextDepreciation
  }, 0)
  return salePrice - purchasePrice + depreciationsSum
}

//Tax on Sale
const getTaxOnSale = (capGainOnSale, capGainRate) => capGainRate * capGainOnSale

//Value at end of Lease (after Commission)
// const getEndOfLeaseValue = (
//   purchasePrice,
//   leaseLength,
//   appreciationAndDepreciationData,
//   commission
// ) => {
//   if (appreciationAndDepreciationData.isSimpleVersion) {
//     const { /* depreciationRate, depreciationTerm, */ appreciationRate } =
//       appreciationAndDepreciationData
//     return purchasePrice * (1 + appreciationRate) ** (leaseLength / 12)
//   } else {
//     const {
//       improvementsFastAmount,
//       improvementsFastRate,
//       improvementsMedAmount,
//       improvementsMedRate,
//       improvementsSlowAmount,
//       improvementsSlowRate,
//       improvementsUndepriceAmount,
//       improvementsUndepriceRate,
//       landValueRate,
//     } = appreciationAndDepreciationData

//     const landValue =
//       purchasePrice -
//       improvementsFastAmount -
//       improvementsMedAmount -
//       improvementsSlowAmount -
//       improvementsUndepriceAmount
//     return (
//       (improvementsFastAmount * (1 + improvementsFastRate) ** (leaseLength / 12) +
//         improvementsMedAmount * (1 + improvementsMedRate) ** (leaseLength / 12) +
//         improvementsSlowAmount * (1 + improvementsSlowRate) ** (leaseLength / 12) +
//         improvementsUndepriceAmount * (1 + improvementsUndepriceRate) ** (leaseLength / 12) +
//         landValue * (1 + landValueRate) ** (leaseLength / 12)) *
//       (1 - commission)
//     )
//   }
// }

//Calculate Depreciation for every month
const getMonthlyDepreciations = (leaseLength, appreciationAndDepreciationData, purchasePrice) => {
  const depreciations = []
  if (appreciationAndDepreciationData.isAppreciationDepreciationSimple) {
    const { depreciationRate, depreciationTerm } = appreciationAndDepreciationData
    const depreciationAmount = purchasePrice * depreciationRate
    const monthlyDepreciation = depreciationAmount / (depreciationTerm * 12)
    for (let i = 0; i < leaseLength; i++) {
      depreciations.push(i < depreciationTerm ? monthlyDepreciation : 0)
    }
  } else {
    const {
      improvementsFastAmount,
      improvementsFastMonths,
      improvementsMedAmount,
      improvementsMedMonths,
      improvementsSlowAmount,
      improvementsSlowMonths,
    } = appreciationAndDepreciationData
    const depFast = improvementsFastAmount / improvementsFastMonths
    const depMed = improvementsMedAmount / improvementsMedMonths
    const depSlow = improvementsSlowAmount / improvementsSlowMonths
    let depAmount = depFast + depMed + depSlow
    for (let i = 1; i < leaseLength + 1; i++) {
      if (i > improvementsFastMonths && i <= improvementsMedMonths)
        depAmount =
          improvementsSlowAmount / improvementsSlowMonths +
          improvementsMedAmount / improvementsMedMonths
      if (i > improvementsMedMonths && i <= improvementsSlowMonths)
        depAmount = improvementsSlowAmount / improvementsSlowMonths
      depreciations.push(depAmount)
    }
  }
  return depreciations
}

// const NPV = (cashflow, salePrice, taxOnSale, leaseLengthInMonths) => {
//   const NPVcashflow = cashflow.map((payment, i) => {
//     return payment / (1 + IRRguess / 12) ** (i + 1)
//   })
//   const durationMonthlyPayments = NPVcashflow.map((payment, i) => {
//     return (payment * (i + 1)) / 12
//   })
//   const NPVMonthlyPayments = NPVcashflow.reduce((partialSum, nextPayment) => {
//     return partialSum + nextPayment
//   }, 0)
//   const NPVSale = salePrice / (1 + IRRguess / 12) ** leaseLengthInMonths
//   const NPVTaxOnSale =
//     (taxOnSale / (1 + IRRguess / 12) ** leaseLengthInMonths) * (1 - probability1031) +
//     (probability1031 * taxOnSale) / (1 + IRRguess / 12) ** (leaseLengthInMonths * 2)
//   const NPVTotal = NPVSale + NPVMonthlyPayments - NPVTaxOnSale
//   return NPVTotal
// }

// Excel & Sheets "traditional" IRR calculation
const getIRR = (cashflow) => {
  const monthlyIRR = irr(cashflow)
  return (1 + monthlyIRR) ** 12 - 1
}

// "traditional" NPV calculation https://www.investopedia.com/terms/n/npv.asp
const getNPV = (
  cashflow,
  investmentCost,
  salePrice,
  taxOnSale,
  leaseLengthInMonths,
  probability1031,
  annualDiscountRate
) => {
  // because cashflows are monthly, the discount rate must be converted to a monthly rate
  const discountRate = (1 + annualDiscountRate) ** (1 / 12) - 1

  // calculate NPV of each cashflow (map) and store their sum (reduce)
  const NPVMonthlyPayments = cashflow
    .map((payment, i) => {
      return payment / (1 + discountRate) ** i
    })
    .reduce((partialSum, nextPayment) => {
      return partialSum + nextPayment
    }, 0)

  // calculate NPV of sale price, and capital gains taxes
  const NPVSale = salePrice / (1 + discountRate) ** leaseLengthInMonths
  const NPVTaxOnSale =
    (taxOnSale / (1 + discountRate) ** leaseLengthInMonths) * (1 - probability1031) +
    (probability1031 * taxOnSale) / (1 + discountRate) ** (leaseLengthInMonths * 2)

  // return total of monthly rent + property terminal value, minus sales tax and initial investment costs
  return NPVMonthlyPayments + NPVSale - NPVTaxOnSale - investmentCost
}

// BOTN "logarithmic" IRR & NPV
const getIRRNPV = (
  cashflow,
  purchasePrice,
  salePrice,
  taxOnSale,
  leaseLengthInMonths,
  probability1031 = 0.5,
  IRRguess = 0.1,
  count = 1
) => {
  // map with calculations based on IRR guess
  const NPVcashflow = cashflow.map((payment, i) => {
    return payment / (1 + IRRguess / 12) ** (i + 1)
  })
  const durationMonthlyPayments = NPVcashflow.map((payment, i) => {
    return (payment * (i + 1)) / 12
  })
  const NPVMonthlyPayments = NPVcashflow.reduce((partialSum, nextPayment) => {
    return partialSum + nextPayment
  }, 0)
  const NPVSale = salePrice / (1 + IRRguess / 12) ** leaseLengthInMonths
  const NPVTaxOnSale =
    (taxOnSale / (1 + IRRguess / 12) ** leaseLengthInMonths) * (1 - probability1031) +
    (probability1031 * taxOnSale) / (1 + IRRguess / 12) ** (leaseLengthInMonths * 2)
  const NPVTotal = NPVSale + NPVMonthlyPayments - NPVTaxOnSale
  const duration =
    (durationMonthlyPayments.reduce((partialSum, nextPayment) => partialSum + nextPayment, 0) +
      (leaseLengthInMonths / 12) * (NPVSale - NPVTaxOnSale)) /
    NPVTotal
  const deltaIRR = Math.log(NPVTotal / purchasePrice) / duration

  // console.log('NPV count: ', count)
  // console.log('NPV Monthly Payments: ', NPVMonthlyPayments)
  // console.log('NPV Sale: ', NPVSale)
  // console.log('NPV Tax: ', NPVTaxOnSale)
  // console.log('NPV Total: ', NPVTotal)
  // console.log('NPV duration: ', duration, 'count: ', count)
  // console.log('NPV Delta IRR: ', deltaIRR)

  if (deltaIRR <= 0.00001 && deltaIRR >= -0.00001) {
    return { IRR: IRRguess, NPV: NPVTotal }
  } else if (count === 5) {
    return { IRR: IRRguess, NPV: NPVTotal }
  } else {
    const nextGuess = IRRguess + deltaIRR
    count++
    return getIRRNPV(
      cashflow,
      purchasePrice,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031,
      nextGuess,
      count
    )
  }
}



const getMonthlyPaymentsForSingleCustomer = (rentalInfoOfSingleCustomer, propertyHoldLength) => {
  let currentMonthlyPayments = rentalInfoOfSingleCustomer.cashflow
  const leaseLengthCurrentTenant = parseInt(rentalInfoOfSingleCustomer.leaseLength)
  const leaseStructure = rentalInfoOfSingleCustomer.leaseStructure
  const startTime = parseInt(rentalInfoOfSingleCustomer.startTime)
  if (leaseStructure == null) {
    return Array(startTime)
      .fill(0)
      .concat(Array(leaseLengthCurrentTenant).fill(currentMonthlyPayments))
  }

  leaseStructure?.sort((lease1, lease2) => {
    return lease1.startTime - lease2.startTime
  })
  let leaseStructureIndex = 0
  let monthlyPaymentsArray = []
  let cashflowPeriod = Math.min(leaseLengthCurrentTenant, propertyHoldLength)

  // startTime is already transformed to month value (year * 12 - 11)
  for (let i = 1; i < startTime; i++) {
    monthlyPaymentsArray.push(0)
  }

  /* if there aren't any rental increases (if leaseStructure array is empty)
  add monthly payments until either:
  the tenant lease ends OR the property hold period ends
  whichever comes first */
  if (leaseStructure.length == 0) {
    for (let i = 0; i < cashflowPeriod; i++) {
      monthlyPaymentsArray.push(currentMonthlyPayments)
    }
    return monthlyPaymentsArray
  } else {
    for (let i = 0; i < leaseStructure[0]?.startTime; i++) {
      monthlyPaymentsArray.push(currentMonthlyPayments)
    }
    for (let i = leaseStructure[0]?.startTime; i < cashflowPeriod; i++) {
      if (
        leaseStructureIndex + 1 == leaseStructure.length ||
        i < leaseStructure[leaseStructureIndex + 1].startTime
      ) {
        if (
          i - leaseStructure[leaseStructureIndex].startTime >= 0 &&
          (i - leaseStructure[leaseStructureIndex].startTime) %
            leaseStructure[leaseStructureIndex].frequency ==
            0
        ) {
          currentMonthlyPayments *= 1 + leaseStructure[leaseStructureIndex].rentIncrease
        }
      } else {
        leaseStructureIndex++
        currentMonthlyPayments *= 1 + leaseStructure[leaseStructureIndex].rentIncrease
      }
      monthlyPaymentsArray.push(currentMonthlyPayments)
    }
  }
  return monthlyPaymentsArray
}

const getMonthlyPaymentsAfterExpenses = (
  monthlyPaymentsArray,
  recurringExpenses,
  repairsAndRenovationsData
) => {
  console.log('pringo', repairsAndRenovationsData)
  if (repairsAndRenovationsData) {
    repairsAndRenovationsData?.forEach((singleRepair) => {
      if (singleRepair.frequency == 'month') {
        for (let i = 0; i < monthlyPaymentsArray.length; i++) {
          let range = singleRepair.when - 1
          if (i == range) {
            monthlyPaymentsArray[i] -= unformatCurrency(singleRepair.cost)
          }
        }
      } else {
        for (let i = 0; i < monthlyPaymentsArray.length; i++) {
          // year 1 => months 0 to 11
          // year 2 => months 12 to 23
          let range = singleRepair.when - 1
          if (i >= range * 12 && i < range * 12 + 12) {
            monthlyPaymentsArray[i] -= unformatCurrency(singleRepair.cost) / 12
          }
        }
      }
    })
    return monthlyPaymentsArray.map((monthlyPayment) => monthlyPayment - recurringExpenses)
  } else {
    return monthlyPaymentsArray.map((monthlyPayment) => monthlyPayment - recurringExpenses)
  }
}

const getSingleDebtPayment = (principleLoanAmount, loanRateInYears, amortizationTermInMonths) => {
  const loanRateInMonths = loanRateInYears / 12
  let onePlusRatePowerTerms = (1 + loanRateInMonths) ** amortizationTermInMonths

  return (
    principleLoanAmount * ((loanRateInMonths * onePlusRatePowerTerms) / (onePlusRatePowerTerms - 1))
  )
}

const getTotalMonthlyDebtPayments = (
  isLoan,
  principleLoanAmount,
  loanRateInYears,
  amortizationTermInMonths,
  leaseLength,
  loanTermInMonths,
  balloonPayment
) => {
  let debtPayment
  if (isLoan) {
    debtPayment = getSingleDebtPayment(
      principleLoanAmount,
      loanRateInYears,
      amortizationTermInMonths
    )
  } else {
    debtPayment = 0
  }
  const debtPaymentsArray = []
  for (let i = 0; i < loanTermInMonths; i++) {
    debtPaymentsArray.push(debtPayment)
  }
  if (balloonPayment) {
    debtPaymentsArray[debtPaymentsArray.length - 1] += balloonPayment
  }
  return debtPaymentsArray
}

const getBalloonPayment = (
  isLoan,
  principleLoanAmount,
  amortizationTermInMonths,
  loanTermInMonths,
  loanRateInYears
) => {
  if (!isLoan) {
    return 0
  }
  const loanRateInMonths = loanRateInYears / 12
  const onePlusRatePowerLoanTerms = (1 + loanRateInMonths) ** loanTermInMonths
  const singleDebtPayment = getSingleDebtPayment(
    principleLoanAmount,
    loanRateInYears,
    amortizationTermInMonths
  )
  return (
    principleLoanAmount * onePlusRatePowerLoanTerms -
    singleDebtPayment * ((onePlusRatePowerLoanTerms - 1) / loanRateInMonths)
  )
}

const getMonthlyPaymentsArrayForLIRR = (monthlyPaymentsAfterExpensesArray, debtPaymentsArray) => {
  const monthlyPaymentsAfterExpensesArrayLength = monthlyPaymentsAfterExpensesArray.length
  const debtPaymentsArrayLength = debtPaymentsArray.length
  const arrLength = Math.max(monthlyPaymentsAfterExpensesArrayLength, debtPaymentsArrayLength)
  const monthlyPaymentsArrayForLIRR = []
  for (let i = 0; i < arrLength; i++) {
    monthlyPaymentsArrayForLIRR.push(
      (monthlyPaymentsAfterExpensesArray[i] !== undefined
        ? monthlyPaymentsAfterExpensesArray[i]
        : 0) - (debtPaymentsArray[i] !== undefined ? debtPaymentsArray[i] : 0)
    )
  }
  return monthlyPaymentsArrayForLIRR
}

const getMonthlyPaymentsArrayForIRRWithTax = (
  monthlyPaymentsArray,
  monthlyPaymentsAfterExpensesArray,
  DepreciationMonthlyArray,
  incomeTaxRate
) => {
  const monthlyPaymentsForIRRWithTax = []
  for (let i = 0; i < monthlyPaymentsArray.length; i++) {
    const resultPayment =
      monthlyPaymentsAfterExpensesArray[i] -
      (monthlyPaymentsArray[i] - DepreciationMonthlyArray[i]) * incomeTaxRate
    monthlyPaymentsForIRRWithTax.push(resultPayment)
  }
  return monthlyPaymentsForIRRWithTax
}

const getMonthlyPaymentsArrayForLIRRWithTax = (
  monthlyPaymentsArrayForIRRWithTax,
  debtPaymentsArray
) => {
  const monthlyPaymentsForLIRRWithTax = []
  const monthlyPaymentsArrayForIRRWithTaxLength = monthlyPaymentsArrayForIRRWithTax.length
  const debtPaymentsArrayLength = debtPaymentsArray.length
  const arrLength = Math.max(monthlyPaymentsArrayForIRRWithTaxLength, debtPaymentsArrayLength)
  for (let i = 0; i < arrLength; i++) {
    monthlyPaymentsForLIRRWithTax.push(
      (monthlyPaymentsArrayForIRRWithTax[i] !== undefined
        ? monthlyPaymentsArrayForIRRWithTax[i]
        : 0) - (debtPaymentsArray[i] !== undefined ? debtPaymentsArray[i] : 0)
    )
  }
  return monthlyPaymentsForLIRRWithTax
}

const getIRRArray = (monthlyPaymentsArray, initialCosts, finalPayment, leaseLengthInMonths) => {
  const IRRArray = monthlyPaymentsArray ? [...monthlyPaymentsArray] : null
  IRRArray.unshift(-initialCosts)
  if (leaseLengthInMonths + 1 < IRRArray.length) {
    IRRArray[leaseLengthInMonths + 1] += finalPayment
  } else {
    IRRArray.push(finalPayment)
  }
  return IRRArray
}

// get first year NOI (used for calculating Cap Rate)
const getFirstYearTotal = (monthlyPayments) => {
  let firstYearSum = 0
  // Only add the first 12 monthly payments (0 to 11)
  for (let i = 0; i < 12; i++) {
    firstYearSum += monthlyPayments[i]
  }
  return firstYearSum
}

// const getAnnualIncomeAfterExpenses = (monthlyPaymentsAfterExpenses) => {
//   let totalPayments = getTotal(monthlyPaymentsAfterExpenses)
//   const totalYears = monthlyPaymentsAfterExpenses.length / 12
//   return totalPayments / totalYears
// }

const getTotal = (array) => {
  return array.reduce((acc, item) => acc + item, 0)
}

const getCashOnCash = (preTaxCashFlows, totalPurchasePrice, loanAmount) => {
  let downPayment = loanAmount - totalPurchasePrice
  if (downPayment === 0) return null
  let oneYearCashFlow = 0
  for (let i = 0; i < 12; i++) {
    oneYearCashFlow += preTaxCashFlows[i]
  }
  return oneYearCashFlow / downPayment
}

const calculateInvestmentUtil = ({
  originalPurchasePrice,
  purchasePrice,
  leaseLengthInMonths,
  transformedRentalInfo,
  recurringExpense,
  // nonRecurringExpense,
  repairsAndRenovationsData,
  saleData,
  commission,
  buildingSF,
  landSF,
  capGainRate,
  incomeTaxRate,
  probability1031,
  loanData,
  // appartmentVacancyCost,
  // appartmentManagementFee,
  appartmentUnits,
  appreciationAndDepreciationData,
  noiAnnual,
  marketRentPsf,
  isLogarithmic,
}) => {
  const {
    isLoan,
    loanAmount,
    loanRatePerYear,
    loanTermInMonths,
    loanAmortizationTermInMonths /* loanAmortizationFee */,
  } = loanData
  const downPayment = purchasePrice - loanAmount;

  const monthlyPaymentsArrayOfAllTenants = []
  for (let singleTenantInfo of transformedRentalInfo) {
    const monthlyPaymentsOfSingleTenant = getMonthlyPaymentsForSingleCustomer(
      singleTenantInfo,
      leaseLengthInMonths
    )
    monthlyPaymentsArrayOfAllTenants.push(monthlyPaymentsOfSingleTenant)
  }

  // aggregate each tenant's monthly payment into a single array representing total monthly payment receivables
  const monthlyPaymentsArray = []
  for (let i = 0; i < leaseLengthInMonths; i++) {
    let currentMonthlyPayment = 0
    for (let j = 0; j < monthlyPaymentsArrayOfAllTenants.length; j++) {
      if (monthlyPaymentsArrayOfAllTenants[j][i] != null) {
        currentMonthlyPayment += monthlyPaymentsArrayOfAllTenants[j][i]
      }
    }
    monthlyPaymentsArray.push(currentMonthlyPayment)
    currentMonthlyPayment = 0
  }

  const depreciations = getMonthlyDepreciations(
    leaseLengthInMonths,
    appreciationAndDepreciationData,
    originalPurchasePrice
  )

  const monthlyPaymentsAfterExpensesArray = getMonthlyPaymentsAfterExpenses(
    monthlyPaymentsArray,
    recurringExpense,
    repairsAndRenovationsData
  )

  let salePrice = 0
  // Calculate sale price
  if (saleData.isSale) {
    // sale price provided by user
    if (saleData.salePrice) {
      salePrice = saleData.salePrice
      // exit cap rate provided by user
    } else {
      /* When exit cap rate is provided by the user, there are two ways to calculate the sale price
      One for a lack of  NOI (1), and another which considers real rental NOI (2) */

      /* 1. first, calculate annual market rent
      then, appreciate the annual market rent by either the land appreciation rate, or simple appreciation rate
      finally, sale price = terminal year Market Rent / exit cap rate */
      if (noiAnnual === 0) {
        let marketRent = marketRentPsf * buildingSF
        let terminalMarketRent = marketRent *
          (1 + (appreciationAndDepreciationData.landValueRate || appreciationAndDepreciationData.appreciationRate))
          ** (leaseLengthInMonths / 12)
        salePrice = terminalMarketRent / saleData.exitCapRate
        /* 2. set sale price equal to terminal NOI / the exit cap rate */
      } else {
        salePrice =
          (monthlyPaymentsAfterExpensesArray[monthlyPaymentsAfterExpensesArray.length - 1] * 12) /
          saleData.exitCapRate
      }
    }
  } else {
    if (appreciationAndDepreciationData.isAppreciationDepreciationSimple) {
      salePrice =
        purchasePrice *
        (1 + appreciationAndDepreciationData.appreciationRate) ** (leaseLengthInMonths / 12)
    } else {
      const {
        improvementsFastAmount,
        improvementsMedAmount,
        improvementsSlowAmount,
        improvementsFastRate,
        improvementsMedRate,
        improvementsSlowRate,
        improvementsUndepriceAmount,
        improvementsUndepriceRate,
        landValueRate,
      } = appreciationAndDepreciationData
      const landValue =
        originalPurchasePrice -
        improvementsFastAmount -
        improvementsSlowAmount -
        improvementsMedAmount -
        improvementsUndepriceAmount
      const improvementsFastAppreciation =
        improvementsFastAmount * (1 + improvementsFastRate) ** (leaseLengthInMonths / 12)
      const improvementsMedAppreciation =
        improvementsMedAmount * (1 + improvementsMedRate) ** (leaseLengthInMonths / 12)
      const improvementsSlowAppreciation =
        improvementsSlowAmount * (1 + improvementsSlowRate) ** (leaseLengthInMonths / 12)
      const improvementsUndepriceAppreciation =
        improvementsUndepriceAmount * (1 + improvementsUndepriceRate) ** (leaseLengthInMonths / 12)
      salePrice =
        improvementsFastAppreciation +
        improvementsMedAppreciation +
        improvementsSlowAppreciation +
        improvementsUndepriceAppreciation +
        landValue * (1 + landValueRate) ** (leaseLengthInMonths / 12)
    }
  }

  salePrice *= 1 - commission
  const terminalPropertyValue = salePrice
  const capOnSale = getCapGainOnSale(salePrice, depreciations, purchasePrice)
  const taxOnSale = getTaxOnSale(capOnSale, capGainRate)
  const finalSalePriceWithTaxesWithoutDebt = terminalPropertyValue - taxOnSale

  let IRR_Value,
    NPV_Value,
    LIRR_Value,
    LNPV_Value,
    IRR_After_Tax,
    NPV_After_Tax,
    LIRR_After_Tax,
    LNPV_After_Tax
  if (isLogarithmic) {
    ;({ IRR: IRR_Value, NPV: NPV_Value } = getIRRNPV(
      monthlyPaymentsAfterExpensesArray,
      downPayment,
      salePrice,
      0,
      leaseLengthInMonths,
      probability1031
    ))
  } else {
    const monthlyPaymentsAfterExpensesArrayWithCosts = getIRRArray(
      monthlyPaymentsAfterExpensesArray,
      downPayment,
      salePrice,
      leaseLengthInMonths
    )
    IRR_Value = getIRR(monthlyPaymentsAfterExpensesArrayWithCosts)
    NPV_Value = getNPV(
      monthlyPaymentsAfterExpensesArrayWithCosts,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031,
      IRR_Value
    )
  }

  // get Metrics section
  const balloonPayment = getBalloonPayment(
    isLoan,
    loanAmount,
    loanAmortizationTermInMonths,
    loanTermInMonths,
    loanRatePerYear
  )
  const debtPaymentsArray = getTotalMonthlyDebtPayments(
    isLoan,
    loanAmount,
    loanRatePerYear,
    loanAmortizationTermInMonths,
    leaseLengthInMonths,
    loanTermInMonths,
    balloonPayment
  )
  const monthlyPaymentsArrayForLIRR = getMonthlyPaymentsArrayForLIRR(
    monthlyPaymentsAfterExpensesArray,
    debtPaymentsArray
  )

  if (isLogarithmic) {
    ;({ IRR: LIRR_Value, NPV: LNPV_Value } = getIRRNPV(
      monthlyPaymentsArrayForLIRR,
      downPayment,
      salePrice,
      0,
      leaseLengthInMonths,
      probability1031
    ))
  } else {
    const monthlyPaymentsForTradLIRR = getIRRArray(
      monthlyPaymentsArrayForLIRR,
      downPayment,
      terminalPropertyValue,
      leaseLengthInMonths
    )
    LIRR_Value = getIRR(monthlyPaymentsForTradLIRR)
    LNPV_Value = getNPV(
      monthlyPaymentsForTradLIRR,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031,
      LIRR_Value
    )
  }

  const monthlyPaymentsArrayForIRRWithTax = getMonthlyPaymentsArrayForIRRWithTax(
    monthlyPaymentsArray,
    monthlyPaymentsAfterExpensesArray,
    depreciations,
    incomeTaxRate
  )

  // const endOfLeaseValue = getEndOfLeaseValue(
  //   downPayment,
  //   leaseLengthInMonths,
  //   appreciationAndDepreciationData,
  //   commission
  // )

  if (isLogarithmic) {
    ;({ IRR: IRR_After_Tax, NPV: NPV_After_Tax } = getIRRNPV(
      monthlyPaymentsArrayForIRRWithTax,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031
    ))
  } else {
    const monthlyPaymentsForAfterTaxTradIRR = getIRRArray(
      monthlyPaymentsArrayForIRRWithTax,
      downPayment,
      finalSalePriceWithTaxesWithoutDebt,
      leaseLengthInMonths
    )
    IRR_After_Tax = getIRR(monthlyPaymentsForAfterTaxTradIRR)
    NPV_After_Tax = getNPV(
      monthlyPaymentsForAfterTaxTradIRR,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031,
      IRR_After_Tax
    )
  }

  const monthlyPaymentsArrayForLIRRWithTax = getMonthlyPaymentsArrayForLIRRWithTax(
    monthlyPaymentsArrayForIRRWithTax,
    debtPaymentsArray
  )

  if (isLogarithmic) {
    ;({ IRR: LIRR_After_Tax, NPV: LNPV_After_Tax } = getIRRNPV(
      monthlyPaymentsArrayForLIRRWithTax,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031
    ))
  } else {
    const monthlyPaymentsArrayForAfterTaxTradLIRR = getIRRArray(
      monthlyPaymentsArrayForLIRRWithTax,
      downPayment,
      finalSalePriceWithTaxesWithoutDebt,
      leaseLengthInMonths
    )
    LIRR_After_Tax = getIRR(monthlyPaymentsArrayForAfterTaxTradLIRR)
    LNPV_After_Tax = getNPV(
      monthlyPaymentsArrayForAfterTaxTradLIRR,
      downPayment,
      salePrice,
      taxOnSale,
      leaseLengthInMonths,
      probability1031,
      LIRR_After_Tax
    )
  }

  const initialGrossRevenue = getFirstYearTotal(monthlyPaymentsArray)
  const firstYearExpenses = recurringExpense * 12
  const initialNetOperatingIncome = getFirstYearTotal(monthlyPaymentsAfterExpensesArray)
  // const annualNetOperatingIncome = getAnnualIncomeAfterExpenses(monthlyPaymentsAfterExpensesArray)
  const cashOnCash = getCashOnCash(monthlyPaymentsArrayForLIRR, purchasePrice, loanAmount)
  const profit = salePrice + getTotal(monthlyPaymentsArrayForLIRRWithTax) - purchasePrice
  const totalAllMonthlyPayments = getTotal(monthlyPaymentsArray)
  const totalAllMonthlyPaymentsAfterExpenses = getTotal(monthlyPaymentsAfterExpensesArray)
  const totalAllDebtPayments = getTotal(debtPaymentsArray)
  const ROI = (salePrice - purchasePrice) / purchasePrice
  const GRM = purchasePrice / (totalAllMonthlyPayments / monthlyPaymentsArray.length)
  const capRate = getCapRate(purchasePrice, initialNetOperatingIncome)
  const rpsf = getRentPsf(initialNetOperatingIncome / 12, buildingSF)
  const annualRpsf = rpsf * 12
  const BuildingPricePerSF = getPricePsf(purchasePrice, buildingSF)
  const LandPricePerSF = getPricePsf(purchasePrice, landSF)
  // const DCR = annualNetOperatingIncome / (12 * debtPaymentsArray[1])
  // const LTV = loanAmount / purchasePrice
  // const annualMarketRent = getAnnualMarketRent(buildingSF, marketRentPsf)
  // const endOfLeaseMarketRent = getMarketRentEndOfLease(
  //   annualMarketRent,
  //   leaseLengthInMonths,
  //   appreciationAndDepreciationData.landValueRate
  // )
  // OPEX Ratio = (Annual Operating Expenses - Depreciation) / Gross Revenue
  const OpexRatio = firstYearExpenses / initialGrossRevenue
  const CapitalGains = salePrice / purchasePrice
  const ExpensePsfBuilding = getPricePsf(firstYearExpenses, buildingSF)
  // Payback Period = Cost of Investment / Average Annual Cash Flow
  const PaybackPeriod = purchasePrice / (totalAllMonthlyPayments / (leaseLengthInMonths / 12))
  // Equity Multiple = Total Distributions / Total Invested Capital
  const equityMultiple = (
    (salePrice + totalAllMonthlyPaymentsAfterExpenses - totalAllDebtPayments) /
    purchasePrice
  ).toFixed(2)

  return {
    IRR: formatRate(IRR_Value * 100),
    LeveredIRR: formatRate(LIRR_Value * 100),
    AfterTaxIRR: formatRate(IRR_After_Tax * 100),
    AfterTaxLeveredIRR: formatRate(LIRR_After_Tax * 100),
    NPV: formatCurrency(LNPV_Value ? LNPV_Value : NPV_Value),
    AfterTaxNPV: formatCurrency(LNPV_After_Tax ? LNPV_After_Tax : NPV_After_Tax),
    CashOnCash: cashOnCash ? formatRate(cashOnCash * 100) : 'N/A',
    CapRate: formatRate(capRate),
    Profit: formatCurrency(profit),
    CapitalGains,
    MonthlyDebt: debtPaymentsArray[0] ? formatCurrency(debtPaymentsArray[0]) : 'N/A',
    AnnualDebt: debtPaymentsArray[0] ? formatCurrency(debtPaymentsArray[0] * 12) : 'N/A',
    BalloonPayment: balloonPayment ? formatCurrency(balloonPayment) : 'N/A',
    PaybackPeriod: PaybackPeriod.toFixed(2),
    ROI: formatRate(ROI * 100),
    GRM: GRM.toFixed(2),
    monthlyPaymentsAfterExpensesArray,
    OpexRatio,
    AnnualExpenses: formatCurrency(firstYearExpenses),
    RentPerSF: rpsf,
    AnnualRentPerSF: annualRpsf,
    BuildingPricePerSF: BuildingPricePerSF ? BuildingPricePerSF : 'Input SF Value',
    LandPricePerSF: LandPricePerSF ? LandPricePerSF : 'Provide SF Value',
    ExpensePsfBuilding: ExpensePsfBuilding ? formatCurrency(ExpensePsfBuilding) : 'N/A',
    CostPerDoor: appartmentUnits > 1 ? formatCurrency(purchasePrice / appartmentUnits) : 'N/A',
    ExpensePerDoor:
      appartmentUnits > 1 ? formatCurrency(firstYearExpenses / appartmentUnits) : 'N/A',
    EquityMultiple: equityMultiple,
  }
}

const getRentIncreaseFrequency = (howOften) => {
  switch (howOften) {
    case 'annual':
      return 12
    case 'semi annual':
      return 6
    case 'two annual':
      return 24
    case 'three annual':
      return 36
    case 'four annual':
      return 48
    case 'five annual':
      return 60
    case 'ten annual':
      return 120
    case 'only once':
      return Number.MAX_SAFE_INTEGER
    default:
      return 3
  }
}

export const getTransformedDataForCalculator = (
  purchasePrice,
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
  /* loanAmortizationFee, */ depreciationRate,
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
) => {

  let purchasePriceTransformed = unformatCurrency(purchasePrice)
  let leaseLengthInMonths = leaseLengthUnit === 'years' ? leaseLength * 12 : leaseLength
  let annualRentIncreasesTransformed = unformatRate(annualRentIncreases) / 100
  let transformedRentalInfo =
    customizedRentalInfo != null && customizedRentalInfo != undefined
      ? JSON.parse(JSON.stringify(customizedRentalInfo))
      : null
  let noiAnnualTransformed = unformatCurrency(noiAnnual)
  const appartmentVacancyRateTransformed =
    isAppartment && isRateValid(appartmentVacancy) ? unformatRate(appartmentVacancy) / 100 : 0

  if (customizedRentalInfo?.length > 0) {
    transformedRentalInfo = transformedRentalInfo.map((tenantItem) => {
      tenantItem.cashflow =
        tenantItem.cashflowUnit === 'months'
          ? unformatCurrency(tenantItem.cashflow)
          : unformatCurrency(tenantItem.cashflow) / 12

      // calculate vacancy loss and subtract from cashflow
      const appartmentVacancyInDollars = tenantItem.cashflow * appartmentVacancyRateTransformed
      tenantItem.cashflow = tenantItem.cashflow - appartmentVacancyInDollars

      tenantItem.leaseLength =
        tenantItem.leaseLengthUnit === 'months'
          ? tenantItem.leaseLength
          : tenantItem.leaseLength * 12
      tenantItem.startTime =
        tenantItem.startTimeUnit === 'months'
          ? tenantItem.startTime
          : tenantItem.startTime * 12 - 11
      tenantItem?.leaseStructure?.map((leaseStructureItem) => {
        leaseStructureItem.frequency = getRentIncreaseFrequency(leaseStructureItem.howOften)
        leaseStructureItem.rentIncrease = unformatRate(leaseStructureItem.rentIncrease) / 100
        leaseStructureItem.startTime =
          leaseStructureItem.startTimeUnit === 'months'
            ? leaseStructureItem.startTime
            : leaseStructureItem.startTime * 12
        return leaseStructureItem
      })
      return tenantItem
    })

    // Convert management fee percentage into dollar amount and add to recurring expense data array
    if (appartmentManagementFeeUnit === 'percent') {
      recurringExpensesData.managementFee =
        transformedRentalInfo.reduce((sum, currentTenant) => {
          return sum + currentTenant.cashflow
        }, 0) *
        (appartmentManagementFee / 100)
    }
  } else {
    const appartmentVacancyInDollars =
      (noiAnnualTransformed / 12) * appartmentVacancyRateTransformed

    transformedRentalInfo = [
      {
        cashflow: noiAnnualTransformed / 12 - appartmentVacancyInDollars,
        leaseLength: leaseLengthInMonths,
        leaseStructure: [
          {
            startTime: 13,
            frequency: 12,
            rentIncrease: annualRentIncreasesTransformed,
          },
        ],
      },
    ]
  }

  let recurringExpenseTransformed = 0
  let nonRecurringExpenseTransformed = 0
  // let repairsAndRenovationsTransformed = 0
  if (isExpensesSimple) {
    if (isCurrencyValid(recurringExpenseSimple)) {
      recurringExpenseTransformed = unformatCurrency(recurringExpenseSimple)
    }
    if (isCurrencyValid(nonRecurringExpenseSimple)) {
      nonRecurringExpenseTransformed = unformatCurrency(nonRecurringExpenseSimple)
    }
  } else {
    if (recurringExpensesData != null) {
      const {
        propertyTaxUnit,
        propertyTax,
        insurance,
        maintenance,
        managementFee,
        customisedRecurringExpenses,
      } = recurringExpensesData
      if (propertyTaxUnit === 'rate' && isRateValid(propertyTax)) {
        recurringExpenseTransformed += (purchasePriceTransformed * unformatRate(propertyTax)) / 100
      }

      if (propertyTaxUnit === 'dollar' && isCurrencyValid(propertyTax)) {
        recurringExpenseTransformed += unformatCurrency(propertyTax)
      }

      if (isCurrencyValid(insurance)) {
        recurringExpenseTransformed += unformatCurrency(insurance)
      }

      if (isCurrencyValid(maintenance)) {
        recurringExpenseTransformed += unformatCurrency(maintenance)
      }

      if (isCurrencyValid(managementFee)) {
        recurringExpenseTransformed += unformatCurrency(managementFee)
      }

      customisedRecurringExpenses?.forEach((recurringExpenseItem) => {
        if (isCurrencyValid(recurringExpenseItem.value)) {
          recurringExpenseTransformed += unformatCurrency(recurringExpenseItem.value)
        }
      })
    }

    if (nonRecurringExpensesData != null) {
      const { otherClosingCosts, legalFees } = nonRecurringExpensesData
      if (isCurrencyValid(otherClosingCosts)) {
        nonRecurringExpenseTransformed += unformatCurrency(otherClosingCosts)
      }

      if (isCurrencyValid(legalFees)) {
        nonRecurringExpenseTransformed += unformatCurrency(otherClosingCosts)
      }
    }

    // if (repairsAndRenovationsData != null) {
    //   repairsAndRenovationsData?.forEach((repairsAndRenovationsItem) => {
    //     if (isCurrencyValid(repairsAndRenovationsItem.cost)) {
    //       repairsAndRenovationsTransformed += unformatCurrency(repairsAndRenovationsItem.cost)
    //     }
    //   })
    // }
  }

  appartmentManagementFee =
    isAppartment && isCurrencyValid(appartmentManagementFee)
      ? unformatCurrency(appartmentManagementFee)
      : 0

  const transformedAppreciationAndDepreciationData =
    appreciationAndDepreciationData != null
      ? JSON.parse(JSON.stringify(appreciationAndDepreciationData))
      : {}
  if (isAppreciationDepreciationSimple) {
    transformedAppreciationAndDepreciationData.isAppreciationDepreciationSimple = true
    transformedAppreciationAndDepreciationData.depreciationRate = isRateValid(depreciationRate)
      ? unformatRate(depreciationRate) / 100
      : 0
    transformedAppreciationAndDepreciationData.depreciationTerm = isNumberValid(depreciationTerm)
      ? depreciationTerm
      : 0
    transformedAppreciationAndDepreciationData.appreciationRate = isRateValid(appreciationRate)
      ? unformatRate(appreciationRate) / 100
      : 0
  } else {
    transformedAppreciationAndDepreciationData.isAppreciationDepreciationSimple = false
    transformedAppreciationAndDepreciationData.improvementsFastAmount = unformatCurrency(
      appreciationAndDepreciationData.improvementsFastAmount
    )
    transformedAppreciationAndDepreciationData.improvementsMedAmount = unformatCurrency(
      appreciationAndDepreciationData.improvementsMedAmount
    )
    transformedAppreciationAndDepreciationData.improvementsSlowAmount = unformatCurrency(
      appreciationAndDepreciationData.improvementsSlowAmount
    )
    transformedAppreciationAndDepreciationData.improvementsFastRate =
      unformatRate(appreciationAndDepreciationData.improvementsFastRate) / 100
    transformedAppreciationAndDepreciationData.improvementsMedRate =
      unformatRate(appreciationAndDepreciationData.improvementsMedRate) / 100
    transformedAppreciationAndDepreciationData.improvementsSlowRate =
      unformatRate(appreciationAndDepreciationData.improvementsSlowRate) / 100
    transformedAppreciationAndDepreciationData.improvementsUndepriceAmount = unformatCurrency(
      appreciationAndDepreciationData.improvementsUndepriceAmount
    )
    transformedAppreciationAndDepreciationData.improvementsUndepriceRate =
      unformatRate(appreciationAndDepreciationData.improvementsUndepriceRate) / 100
    transformedAppreciationAndDepreciationData.landValueRate =
      unformatRate(appreciationAndDepreciationData.landValueRate) / 100
    transformedAppreciationAndDepreciationData.improvementsFastMonths = parseInt(
      appreciationAndDepreciationData.improvementsFastMonths
    )
    transformedAppreciationAndDepreciationData.improvementsMedMonths = parseInt(
      appreciationAndDepreciationData.improvementsMedMonths
    )
    transformedAppreciationAndDepreciationData.improvementsSlowMonths = parseInt(
      appreciationAndDepreciationData.improvementsSlowMonths
    )
  }

  const saleData = {
    isSale,
    salePrice: unformatCurrency(salePrice),
    exitCapRate: isRateValid(exitCapRate) ? unformatRate(exitCapRate) / 100 : 0,
  }

  const commissionTransformed = isRateValid(commission) ? unformatRate(commission) / 100 : 0
  const marketRentPsfTransformed = unformatCurrency(marketRentPsf)
  const buildingSFTransformed = unformatCurrency(buildingSF)
  const landSFTransformed = unformatCurrency(landSF)
  const capGainRateTransformed = isRateValid(capGainRate) ? unformatRate(capGainRate) / 100 : 0
  const incomeTaxRateTransformed = isRateValid(incomeTaxRate)
    ? unformatRate(incomeTaxRate) / 100
    : 0
  const probability1031Transformed = isRateValid(probability1031)
    ? unformatRate(probability1031) / 100
    : 0 //More 6
  const loanData = {
    isLoan,
  }
  if (isLoan) {
    loanData.loanAmount = unformatCurrency(loanAmount)
    loanData.loanRatePerYear = unformatRate(loanRate) / 100
    loanData.loanTermInMonths = loanTermUnit === 'months' ? loanTerm : loanTerm * 12
    loanData.loanAmortizationTermInMonths =
      loanAmortizationTermUnit === 'months' ? loanAmortizationTerm : loanAmortizationTerm * 12
    // loanData.loanAmortizationFee = unformatRate(loanAmortizationFee)
  } else {
    loanData.loanAmount = 0
    loanData.loanRatePerYear = 0
    loanData.loanTermInMonths = 0
    loanData.loanAmortizationTermInMonths = 0
    // loanData.loanAmortizationFee = 0
  }
  const originalPurchasePrice = purchasePriceTransformed
  purchasePriceTransformed = purchasePriceTransformed + nonRecurringExpenseTransformed
  // noiAnnualTransformed = noiAnnualTransformed * (1 - appartmentVacancyRate)

  return {
    originalPurchasePrice,
    purchasePrice: purchasePriceTransformed,
    leaseLengthInMonths: parseInt(leaseLengthInMonths),
    transformedRentalInfo,
    recurringExpense: recurringExpenseTransformed / 12,
    nonRecurringExpense: nonRecurringExpenseTransformed,
    repairsAndRenovationsData,
    saleData,
    commission: commissionTransformed,
    buildingSF: buildingSFTransformed,
    landSF: landSFTransformed,
    capGainRate: capGainRateTransformed,
    incomeTaxRate: incomeTaxRateTransformed,
    probability1031: probability1031Transformed,
    loanData,
    appartmentManagementFee,
    appartmentUnits,
    appreciationAndDepreciationData: transformedAppreciationAndDepreciationData,
    noiAnnual: noiAnnualTransformed,
    marketRentPsf: marketRentPsfTransformed,
    isLogarithmic,
  }
}

export default calculateInvestmentUtil
