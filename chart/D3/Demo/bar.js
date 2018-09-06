/*
 * 要求：
 * 1、每一个bar最小为60像素，间距为2像素，当svg宽度小于盒子的宽度时，均匀分布，填满整个盒子
 * 2、文字换行，兼容中英文
 * */

let dataS = [
  {
    name: '热镀锌铁卷',
    data: 100
  },
  {
    name: '冷轧卷轧卷',
    data: 30
  }, {
    name: '其他涂层板材',
    data: 60
  }, {
    name: '彩涂卷',
    data: 24
  }, {
    name: '其他冷轧',
    data: 0
  },
  {
    name: '热镀锌铁卷',
    data: 100
  },
  {
    name: '轧卷轧卷',
    data: 30
  }, {
    name: '涂层板材',
    data: 60
  }, {
    name: '彩涂卷',
    data: 24
  }, {
    name: '其他冷轧',
    data: 70
  },
  {
    name: '锌铁卷',
    data: 30
  },
  {
    name: '卷轧卷',
    data: 90
  }, {
    name: '涂层板',
    data: 60
  }, {
    name: '彩涂卷',
    data: 14
  }, {
    name: '其他冷轧',
    data: 0
  }]
let el = d3.select('.chart')

// 执行
init()

function init () {
  // 数据初始化
  let theme = {
    boxWidth: parseInt(el.style('width')),
    boxHeight: parseInt(el.style('height')),
    barPadding: 25, // 当需要滚动时，每一个bar 10像素，左右padding为25像素
    scroll: true // 是否需要滚动
  }

  let svg = d3.select('.chart')
    .append('svg')
    .attr('width', (d) => {
      let barWidth = dataS.length * (theme.barPadding * 2 + 10) + (dataS.length - 1) * 2
      let width = barWidth
      if (barWidth < theme.boxWidth) {
        width = theme.boxWidth
        theme.barPadding = parseInt((width + 2 - dataS.length * 12) / (dataS.length * 2))
      }
      return width
    })
    .attr('height', theme.boxHeight)

  // 绘图
  drawBarChart(theme, svg)
  // 自适应控制
  media(theme, svg)
}

function drawBarChart (theme, svg) {
  drawAxis(theme, svg)
  drawBar(theme, svg)
}

function drawAxis (theme, svg) {
  let gXaxis = svg.select('.xAxis')
  if (gXaxis.empty()) {
    gXaxis = svg.append('g')
      .attr('class', 'xAxis')
    gXaxis.append('line')
      .attr('class', 'xAxis-line')
      .attr('stroke', '#f1f1f1')
  }
  gXaxis.select('.xAxis-line')
    .attr('x1', '0')
    .attr('y1', theme.boxHeight - 60) // 横线距离底部的高度为60像素
    .attr('x2', svg.attr('width'))
    .attr('y2', theme.boxHeight - 60)
}

function drawBar (theme, svg) {
  let barG = svg.selectAll('.bar-group')
  if (barG.empty()) {
    barG = svg.append('g').attr('class', 'bar-group')
  }
  // update
  let barItem = barG.selectAll('.bar-item').data(dataS)
  updateDataS(barItem, theme)
  // add
  let enterBarItem = barItem.enter()
  enterBarItem = enterBarItem.append('g').attr('class', 'bar-item')
  addDataS(enterBarItem, theme)
  // del
  barItem.exit().remove()
}
function updateDataS (barItem, theme) {
  // update-rect
  barItem.select('.bar-rect')
    .attr('height', (d) => {
      return d.data === 0 ? 1 : d.data // 当data为0时，bar高度为1像素，颜色为浅粉色
    })
    .attr('x', (d, i) => {
      return theme.barPadding + i * (theme.barPadding * 2 + 12)
    })
    .attr('y', (d) => {
      return d.data === 0 ? 100 - 1 + 20 : 100 - d.data + 20
    })
    .attr('fill', (d) => {
      return d.data === 0 ? '#FBEAEA' : '#316ccb' // 当data为0时，bar高度为1像素，颜色为浅粉色
    })
  // update-axis-title
  // 并不太好的方法，兼容性需测试：
  barItem.select('.axis-title')
    .attr('x', (d, i) => {
      return i * (theme.barPadding * 2 + 12)
    })
    .attr('width', theme.barPadding * 2 + 10)
    .text(function (d) {
      return d.name
    })
  // update-bar-title
  barItem.select('.bar-title')
    .attr('x', (d, i) => {
      return theme.barPadding + 5 + i * (theme.barPadding * 2 + 12)
    })
    .attr('y', (d) => {
      return 100 - d.data + 20 - 8
    })
    .text((d) => {
      return d.data + '次'
    })
}
function addDataS (enterBarItem, theme) {
  // add-rect
  enterBarItem.append('rect')
    .attr('class', 'bar-rect')
    .attr('width', 10)
    .attr('height', (d) => {
      return d.data === 0 ? 1 : d.data // 当data为0时，bar高度为1像素，颜色为浅粉色
    })
    .attr('x', (d, i) => {
      return theme.barPadding + i * (theme.barPadding * 2 + 12)
    })
    .attr('y', (d) => {
      return d.data === 0 ? 100 - 1 + 20 : 100 - d.data + 20
    })
    .attr('fill', (d) => {
      return d.data === 0 ? '#FBEAEA' : '#316ccb' // 当data为0时，bar高度为1像素，颜色为浅粉色
    })
    .style('transform', 'scale(1, 0)')
    .style('transform-origin', 'center bottom')
    .transition()
    .duration(800)
    .style('transform', 'scale(1, 1)')
  // add-axis-text
  // 并不太好的方法，兼容性需测试：
  enterBarItem.append('foreignObject')
    .attr('class', 'axis-title')
    .attr('x', (d, i) => {
      return i * (theme.barPadding * 2 + 12)
    })
    .attr('y', 100 + 20 + 12)
    .attr('width', theme.barPadding * 2 + 10)
    .style('text-align', 'center')
    .style('font-size', '12px')
    .style('color', '#656565')
    .text(function (d) {
      return d.name
    })
  // add-bar-title
  enterBarItem.append('text')
    .attr('class', 'bar-title')
    .attr('x', (d, i) => {
      return theme.barPadding + 5 + i * (theme.barPadding * 2 + 12)
    })
    .attr('y', (d) => {
      return 100 - d.data + 20 - 8
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('fill', '#959595')
    .text((d) => {
      return d.data + '次'
    })
}

// 自适应
function media (theme, svg) {
  window.addEventListener('resize', () => {
    theme.boxWidth = parseInt(el.style('width'))
    theme.barPadding = 25
    let barWidth = dataS.length * (theme.barPadding * 2 + 10) + (dataS.length - 1) * 2
    svg.attr('width', (d) => {
      let width = barWidth
      if (barWidth < theme.boxWidth) {
        width = theme.boxWidth
        theme.barPadding = parseInt((width + 2 - dataS.length * 12) / (dataS.length * 2))
      }
      return width
    })
    drawBarChart(theme, svg)
  })
}