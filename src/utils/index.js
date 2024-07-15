import { v4 as uuidv4 } from 'uuid'

export const getNewTenantObject = (tenantNumber) => ({
  name: `Tenant ${tenantNumber}`,
  cashflow: '$100,000',
  cashFlowUnit: 'years',
  leaseLength: '10',
  leaseLengthUnit: 'years',
  leaseStructure: [
    { howOften: 'annual', rentIncrease: '2%', startTime: '1', startTimeUnit: 'years' },
  ],
  startTime: '1',
  startTimeUnit: 'months',
  _id: uuidv4(),
})
