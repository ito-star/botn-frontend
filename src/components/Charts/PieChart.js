import React, { useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
const PieChart = ({
  w = '100%',
  h = '9.5rem',
  lineColor = '#0773ff',
  areaColor = '#0773ff',
  chartData,
  dataArray,
}) => {
  const option = {
    // xAxis: {
    //   type: 'category',
    //   boundaryGap: false,
    //   data: Array.from(Array(dataArray == null ? 6 : dataArray.length), (e, i) => i + 1)
    // },
    // yAxis: {
    //   type: 'value',
    //   // boundaryGap: false,
    // },
    series: [
      {
        data:
          dataArray == null
            ? [
                { value: 60, name: 'Search Engine' },
                { value: 40, name: 'Direct' },
              ]
            : dataArray,
        type: 'pie',
        smooth: true,
        // color: lineColor,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'inner',
              formatter: function (params) {
                return params.value + '%\n'
              },
            },
            labelLine: {
              show: false,
            },
          },
        },
      },
    ],
    color: ['red', '#0773ff'],
    grid: {
      containLabel: true,
      x: 0,
      x2: 10,
      y: 10,
      y2: 20,
    },
  }

  const instance = useRef(null)

  return (
    <>
      <ReactECharts ref={instance} option={option} style={{ height: h, width: w }} />
    </>
  )
}

export default PieChart
