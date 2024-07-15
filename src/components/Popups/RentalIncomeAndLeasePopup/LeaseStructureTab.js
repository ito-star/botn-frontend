import React, { useContext } from 'react'
import { IconButton } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import TextField from '../../TextField'
import MonthOrYearSelector from '../../MonthOrYearSelector'
import { Flex, TextWithIcon, InputWithDropdownContainer } from '../../CommonStyles'
import {
  ListContainer,
  NavigateOrDeleteContainer,
  Select,
} from './RentalIncomeAndLeasePopup.styles'
import { InvestmentInputContext } from '../../../context/InvestmentInputContext'

const FrequencySelector = ({ value, onChange, disabled }) => (
  <select
    style={{
      position: 'absolute',
      left: '0.5rem',
      bottom: '0.5rem',
      backgroundColor: 'transparent',
      fontSize: '0.7rem',
      border: 'none',
      color: '#494949',
      fontWeight: 'bold',
      width: '90%',
      borderRadius: '0.2rem',
    }}
    value={value}
    onChange={onChange}
    disabled={disabled}
  >
    <option selected value="annual">
      Annual
    </option>
    <option value="semi annual">Semi-Annual</option>
    <option value="two annual">Two Year</option>
    <option value="three annual">Three Year</option>
    <option value="four annual">Four Year</option>
    <option value="five annual">Five Year</option>
    <option value="ten annual">Ten Year</option>
    <option value="only once">Only Once</option>
  </select>
)

const OrdinalNumbers = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
]

export const LeaseStructureTab = ({
  currentLeaseStructure,
  onAddNewLeaseStructure,
  onChangeLeaseStructureValue,
  leaseInputError,
  onClearInputError,
  onDeleteLeaseStructure,
}) => {
  const { isSharedDeal } = useContext(InvestmentInputContext)

  return (
    <ListContainer h="15rem">
      {currentLeaseStructure.map((leaseStructureItem, index) => (
        <Flex key={index} style={{ width: '100%' }}>
          <TextField
            label="Rent Increase %"
            placeholder="X"
            value={leaseStructureItem.rentIncrease}
            format="rate"
            onChange={(value) => {
              onChangeLeaseStructureValue('rentIncrease', value, index)
            }}
            error={leaseInputError && leaseInputError[index]?.rentIncrease}
            onFocus={onClearInputError}
            disabled={isSharedDeal}
          />
          <InputWithDropdownContainer>
            <TextField label="How Often" placeholder="" disabled valid={true} />
            <FrequencySelector
              value={leaseStructureItem.howOften}
              onChange={(e) => {
                onChangeLeaseStructureValue('howOften', e.target.value, index)
              }}
              disabled={isSharedDeal}
            />
          </InputWithDropdownContainer>
          <div style={{ flex: 1, position: 'relative' }}>
            <TextField
              label={`Start ${OrdinalNumbers[index] || 'next'} rent increase after`}
              placeholder="X"
              value={leaseStructureItem.startTime}
              onChange={(value) => {
                onChangeLeaseStructureValue('startTime', value, index)
              }}
              error={leaseInputError && leaseInputError[index]?.startTime}
              onFocus={onClearInputError}
              disabled={isSharedDeal}
            />
            <MonthOrYearSelector
              value={leaseStructureItem.startTimeUnit}
              onChange={(e) => onChangeLeaseStructureValue('startTimeUnit', e.target.value, index)}
              disabled={isSharedDeal}
            />
          </div>
          <NavigateOrDeleteContainer>
            {!isSharedDeal && (
              <IconButton
                className="delete-button"
                onClick={() => {
                  onDeleteLeaseStructure(index)
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            )}
          </NavigateOrDeleteContainer>
        </Flex>
      ))}
      {!isSharedDeal && (
        <TextWithIcon flex="none" onClick={() => onAddNewLeaseStructure()}>
          <div className="icon" />
          <div>New Rent Increase</div>
        </TextWithIcon>
      )}
    </ListContainer>
  )
}
