//Cap Rate
const getCapRate = (purchasePrice = 12000000, noiAnnual = 1000000) =>
  ((100 * noiAnnual) / purchasePrice).toFixed(2)

//Rent/SF
const getRentPsf = (noiAnnual = 1000000, buildingSF = 100000) => noiAnnual / buildingSF

//Price/SF
const getPricePsf = (purchasePrice = 12000000, buildingSF = 100000) => purchasePrice / buildingSF

//Land/SF
const getLandPsf = (purchasePrice = 12000000, landSF = 161608) => purchasePrice / landSF

//Market Annual Rent
const getAnnualMarketRent = (buildingSF = 100000, marketRentPsf = 10) => marketRentPsf * buildingSF

//Market Rent at End of Lease
const getMarketRentEndOfLease = (annualMarketRent, leaseLength = 120, landValueRate = 0.02) =>
  annualMarketRent * (1 + landValueRate) ** (leaseLength / 12)

//Terminal Market Value from Cap
const getTermMarketValueFromCap = (endOfLeaseMarketRent, termCap = 10) =>
  endOfLeaseMarketRent / (termCap / 100)

//Capital Gain on Sale
const getCapGainOnSale = (endOfLeaseValue, depreciations, purchasePrice = 12000000) => {
  const depreciationSum = depreciations.reduce((a, b) => a + b, 0)

  return endOfLeaseValue - purchasePrice + depreciationSum
}

//Tax on Sale
const getTaxOnSale = (capGainOnSale, capGainRate = 0.35) => capGainRate * capGainOnSale

//Value at end of Lease (after Commission)
const getEndOfLeaseValue = (
  purchasePrice = 12000000,
  leaseLength = 120,
  improvementsFastAmount = 100000,
  improvementsFastRate = 0.015,
  improvementsMedAmount = 10000,
  improvementsMedRate = 0.015,
  improvementsSlowAmount = 350000,
  improvementsSlowRate = 0.015,
  improvementsUndepriceAmount = 0,
  improvementsUndepriceRate = 0.015,
  landValueRate = 0.02,
  commission = 0.03
) => {
  const landValue =
    purchasePrice -
    improvementsFastAmount -
    improvementsMedAmount -
    improvementsSlowAmount -
    improvementsUndepriceAmount

  return (
    (improvementsFastAmount * (1 + improvementsFastRate) ** (leaseLength / 12) +
      improvementsMedAmount * (1 + improvementsMedRate) ** (leaseLength / 12) +
      improvementsSlowAmount * (1 + improvementsSlowRate) ** (leaseLength / 12) +
      improvementsUndepriceAmount * (1 + improvementsUndepriceRate) ** (leaseLength / 12) +
      landValue * (1 + landValueRate) ** (leaseLength / 12)) *
    (1 - commission)
  )
}

//Calculate monthly payment for every month
const getMonthlyPayments = (
  noiAnnual = 1000000,
  leaseLength = 120,
  startMonth1 = 13,
  startMonth2 = 25,
  startMonth3 = 49,
  freq1 = 12,
  freq2 = 12,
  freq3 = 12,
  increase1 = 1.03,
  increase2 = 1.02,
  increase3 = 1.1
) => {
  const monthlyPayments = []
  let monthlyPayment = noiAnnual / 12

  for (let i = 1; i < leaseLength + 1; i++) {
    if (i >= startMonth1 && i < startMonth2 && i % freq1 === startMonth1 % freq1) {
      monthlyPayment = monthlyPayment * increase1
    } else if (i >= startMonth2 && i < startMonth3 && i % freq2 == startMonth2 % freq2) {
      monthlyPayment = monthlyPayment * increase2
    } else if (i >= startMonth3 && i % freq3 == startMonth2 % freq3) {
      monthlyPayment = monthlyPayment * increase3
    }
    monthlyPayments.push(monthlyPayment)
  }

  return monthlyPayments
}

//Calculate Depreciation for every month
const getMonthlyDepreciations = (
  leaseLength = 120,
  improvementsFastAmount = 100000,
  improvementsFastMonths = 20,
  improvementsMedAmount = 10000,
  improvementsMedMonths = 60,
  improvementsSlowAmount = 350000,
  improvementsSlowMonths = 468
) => {
  const depreciations = []

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

  return depreciations
}

const NPV = (cashflow, discountRate) =>
  cashflow.reduce((acc, val, i) => acc + val / Math.pow(1 + discountRate, i), 0)

const IRR = (cashflow, initialGuess = 0.1) => {
  const maxTries = 10000
  const delta = 0.0001
  let guess = initialGuess
  const multiplier = NPV(cashflow, guess) > 0 ? 1 : -1
  let i = 0
  while (i < maxTries) {
    const guessedNPV = NPV(cashflow, guess)
    if (multiplier * guessedNPV > delta) {
      guess += multiplier * delta
      i += 1
    } else break
  }

  return guess
}

const calculate = (
  monthlyPayments,
  depreciations,
  endOfLeaseValue,
  taxOnSale,
  purchasePrice = 12000000,
  incomeTax = 0.48
) => {
  ////
  const monthDepDif = monthlyPayments.map((mp, idx) => mp - depreciations[idx])
  console.log('monthDepDif', monthDepDif)
  const monthDepDifRate = monthDepDif.map((n) => n * incomeTax)

  const afterTaxPayments = monthlyPayments.map((mp, idx) => mp - monthDepDifRate[idx])

  //   const afterTaxPaymentsSum = afterTaxPayments.reduce((a, b) => a + b, 0);

  const termValue = endOfLeaseValue - taxOnSale
  const beforeTaxPaymentsTerm = [...monthDepDif]
  const afterTaxPaymentsTerm = [...afterTaxPayments]

  const beforeTaxPaymentsNoTerm = [...monthDepDif]
  const afterTaxPaymentsNoTerm = [...afterTaxPayments]

  const first = -1 * purchasePrice
  beforeTaxPaymentsTerm.unshift(first)
  let last = endOfLeaseValue + beforeTaxPaymentsTerm[beforeTaxPaymentsTerm.length - 2]
  beforeTaxPaymentsTerm.push(last)

  afterTaxPaymentsTerm.unshift(first)
  last = termValue + afterTaxPaymentsTerm[afterTaxPaymentsTerm.length - 2]
  afterTaxPaymentsTerm.push(last)

  let beforeTaxIrr = IRR(beforeTaxPaymentsTerm)
  console.log('before tax irr before transformation', beforeTaxPaymentsTerm)
  beforeTaxIrr = (1 + beforeTaxIrr) ** 12 - 1
  const beforeTaxIRRDisplay = beforeTaxIrr * 100
  console.log('before tax irr ' + beforeTaxIRRDisplay)

  const irr = IRR(afterTaxPaymentsTerm)
  const afterTaxIrr = (1 + irr) ** 12 - 1
  const afterTaxIrrDisplay = afterTaxIrr * 100
  console.log('aftertax irr ' + afterTaxIrrDisplay)

  let afterTaxIrrNoTerm = IRR(afterTaxPaymentsNoTerm)
  let beforeTaxIrrNoTerm = IRR(beforeTaxPaymentsNoTerm)

  afterTaxIrrNoTerm = (1 + afterTaxIrrNoTerm) ** 12 - 1
  beforeTaxIrrNoTerm = (1 + beforeTaxIrrNoTerm) ** 12 - 1

  afterTaxIrrNoTerm = afterTaxIrrNoTerm * 100
  beforeTaxIrrNoTerm = beforeTaxIrrNoTerm * 100

  console.log('After Tax IRR No Terminal Value: ' + afterTaxIrrNoTerm)
  console.log('Before Tax IRR No Terminal Value: ' + beforeTaxIrrNoTerm)
}

const tempFun = () => {
  console.log('Temp fun==================================================')

  const monthlyPayments = getMonthlyPayments()
  const depreciations = getMonthlyDepreciations()
  const endOfLeaseValue = getEndOfLeaseValue()
  const capOnSale = getCapGainOnSale(endOfLeaseValue, depreciations)
  const taxOnSale = getTaxOnSale(capOnSale)

  //
  const capRate = getCapRate()
  console.log('CAP RATE', capRate)
  const rpsf = getRentPsf()
  console.log('rent/sf', rpsf)
  const pricepsf = getPricePsf()
  console.log('price/sf', pricepsf)
  console.log('land/sf', getLandPsf())
  const annualMarketRent = getAnnualMarketRent()
  console.log('annual market rent ', annualMarketRent)
  const endOfLeaseMarketRent = getMarketRentEndOfLease(annualMarketRent)
  console.log('end of lease market rent', endOfLeaseMarketRent)
  const termmarkcap = getTermMarketValueFromCap(endOfLeaseMarketRent)
  console.log('Terminal Market Value from Cap', termmarkcap)

  console.log('cap gain on sale', capOnSale)
  console.log('tax one sale', taxOnSale)
  console.log('end of leasse val', endOfLeaseValue)

  calculate(monthlyPayments, depreciations, endOfLeaseValue, taxOnSale)
}

export default tempFun
