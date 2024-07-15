import React, { useContext } from 'react'
import TextField from '../../TextField'
import MonthOrYearSelector from '../../MonthOrYearSelector'
import { Flex } from '../../CommonStyles'
import { Divider, Select } from './RentalIncomeAndLeasePopup.styles'
import { InvestmentInputContext } from '../../../context/InvestmentInputContext'

const RentalIncomeTab = ({ currentTenant, onChangeTenantValue, inputError, onClearInputError, leaseLength }) => {
  const { isSharedDeal } = useContext(InvestmentInputContext)
  return (
    <>
      <Divider />
      <Flex>
        <div style={{ flex: 1, position: 'relative' }}>
          <TextField
            label="Tenant Name"
            placeholder="X"
            value={currentTenant.name}
            onChange={(value) => onChangeTenantValue('name', value)}
            error={inputError && inputError.name}
            onFocus={onClearInputError}
            disabled={isSharedDeal}
          />
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <TextField
            label="Rent"
            placeholder="X"
            value={currentTenant.cashflow}
            onChange={(value) => onChangeTenantValue('cashflow', value)}
            format="dollar"
            error={inputError && inputError.cashflow}
            onFocus={onClearInputError}
            disabled={isSharedDeal}
          />
          <MonthOrYearSelector
            value={currentTenant.cashFlowUnit}
            onChange={(e) => onChangeTenantValue('cashFlowUnit', e.target.value)}
            disabled={isSharedDeal}
            customLabels={{year: "per Year", month: "per Month"}}
          />
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <TextField
            label="Lease Length"
            placeholder="X"
            value={currentTenant.leaseLength}
            onChange={(value) => onChangeTenantValue('leaseLength', value)}
            error={inputError && inputError.leaseLength}
            onFocus={onClearInputError}
            disabled={isSharedDeal}
            tooltip="#TODO: Add Tooltip"
          />
          <MonthOrYearSelector
            value={currentTenant.leaseLengthUnit}
            onChange={(e) => onChangeTenantValue('leaseLengthUnit', e.target.value)}
            disabled={isSharedDeal}
            pluralLabels
          />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <TextField
            label={`Start ${currentTenant.leaseLengthUnit === 'years' ? 'Year' : 'Month'} #`}
            placeholder="X"
            value={currentTenant.startTime}
            onChange={(value) => onChangeTenantValue('startTime', value)}
            error={inputError && inputError.startTime}
            onFocus={onClearInputError}
            disabled={isSharedDeal}
            tooltip="#TODO: Add Tooltip"
          />
          <MonthOrYearSelector
            value={currentTenant.startTimeUnit}
            onChange={(e) => onChangeTenantValue('startTimeUnit', e.target.value)}
            disabled={isSharedDeal}
          />
        </div>
      </Flex>
      <Divider />
    </>
  )
}

export default RentalIncomeTab
