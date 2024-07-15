import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/system'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
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

const rows = [
  createData('2%', 10, '', ''),
  createData('2.5%', 8, '', ''),
  createData('3%', 7, '', ''),
  createData('3.5%', 6, '', ''),
]

export default function BasicTable() {
  return (
    <TableContainer component={'div'}>
      <Table sx={{ minWidth: '55%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <CustomTableCell className="header">%</CustomTableCell>
            <CustomTableCell className="header" align="left">
              IRR
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              LIRR
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              COC
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <CustomTableCell component="th" scope="row">
                {row.name}
              </CustomTableCell>
              <CustomTableCell align="left">{row.calories}</CustomTableCell>
              <CustomTableCell align="left">{row.fat}</CustomTableCell>
              <CustomTableCell align="left">{row.carbs}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
