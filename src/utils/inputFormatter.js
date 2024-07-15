import { formatMoney, unformat } from 'accounting'

export const getCurrency = (value) => {
  if (value !== null || value !== undefined) {
    value = value.replace(/[^\d.]/g, '')
    if (value.replaceAll('$', '') === '') {
      return ''
    } else if (!value.includes('.')) {
      return formatMoney(unformat(value), '$', 0)
    } else if (isCurrencyValid(value)) {
      const currentDecimalDigits = value.length - value.lastIndexOf('.') - 1
      if (currentDecimalDigits === 0) {
        return formatMoney(unformat(value), '$', 0) + '.'
      }
      const resultDecimalDigits = currentDecimalDigits > 2 ? 2 : currentDecimalDigits
      if (currentDecimalDigits > 2) {
        value = value.slice(0, -(currentDecimalDigits - 2))
      }
      return formatMoney(unformat(value), '$', resultDecimalDigits)
    }
  } else {
    return value
  }
}

export const getRate = (value) => {
  value = value?.toString().replace(/[^\d.]/g, '')
  if (value != null && value !== '') {
    value = value.toString().replace('%', '') + '%'
    return value
  } else {
    return ''
  }
}

export const getNumber = (value) => {
  value = value?.replace(/[^\d.]/g, '')
  return value
}

export const isCurrencyValid = (value) => {
  if (value !== null && value !== '' && value !== undefined) {
    return unformat(value).toString().length > 0
  } else {
    return false
  }
}

export const isInputValid = (value) => {
  if (value !== null && value !== '' && value !== undefined) {
    return value.length > 0
  } else {
    return false
  }
}

export const isRateValid = (value) => {
  if (value !== null && value !== '' && value !== undefined) {
    const valueWithoutSymbol = value.toString().replaceAll('%', '')
    return (
      valueWithoutSymbol.length > 0 && isNumberValid(valueWithoutSymbol) && valueWithoutSymbol < 100
    )
  } else {
    return false
  }
}

export const isNumberValid = (value) => {
  if (value !== null && value !== '') {
    return !isNaN(value)
  } else {
    return false
  }
}

export const unformatCurrency = (value) => {
  return unformat(value)
}

export const unformatRate = (value) => {
  return parseFloat(value?.replaceAll('%', ''))
}

export const validateErrorObjectForInput = (inputErrorObject) => {
  for (var key in inputErrorObject) {
    if (inputErrorObject[key]) {
      return false
    }
  }
  return true
}

export const formatRate = (value) => {
  value = value.toString().replaceAll('%', '')
  return (Math.round(value * 100) / 100).toFixed(2) + '%'
}

export const formatCurrency = (value) => {
  value = value.toString().replaceAll('$', '')
  return '$' + (Math.round(value * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
