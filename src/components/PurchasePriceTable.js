import React, { useContext } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/system'
import { InvestmentInputContext } from '../context/InvestmentInputContext'
import { getCurrency, unformatCurrency } from '../utils/inputFormatter'

const CustomTableCell = styled(TableCell)({
  fontSize: '0.55rem',
  lineHeight: '1rem',
  padding: '0.1rem 0.5rem',
  border: '1px solid rgb(239 238 238)',
  fontWeight: 600,
  '&.header': {
    color: '#999898',
  },
})

export default function BasicTable({ percent }) {
  const { purchasePrice, investmentSummaryBreakdown } = useContext(InvestmentInputContext)
  const summaryPercents = [
    1 - (percent / 100) * 2,
    1 - percent / 100,
    1,
    1 + percent / 100,
    1 + (percent / 100) * 2,
  ]

  return (
    <TableContainer component={'div'}>
      <Table sx={{ minWidth: '55%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <CustomTableCell className="header">Price</CustomTableCell>
            <CustomTableCell className="header" align="left">
              IRR
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              LEV
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              IRR
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              COC
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summaryPercents.map((percent, idx) => (
            <TableRow
              key={idx}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <CustomTableCell component="th" scope="row">
                {getCurrency(`${unformatCurrency(purchasePrice) * percent}`)}
              </CustomTableCell>
              <CustomTableCell align="left">
                {investmentSummaryBreakdown[idx].LeveredIRR}
              </CustomTableCell>
              <CustomTableCell align="left"></CustomTableCell>
              <CustomTableCell align="left"></CustomTableCell>
              <CustomTableCell align="left">
                {investmentSummaryBreakdown[idx].CashOnCash}
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
