import React, { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TabsUnstyled from '@mui/base/TabsUnstyled'
import PopupBackground from '../PopupBackground'
import { Flex, TextWithIcon, Button } from '../../CommonStyles'
import RentalIncomeTab from './RentalIncomeTab'
import { LeaseStructureTab } from './LeaseStructureTab'
import { useInvestmentInputContext } from '../../../context/InvestmentInputContext'
// import { getNewTenantObject } from '../../../utils'
import {
  isCurrencyValid,
  isInputValid,
  isNumberValid,
  isRateValid,
  validateErrorObjectForInput,
} from '../../../utils/inputFormatter'
import { Content, BottomContainer, MainTabView } from './RentalIncomeAndLeasePopup.styles'
import { TabsList, Tab } from '../../../components/common/Tabs'
import { v4 as uuidv4 } from 'uuid'

function RentalIncomeAndLeasePopup({ onClose }) {
  const getNewTenantObject = (tenantNumber) => ({
    name: `Tenant ${tenantNumber}`,
    cashflow: '$100,000',
    cashFlowUnit: 'years',
    leaseLength: leaseLength,
    leaseLengthUnit: 'years',
    leaseStructure: [
      { howOften: 'annual', rentIncrease: '2%', startTime: '1', startTimeUnit: 'years' },
    ],
    startTime: '1',
    startTimeUnit: 'years',
    _id: uuidv4(),
  })
  const { leaseLength, customizedRentalInfo, setCustomizedRentalInfoInput, isSharedDeal } =
    useInvestmentInputContext()
  const [tabIndex, setTabIndex] = useState(0)
  const [tenants, setTenants] = useState(
    customizedRentalInfo ? customizedRentalInfo : [getNewTenantObject(1)]
  )
  const [inputErrorArr, setInputErrorArr] = useState([])
  const [leaseInputErrorArr, setLeaseInputErrArr] = useState([])
  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const addTenant = () => {
    setTenants((prevData) => [...prevData, getNewTenantObject(prevData.length + 1)])
    setTabIndex(tenants.length)
  }

  const handleChangeTenantValue = (key, value) => {
    const newTenants = tenants.slice()
    newTenants[tabIndex][key] = value
    setTenants([...newTenants])
  }

  const handleSave = (isClosePopup) => {
    console.log('handle save', tenants)
    if (validateInput()) {
      setCustomizedRentalInfoInput((prevData) => {
        prevData = tenants
        return [...prevData]
      })

      console.log('isClosePopup', isClosePopup)
      if (isClosePopup) {
        onClose()
      }
    }
  }

  const validateLeaseInput = (leaseStructure, idx) => {
    let result = true
    if (leaseStructure) {
      const validArr = leaseStructure.map((leastStructureItem) => {
        let rentalInfoValidator = {
          startTime: !isNumberValid(leastStructureItem.startTime),
          rentIncrease: !isRateValid(leastStructureItem.rentIncrease),
        }
        if (validateErrorObjectForInput(rentalInfoValidator) === false) {
          result = false
        }

        return rentalInfoValidator
      })

      const newErrArr = JSON.parse(JSON.stringify(leaseInputErrorArr))
      newErrArr[idx] = validArr
      setLeaseInputErrArr(JSON.parse(JSON.stringify(newErrArr)))
    }

    return result
  }

  const validateInput = () => {
    setInputErrorArr([])
    let result = true

    tenants.forEach((tenant, idx) => {
      let tenantValidator = {
        name: !isInputValid(tenant.name),
        cashflow: !isCurrencyValid(tenant.cashflow),
        leaseStructure: !validateLeaseInput(tenant.leaseStructure, idx),
      }
      console.log('tenant validator', tenantValidator)
      if (validateErrorObjectForInput(tenantValidator) === false) {
        result = false
      }

      setInputErrorArr((prevData) => {
        return [...prevData, tenantValidator]
      })
    })

    return result
  }

  const handleDelete = (index) => {
    if (tenants.length > 1) {
      setTabIndex(Math.max(0, index - 1))
      setTenants((prevData) => {
        prevData.splice(index, 1)
        return [...prevData]
      })
    }
  }

  const clearInputError = () => {
    setInputErrorArr([])
    setInputErrorArr((prevData) => {
      prevData[tabIndex] = {}
      return [...prevData]
    })
  }

  const handleAddNewLeaseStructure = () => {
    const newTenantData = [...tenants]

    newTenantData[tabIndex].leaseStructure = [
      ...(newTenantData[tabIndex].leaseStructure || []),

      {
        startTime: '',
        howOften: 'annual',
        rentIncrease: '',
        startTimeUnit: 'years',
      },
    ]

    setTenants([...newTenantData])
  }

  const handleChangeLeaseStructureValue = (key, value, idx) => {
    const newTenantData = [...tenants]
    const newStructure = newTenantData[tabIndex].leaseStructure
    newStructure[idx][key] = value
    newTenantData[tabIndex].leaseStructure = [...newStructure]
    setTenants([...newTenantData])
  }

  const handleClearLeaseInputError = () => {
    setLeaseInputErrArr((prevData) => {
      prevData[tabIndex] = []
      return [...prevData]
    })
  }

  const handleDeleteLeaseStructure = (leaseIdx) => {
    const newTenantsData = [...tenants]
    const newLeaseStructure = newTenantsData[tabIndex].leaseStructure
    newLeaseStructure.splice(leaseIdx, 1)
    newTenantsData[tabIndex].leaseStructure = [...newLeaseStructure]
    setTenants(JSON.parse(JSON.stringify(newTenantsData)))
  }

  return (
    <PopupBackground>
      <Content>
        <MainTabView>
          <TabsUnstyled value={tabIndex} onChange={handleChange}>
            <TabsList>
              {tenants.map((tenant, idx) => (
                <Tab key={tenant._id}>
                  {tenant.name || `Tenant ${idx + 1}`}{' '}
                  {tabIndex === idx && (
                    <IconButton
                      size="small"
                      sx={{ width: 20, height: 20, marginLeft: 1 }}
                      onClick={() => handleDelete(idx)}
                    >
                      <CloseIcon fontSize="inherit" htmlColor="#F0F7FF" />
                    </IconButton>
                  )}
                </Tab>
              ))}
            </TabsList>
          </TabsUnstyled>

          <RentalIncomeTab
            currentTenant={tenants[tabIndex]}
            inputError={inputErrorArr[tabIndex]}
            onClearInputError={clearInputError}
            onChangeTenantValue={handleChangeTenantValue}
          />

          <LeaseStructureTab
            currentLeaseStructure={[...(tenants[tabIndex].leaseStructure || [])]}
            onAddNewLeaseStructure={handleAddNewLeaseStructure}
            onChangeLeaseStructureValue={handleChangeLeaseStructureValue}
            leaseInputError={leaseInputErrorArr[tabIndex]}
            onClearInputError={handleClearLeaseInputError}
            onDeleteLeaseStructure={handleDeleteLeaseStructure}
          />
        </MainTabView>
        <BottomContainer>
          <Flex pt="0.4rem">
            {!isSharedDeal && (
              <TextWithIcon onClick={addTenant}>
                <div className="icon" />
                <div>Add Tenant</div>
              </TextWithIcon>
            )}
          </Flex>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="white" backgroundColor="#4fd165" onClick={() => handleSave(true)}>
            Save
          </Button>
        </BottomContainer>
      </Content>
    </PopupBackground>
  )
}

export default RentalIncomeAndLeasePopup
