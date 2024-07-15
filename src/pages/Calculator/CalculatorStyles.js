import styled from 'styled-components'

export const CenterWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

export const CalculatorContainer = styled.div`
  display: flex;
  gap: 20px;
`
export const LeftPane = styled.div`
  flex: 8;
`
export const HeaderContainer = styled.div`
  position: sticky;
  padding: 0.6rem 0;
  top: 0rem;
  background: var(--background-color);
  display: flex;
  justify-content: space-between;
  z-index: 99;
`
export const Logo = styled.img`
  height: 1.9rem;
`

export const UserDetails = styled.div`
  padding: 0.4rem 0.6rem;
  background: white;
  border-radius: 0.6rem;
  display: flex;
  box-shadow: 1px 1px 0.6rem #d1d1d1;
  cursor: pointer;
  & .user {
    padding-right: 20px;
  }

  & .username {
    font-size: 0.6rem;
    font-weight: 700;
  }

  & .user-email {
    font-size: 0.5rem;
  }

  & .downArrow {
    width: 0.5rem;
  }
`

export const PurchaseAndSale = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 0.6rem;
  align-items: stretch;
`

export const Purchase = styled.div`
  flex: 8;
`

export const TextWithToggleContainer = styled.div`
  width: 100%;
  border: 1px solid #e2e2e1;
  border-radius: 0.6rem;
  background-color: #f5f6fb;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.5rem;
  min-width: 0;
  font-size: 0.8rem;
  font-weight: 600;
  flex-wrap: wrap;
  min-height: 2.5rem;

  & .Text {
    font-size: 0.6rem;
    flex: 1;
  }
`

export const Sale = styled.div`
  flex: 4;
  & .or-text {
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    padding-top: 0.6rem;
  }
`

export const ExpensesDebtDepContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 0.6rem;
  align-items: stretch;
  margin-bottom: 0.6rem;
`

export const ExpensesDepreciationMoreContainer = styled.div`
  flex: 8;
`

export const ExpensesContainer = styled.div`
  margin-bottom: 0.75rem;
  & .text {
    flex: 1;
    font-size: 0.5rem;
    padding-top: 0.125rem;
    color: gray;
  }

  & .dark-text {
    font-size: 0.8rem;
    padding-top: 0.3rem;
    font-weight: 600;
  }
`

export const DepreciationContainer = styled.div`
  margin-bottom: 0.75rem;
  & .first-text {
    flex: 2;
    font-size: 0.8rem;
    padding-top: 0.3rem;
    font-weight: 600;
  }

  & .second-text {
    flex: 1;
    font-size: 0.8rem;
    padding-top: 0.3rem;
    font-weight: 600;
  }
`

export const MoreContainer = styled.div``

export const DebtAndCalculate = styled.div`
  display: flex;
  flex-direction: column;
  flex: 4;
`

export const DebtContainer = styled.div`
  flex: 4;
`

export const BtnWithIcon = styled.button`
  flex: ${(props) => props.flex};
  padding: 0.7rem;
  border: none;
  color: ${(props) => props.color};
  font-size: 0.8rem;
  background-color: ${(props) => props.backgroundColor};
  font-weight: 600;
  box-shadow: 1px 1px 10px #d1d1d1;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  width: ${(props) => (props.w ? props.w : 'auto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : '')};
  justify-content: center;
  & .btn-icon {
    width: 0.8rem;
    margin-right: 0.5rem;
  }
`
export const RightPane = styled.div`
  flex: 4;
`

export const SummaryContent = styled.div`
  padding: 0.5rem 1rem;
`

export const SummaryLabel = styled.div`
  flex: 1;
  font-size: 0.7rem;
  padding: 0.31rem 0;
`

export const SummaryValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  font-size: 0.7rem;
  padding: 0.31rem 0;
`
export const SummaryHeader = styled.div`
  padding: 0.5rem 0;
  background: #0773ff;
  width: 100%;
  font-size: 0.9rem;
  color: white;
  text-align: center;
  font-weight: 600;
`
