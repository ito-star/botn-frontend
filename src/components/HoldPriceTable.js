import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/system'

function createData(year, grossIncome, morgage, expenses, cashFlow, coc, lirr, irr) {
  return { year, grossIncome, morgage, expenses, cashFlow, coc, lirr, irr }
}

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

const CustomTableContainer = styled(TableContainer)({
  width: 'auto',
})

const rows = [
  createData('1', '', '', '', '', '', '', ''),
  createData('2', '', '', '', '', '', '', ''),
  createData('3', '', '', '', '', '', '', ''),
  createData('4', '', '', '', '', '', '', ''),
  createData('5', '', '', '', '', '', '', ''),
  createData('6', '', '', '', '', '', '', ''),
  createData('7', '', '', '', '', '', '', ''),
  createData('8', '', '', '', '', '', '', ''),
  createData('9', '', '', '', '', '', '', ''),
  createData('10', '', '', '', '', '', '', ''),
]

export default function HoldPeriodTable() {
  return (
    <CustomTableContainer component={'div'}>
      <Table sx={{ minWidth: '55%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <CustomTableCell className="header">Year</CustomTableCell>
            <CustomTableCell className="header" align="left">
              Gross Income
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              Morgage
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              Expenses
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              Cash Flow
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              COC
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              LIRR
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              IRR
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.year}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <CustomTableCell component="th" scope="row">
                {row.year}
              </CustomTableCell>
              <CustomTableCell align="left">{row.grossIncome}</CustomTableCell>
              <CustomTableCell align="left">{row.morgage}</CustomTableCell>
              <CustomTableCell align="left">{row.expenses}</CustomTableCell>
              <CustomTableCell align="left">{row.cashFlow}</CustomTableCell>
              <CustomTableCell align="left">{row.coc}</CustomTableCell>
              <CustomTableCell align="left">{row.lirr}</CustomTableCell>
              <CustomTableCell align="left">{row.irr}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomTableContainer>
  )
}
