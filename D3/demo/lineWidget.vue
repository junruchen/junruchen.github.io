<template>
  <div class="line-box">
    <div class="chart-title"
         v-if="line.title"><span>{{line.title}}</span>
    </div>
    <div class="legends-group"></div>
    <div class="tips-content"></div>
    <button class="back-line">返回</button>
  </div>
</template>
<script>
  import _ from 'lodash'
  import * as d3 from 'd3'
  import {
    getArrMaxData,
    getNewArr
  } from './util'

  export default{
    name: 'Line',

    data () {
      return {
        // 绘图需要的数据
        line: {},

        // 非svg内元素样式设置
        style: {
          chartTitleStyle: {}
        },

        // theme 用户指定／／
        padding: {
          left: 50,
          right: 30,
          top: 35,
          bottom: 50
        },
        color: null,
        // 全局变量
        parentS: null,
        svgWidth: '',
        svgHeight: '',
        lineWidth: '',
        lineHeight: '',
        svg: null,
        bisect: null, // 获取指定数据对应的index
        lineGroup: { // 折线相关
          legendsG: null, // legend组
          tipsG: null, // tip提示框组
          dragG: null, // 矩形选框组
          chartG: null // 折线组
        },
        axisGroup: { // 坐标轴相关
          xAxisG: null, // x坐标轴组
          yAxisG: null, // y坐标轴组
          xScale: null, // x比例尺
          yScale: null, // y比例尺
          xScaleCopy: null, // x比例尺深拷贝
          yScaleMutil: null // 多级比例尺
        }
      }
    },

    props: ['lineData'],

    watch: {
      'lineData': {
        handler (val) {
          if (!_.isEmpty(val)) {
            console.log('123')
            this.init()
          }
        },
        deep: true
      },
      svgWidth (val) {
        this.lineWidth = val - this.padding.left - this.padding.right
        this.svg.attr('width', val)
        this.axisGroup.xScale.range([0, this.lineWidth])
        this.axisGroup.xScaleCopy.range([0, this.lineWidth])
        this.init()
      }
    },

    methods: {
      init () {
        // 校验 数据 以及一些拖拽选区操作是否保留等 , 如去掉一些参数等
        // 初始化 数据
        this.line = {
          title: this.lineData.title || '',
          legend: {
            show: this.lineData.legend.show,
            data: this.lineData.legend.data // 必填项
          },
          showTips: this.lineData.showTips || true, // 展示tip框
          useDrag: this.lineData.useDrag || true, // 使用底部拖拽
          useZoom: this.lineData.useZoom || true, // 使用矩形选区
          areaPath: this.lineData.areaPath || false,
          yAxis: {
            title: this.lineData.yAxis.title || '',
            mutil: { // 如果使用, 指定使用单独坐标系的i, 如：mutil.data=[{i:1, position: 'left'}]
              show: this.lineData.yAxis.mutil ? this.lineData.yAxis.mutil.show : false,
              data: this.lineData.yAxis.mutil ? this.lineData.yAxis.mutil.data : []  // i为在series中的位置，从0开始，position取值：left center right 值, 值想对left
            }
          },
          xAxis: {
            title: this.lineData.xAxis.title || '',
            data: this.lineData.xAxis.data // 必填项
          },
          series: this.lineData.series // 必填项
        }
        // 初始化 全部变量
        this.parentS = d3.select(this.$el)
        this.color = d3.scaleOrdinal(d3.schemeCategory20)
        this.svgWidth = parseInt(this.parentS.style('width'))
        this.svgHeight = parseInt(this.parentS.style('height'))
        this.lineWidth = this.svgWidth - this.padding.left - this.padding.right
        this.lineHeight = this.svgHeight - this.padding.top - this.padding.bottom
        this.svg = this.parentS.selectAll('.line-svg-box')
        if (this.svg.empty()) {
          this.svg = this.parentS.append('svg')
            .attr('class', 'line-svg-box')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight)
        }
        this.axisGroup.xScale = d3.scaleTime()
          .domain([new Date(d3.min(this.line.xAxis.data)), new Date(d3.max(this.line.xAxis.data))])
          .range([0, this.lineWidth])
        this.axisGroup.xScaleCopy = this.axisGroup.xScale.copy()

        this.axisGroup.yScale = d3.scaleLinear()
          .domain([0, getArrMaxData(this.line.series)])
          .range([this.lineHeight, 0])
        this.bisect = d3.bisector(function (d) {
          return new Date(d)
        }).left
        this.draw()
        this.media()
      },

      media () {
        window.addEventListener('resize', () => {
          let width = Math.abs(this.svgWidth - parseFloat(this.parentS.style('width')))
          if (width >= 10) {
            this.svgWidth = parseFloat(this.parentS.style('width'))
          }
        })
      },

      draw () {
        // 使用legend
        if (this.line.legend.show) {
          this.drawLegend()
        }
        // 绘制坐标系
        this.drawAxis()
        // 使用多y轴
        if (this.line.yAxis.mutil.use) {
          // multi === true
        }
        // 绘制折线图
        this.drawLine()

        // 使用tips控制
        if (this.line.showTips) {
          this.useTips()
        }
        // 使用底部滑块控制
        if (this.line.useDrag) {
          this.useDrag()
        }
        // 使用选区以及鼠标滚轮以及触摸板控制
        if (this.line.useZoom) {
          this.useZoom()
        }
      },

      drawLegend () {
        let vm = this
        this.lineGroup.legendsG = this.parentS.selectAll('.legends-group')
        let legendsG = this.lineGroup.legendsG
        let legendItem = legendsG.selectAll('.legend-item').data(this.line.legend.data)
        // add
        let enterLegendItem = legendItem.enter()
        let legendDiv = enterLegendItem.append('div')
          .attr('class', (d, i) => {
            return 'legend-item legend-item' + i
          })
          .on('mousemove', function (d, i) {
            vm.parentS.selectAll('.line-ciecle-item' + i).selectAll('circle')
              .transition()
              .duration(100)
              .attr('r', 5)
          })
          .on('mouseout', function (d, i) {
            vm.parentS.selectAll('.line-ciecle-item' + i).selectAll('circle')
              .transition()
              .duration(100)
              .attr('r', 2.5)
          })
          .on('click', function (d, i) {
            let opacity = parseInt(d3.select(this).select('.legend-i').style('opacity'))
            let t = d3.transition()
              .duration(100)
            d3.select(this).select('.legend-i').transition(t).style('opacity', (opacity === 1) ? 0.5 : 1)
            vm.parentS.select('.line-area-item' + i)
              .transition(t)
              .attr('opacity', (opacity === 1) ? 0 : 1)
            vm.parentS.select('.line-path-item' + i)
              .transition(t)
              .attr('opacity', (opacity === 1) ? 0 : 1)
            vm.parentS.select('.line-ciecle-item' + i)
              .transition(t)
              .attr('opacity', (opacity === 1) ? 0 : 1)
          })
        legendDiv.append('i')
          .attr('class', 'legend-i')
        legendDiv.append('span')
          .attr('class', 'legend-text')
        // update
        legendItem
          .select('.legend-i')
          .style('background-color', (d, i) => {
            return this.color(i)
          })
        legendItem
          .selectAll('.legend-text')
          .text((d) => {
            return d
          })
        // del
        legendItem.exit().remove()
      },

      drawAxis () {
        // x轴坐标系设置
        let xAxis = d3.axisBottom(this.axisGroup.xScale)
          .ticks(5)
          .tickFormat(d3.timeFormat('%Y-%m-%d %H:%M:%S'))
        // 绘制x轴
        this.axisGroup.xAxisG = this.svg.select('.xAxis')
          .call(xAxis)
        // add
        if (this.axisGroup.xAxisG.empty()) {
          this.axisGroup.xAxisG = this.svg.append('g')
            .call(xAxis)
            .attr('class', 'xAxis')
          this.axisGroup.xAxisG.append('text')
            .attr('class', 'xAxis-title')
            .attr('stroke-width', 0)
            .attr('fill', 'black')
            .attr('dy', '1rem')
            .attr('text-anchor', 'start')
          this.axisGroup.xAxisG.append('defs')
            .append('clipPath')
            .attr('id', 'clip-xAxisG')
            .append('rect')
            .attr('height', 20)
        }
        this.axisGroup.xAxisG
          .attr('transform', 'translate(' + this.padding.left + ',' + (this.svgHeight - this.padding.bottom) + ')')
        this.axisGroup.xAxisG.selectAll('.xAxis-title')
          .text(this.line.xAxis.title)
          .attr('transform', 'translate(' + this.lineWidth + ', 0)')
        this.axisGroup.xAxisG.selectAll('#clip-xAxisG').select('rect')
          .attr('width', this.lineWidth + this.padding.right)
        this.axisGroup.xAxisG.attr('clip-path', 'url(#clip-xAxisG)')

        // y轴坐标系设置
        let yAxis = d3.axisLeft(this.axisGroup.yScale).ticks(5)
        // 绘制y轴
        this.axisGroup.yAxisG = this.svg.select('.yAxis')
          .call(yAxis)
        // add
        if (this.axisGroup.yAxisG.empty()) {
          this.axisGroup.yAxisG = this.svg.append('g')
            .call(yAxis)
            .attr('class', 'yAxis')
          this.axisGroup.yAxisG.append('text')
            .attr('class', 'yAxis-title')
            .attr('stroke-width', 0)
            .attr('fill', 'black')
            .attr('text-anthor', 'middle')
        }
        this.axisGroup.yAxisG.attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
        this.axisGroup.yAxisG.selectAll('.yAxis-title').text(this.line.yAxis.title)
      },

      drawLine () {
        this.lineGroup.chartG = this.svg.selectAll('.chart-group')
        if (this.lineGroup.chartG.empty()) {
          this.lineGroup.chartG = this.svg.append('g')
            .attr('class', 'chart-group')
          // 隐藏多余的内容
          this.lineGroup.chartG.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('x', this.padding.left)
            .attr('y', this.padding.top - 5)
          this.lineGroup.chartG.attr('clip-path', 'url(#clip)')
          this.lineGroup.chartG.append('g')
            .attr('class', 'area-group')
          this.lineGroup.chartG.append('g')
            .attr('class', 'path-group')
          this.lineGroup.chartG.append('g')
            .attr('class', 'circle-group')
        }
        this.lineGroup.chartG.selectAll('#clip').select('rect')
          .attr('width', this.lineWidth)
          .attr('height', this.lineHeight + 5)

        this.drawArea() // 绘制路径背景
        this.drawPath() // 绘制路径
        this.drawCircle() // 绘制圆点
      },

      drawArea () {
        let areaG = this.lineGroup.chartG.selectAll('.area-group')
        // 区域生成器，设置x y y0的取值
        let areaLine = d3.area()
          .x((d) => {
            return this.axisGroup.xScale(new Date(d.time))
          })
          .y0(() => {
            return this.svgHeight - this.padding.bottom
          })
          .y1((d) => {
            return this.axisGroup.yScale(d.data) + this.padding.top
          })
        let areaPath = areaG.selectAll('.line-area-item').data(this.line.series)
        let enterAreaPath = areaPath.enter()
        // update
        areaPath.attr('d', (d, i) => {
          /* if (lineData.yAxis.multi && i === 0) {
           areaLine.y1((d) => {
           return y0Scale(d.data) + paddingT
           })
           } else { */
          return areaLine(d)
        })
        // add
        enterAreaPath.append('path')
          .attr('class', (d, i) => {
            return 'line-area-item line-area-item' + i
          })
          .attr('d', (d, i) => {
            /* if (lineData.yAxis.multi && i === 0) {
             areaLine.y1((d) => {
             return y0Scale(d.data) + paddingT
             })
             } else { */
            return areaLine(d)
          })
          .attr('stroke', 'none')
          .attr('fill', (d, i) => {
            return this.color(i)
          })
          .attr('fill-opacity', '.3')
          .attr('transform', 'translate(' + this.padding.left + ')')
        // del
        areaPath.exit().remove()
      },

      drawPath () {
        let pathG = this.lineGroup.chartG.selectAll('.path-group')
        // 线段生成器，设置x y的取值
        let line = d3.line()
          .x((d) => {
            return this.axisGroup.xScale(new Date(d.time))
          })
        let path = pathG.selectAll('.line-path-item').data(this.line.series)
        let enterPath = path.enter()
        // update
        path
          .attr('d', (d) => {
            line.y((dy) => {
              return this.axisGroup.yScale(dy.data) + this.padding.top
            })
            return line(d)
          })
          .attr('stroke-dasharray', function () {
            return this.getTotalLength()
          })
          .attr('stroke-dashoffset', function () {
            let lastOffSet = d3.select(this).attr('data-offset')
            d3.select(this).attr('data-offset', this.getTotalLength())
            let newOffSet = this.getTotalLength() - lastOffSet
            return newOffSet > 0 ? newOffSet : 0
          })
          .transition()
          .duration(500)
          .attr('stroke-dashoffset', 0)

        enterPath.append('path').attr('class', (d, i) => {
          return 'line-path-item line-path-item' + i
        })
          .attr('d', (d) => {
            line.y((dy) => {
              return this.axisGroup.yScale(dy.data) + this.padding.top
            })
            return line(d)
          })
          .attr('stroke', (d, i) => {
            return this.color(i)
          })
          .attr('fill', 'none')
          .attr('transform', 'translate(' + this.padding.left + ')')
          .attr('stroke-dasharray', function () {
            d3.select(this).attr('data-offset', this.getTotalLength())
            return this.getTotalLength()
          })
          .attr('stroke-dashoffset', function () {
            return this.getTotalLength()
          })
          .transition()
          .duration(1000)
          .attr('stroke-dashoffset', 0)

        // del
        path.exit().remove()
      },

      drawCircle () {
        let circleG = this.lineGroup.chartG.selectAll('.circle-group')
        let circleItemG = circleG.selectAll('.line-ciecle-item')
          .data(this.line.series)
        let enterCircleItemG = circleItemG.enter()

        // add
        enterCircleItemG.append('g')
          .attr('class', (d, i) => {
            return 'line-ciecle-item line-ciecle-item' + i
          })
          .attr('transform', 'translate(' + this.padding.left + ', ' + this.padding.top + ')')
          .attr('stroke', (d, i) => {
            return this.color(i)
          })
          .attr('fill', '#fff')
        // del
        circleItemG.exit().remove()

        this.line.series.forEach((item, idx) => {
          item = getNewArr(item, this.axisGroup.xScale.ticks(5).length + 1) // 与 x轴个数同步

          let parentG = this.svg.selectAll('.line-ciecle-item' + idx)
          let circle = parentG.selectAll('circle')
            .data(item)
          let enterCircle = circle.enter()
          // update
          circle.attr('cx', (d) => {
            return this.axisGroup.xScale(new Date(d.time))
          })
            .attr('cy', (d) => {
              /* if (lineData.yAxis.multi && idx === 0) {
               return y0Scale(d.data)
               } else { */
              return this.axisGroup.yScale(d.data)
            })
          // add
          enterCircle.append('circle')
            .attr('cx', (d) => {
              return this.axisGroup.xScale(new Date(d.time))
            })
            .attr('cy', (d) => {
              /* if (lineData.yAxis.multi && idx === 0) {
               return y0Scale(d.data)
               } else { */
              return this.axisGroup.yScale(d.data)
            })
            .attr('r', 2.5)
            .style('cursor', 'pointer')
            .attr('opacity', 0)
            .transition()
            .duration(700)
            .delay(300)
            .attr('opacity', 1)
          // del
          circle.exit().remove()
        })
      },

      useTips () {
        this.lineGroup.tipsG = this.svg.selectAll('.tips-group')
        if (this.lineGroup.tipsG.empty()) {
          this.lineGroup.tipsG = this.svg.append('g')
            .attr('class', 'tips-group')
        }
        let tipsRect = this.lineGroup.tipsG.selectAll('.mousemove-rect')
        if (tipsRect.empty()) {
          tipsRect = this.lineGroup.tipsG.append('rect')
            .attr('class', 'mousemove-rect')
        }

        // 函数内部访问 vue实例
        let vm = this

        tipsRect.attr('width', this.lineWidth)
          .attr('height', this.lineHeight)
          .attr('x', this.padding.left)
          .attr('y', this.padding.top)
          .attr('fill', 'none')
          .style('pointer-events', 'all')
          .on('mouseover', function () {
            vm.parentS.select('.tips-content').transition().duration(200).style('display', 'block')
            vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'block')
          })
          .on('mouseout', function () {
            vm.parentS.select('.tips-content').transition().duration(200).style('display', 'none')
            vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'none')
          })
          .on('mousemove', function () {
            vm.showTip(d3.mouse(this))
          })
      },

      showTip (mouseP) {
        let vm = this
        // 获取x轴坐标
        let x0 = this.axisGroup.xScale.invert(mouseP[0] - this.padding.left)
        let i = this.bisect(this.line.xAxis.data, x0)
        let d0 = this.line.xAxis.data[i - 1]
        let d1 = this.line.xAxis.data[i]
        let d = new Date((x0 - d0) > (d1 - x0) ? d1 : d0)
        // 获取交点 y轴坐标
        let points = []
        this.line.series.forEach((item) => {
          item.forEach((ditem) => {
            if (Date.parse(ditem.time) === Date.parse(d)) {
              points.push(ditem.data)
            }
          })
        })

        // 绘制垂直线以及圆点
        let tipsLineG = this.lineGroup.tipsG.selectAll('.tips-line-groups')
        tipsLineG.selectAll('.tips-line').attr('x1', this.axisGroup.xScale(d) + this.padding.left)
          .attr('x2', this.axisGroup.xScale(d) + this.padding.left)
        if (tipsLineG.empty()) {
          this.lineGroup.tipsG.append('g')
            .attr('class', 'tips-line-groups')
            .append('line')
            .attr('class', 'tips-line')
            .attr('x1', this.axisGroup.xScale(d))
            .attr('y1', this.padding.top)
            .attr('x2', this.axisGroup.xScale(d))
            .attr('y2', this.svgHeight - this.padding.bottom)
            .attr('stroke', '#999')
            .on('mouseover', function () {
              vm.parentS.select('.tips-content').transition().duration(200).style('display', 'block')
              vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'block')
            })
            .on('mouseout', function () {
              vm.parentS.select('.tips-content').transition().duration(200).style('display', 'none')
              vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'none')
            })
        }
        let tipsLineCircle = tipsLineG.selectAll('.tips-circle').data(points)
        tipsLineCircle
          .attr('cx', this.axisGroup.xScale(d) + this.padding.left)
          .attr('cy', (d) => {
            return this.axisGroup.yScale(d) + this.padding.top
          })
          .attr('opacity', (d, i) => {
            if (!this.line.legend.show || this.line.legend.data.length <= 0) {
              return 1
            } else {
              let opacity = vm.parentS.selectAll('.legend-item' + i).selectAll('.legend-i').style('opacity')
              return (parseInt(opacity) === 1) ? 1 : 0
            }
          })
        let enterTipsLineCircle = tipsLineCircle.enter()
        enterTipsLineCircle.append('circle')
          .attr('class', 'tips-circle')
          .attr('cx', this.axisGroup.xScale(d) + this.padding.left)
          .attr('cy', (d) => {
            return this.axisGroup.yScale(d) + this.padding.top
          })
          .attr('stroke', (d, i) => {
            return this.color(i)
          })
          .attr('fill', '#fff')
          .attr('opacity', (d, i) => {
            if (!this.line.legend.show || this.line.legend.data.length <= 0) {
              return 1
            } else {
              let opacity = vm.parentS.selectAll('.legend-item' + i).selectAll('.legend-i').style('opacity')
              return (parseInt(opacity) === 1) ? 1 : 0
            }
          })
          .on('mouseover', function () {
            vm.parentS.select('.tips-content').transition().duration(200).style('display', 'block')
            vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'block')
          })
          .on('mouseout', function () {
            vm.parentS.select('.tips-content').transition().duration(200).style('display', 'none')
            vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'none')
          })
          .attr('r', 5)
        tipsLineCircle.exit().remove()

        // tip框填充相应文字数据
        let timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S')
        let tipsContent = vm.parentS.selectAll('.tips-content')
        let tipsTitle = tipsContent.selectAll('.tips-title')
        tipsTitle.text('时间: ' + timeFormat(d))
        if (tipsTitle.empty()) {
          tipsContent.append('p')
            .attr('class', 'tips-title')
            .text('时间: ' + timeFormat(d))
        }
        let tipItem = tipsContent.selectAll('.tip-item').data(points)
        // update
        tipItem.style('display', (d, i) => {
          if (!this.line.legend.show || this.line.legend.data.length <= 0) {
            return 'block'
          } else {
            let opacity = vm.parentS.selectAll('.legend-item' + i).selectAll('.legend-i').style('opacity')
            return (parseInt(opacity) === 1) ? 'block' : 0
          }
        })
        tipItem.select('i')
          .style('background-color', (d, i) => {
            return this.color(i)
          })
        tipItem.select('span')
          .text((d, i) => {
            if (!this.line.legend.show || this.line.legend.data.length <= 0) {
              return d
            } else {
              return this.line.legend.data[i] + ' : ' + d
            }
          })
        // add
        let enterTipItem = tipItem.enter()
        let tipItemDiv = enterTipItem
          .append('div')
          .attr('class', 'tip-item')
          .style('display', (d, i) => {
            if (!this.line.legend.show || this.line.legend.data.length <= 0) {
              return 'block'
            } else {
              let opacity = vm.parentS.selectAll('.legend-item' + i).selectAll('.legend-i').style('opacity')
              return (parseInt(opacity) === 1) ? 'block' : 0
            }
          })
        tipItemDiv.append('i')
          .attr('class', 'tip-i')
          .style('background-color', (d, i) => {
            return this.color(i)
          })
        tipItemDiv.append('span')
          .attr('class', 'tip-text')
          .text((d, i) => {
            if (!this.line.legend.show || this.line.legend.data.length <= 0) {
              return d
            } else {
              return this.line.legend.data[i] + ' : ' + d
            }
          })
        // del
        tipItem.exit().remove()

        // tip框位置处理 边界处理
        let svgCenterW = this.svgWidth / 2
        let svgCenterH = this.svg / 2
        let tipsL
        let tipsT
        if (mouseP[0] > svgCenterW) {
          tipsL = mouseP[0] - parseInt(tipsContent.style('width')) - 20 + 'px'
        } else {
          tipsL = mouseP[0] + 20 + 'px'
        }
        if (mouseP[1] > svgCenterH) {
          tipsT = mouseP[1] - parseInt(tipsContent.style('height')) - 20 + 'px'
        } else {
          tipsT = mouseP[1] + 20 + 'px'
        }
        tipsContent.style('left', tipsL)
          .style('top', tipsT)
      },

      useDrag () {
        let vm = this // vue 实例
        this.lineGroup.dragG = this.svg.selectAll('.drag-group')
        if (this.lineGroup.dragG.empty()) {
          this.lineGroup.dragG = this.svg.append('g')
            .attr('class', 'drag-group')
        }
        // 矩形边框
        let dragRectBox = this.lineGroup.dragG.selectAll('.drag-rect-box')
        if (dragRectBox.empty()) {
          dragRectBox = this.lineGroup.dragG.append('rect')
            .attr('class', 'drag-rect-box')
        }
        dragRectBox.attr('width', this.lineWidth)
          .attr('height', 15)
          .attr('x', this.padding.left)
          .attr('y', this.svgHeight - this.padding.bottom / 2)
          .attr('stroke', '#E8E8E8')
          .attr('fill', 'none')

        // 蓝色矩形块 拖动

        let rectDrag = d3.drag()
          .on('start', function () {
            d3.select(this)
              .attr('data-mouse-x', d3.mouse(this)[0])
          })
          .on('drag', function () {
            let lastMouseX = d3.select(this).attr('data-mouse-x')
            let moveLength = parseFloat(d3.mouse(this)[0] - lastMouseX)
            let x = parseFloat(d3.select(this).attr('x')) + moveLength
            if (x <= vm.padding.left) {
              x = vm.padding.left
            } else if (x + parseFloat(d3.select(this).attr('width')) >= vm.lineWidth + vm.padding.left) {
              x = vm.lineWidth - parseFloat(d3.select(this).attr('width')) + vm.paddingleft
            }
            // 矩形位置控制
            d3.select(this)
              .attr('x', x)
            d3.select(this).attr('data-mouse-x', d3.mouse(this)[0])

            // 滑块位置控制
            let rect0 = vm.parentS.select('.rect-box0')
            let rect1 = vm.parentS.select('.rect-box1')
            if (parseFloat(rect0.attr('x')) > parseFloat(rect1.attr('x'))) {
              rect0 = vm.parentS.select('.rect-box1')
              rect1 = vm.parentS.select('.rect-box0')
            }
            let x0 = vm.axisGroup.xScaleCopy.invert(x - vm.padding.left)
            let x1 = vm.axisGroup.xScaleCopy.invert(x + parseFloat(d3.select(this).attr('width') - vm.padding.left))
            rect0.attr('x', x)
              .attr('data-x', x)
              .attr('data-time', x0)
            rect1.attr('x', x + parseFloat(d3.select(this).attr('width')) - 10)
              .attr('data-x', x + parseFloat(d3.select(this).attr('width')) - 10)
              .attr('data-time', x1)

            // 计算x轴 y轴 新的定义域【】，值域不变
            let idxL = vm.bisect(vm.line.xAxis.data, x0)
            let idxR = vm.bisect(vm.line.xAxis.data, x1)
            vm.axisGroup.xScale.domain([x0, x1])
            if (Math.abs(idxR - idxL) > 2) {
              vm.axisGroup.yScale.domain([0, getArrMaxData(vm.line.series, idxL, idxR + 1)])
            }
            vm.drawAxis()
            vm.drawLine()
          })
        // 矩形背景蓝色
        let dragRect = this.lineGroup.dragG.selectAll('.drag-rect')
        if (dragRect.empty()) {
          dragRect = this.lineGroup.dragG.append('rect')
            .attr('class', 'drag-rect')
        }
        dragRect
          .attr('width', () => {
            let width = this.lineWidth
            if (!this.parentS.select('.rect-box0').empty()) {
              let xA = this.axisGroup.xScaleCopy(new Date(this.parentS.select('.rect-box0').attr('data-time'))) + this.padding.left
              let xB = this.axisGroup.xScaleCopy(new Date(this.parentS.select('.rect-box1').attr('data-time'))) + this.padding.left
              width = (xB - xA) > 0 ? xB - xA : xA - xB
            }
            return width
          })
          .attr('height', 15)
          .attr('x', () => {
            let x = this.padding.left
            if (!this.parentS.select('.rect-box0').empty()) {
              let xA = this.axisGroup.xScaleCopy(new Date(this.parentS.select('.rect-box0').attr('data-time'))) + x
              let xB = this.axisGroup.xScaleCopy(new Date(this.parentS.select('.rect-box1').attr('data-time'))) + x
              x = (xB - xA) > 0 ? xA : xB
            }
            return x
          })
          .attr('y', this.svgHeight - this.padding.bottom / 2)
          .attr('stroke', 'none')
          .attr('fill', this.color(0))
          .attr('fill-opacity', 0.5)
          .style('cursor', 'pointer')
          .call(rectDrag)
        // 两端滑块 拖动
        let drag = d3.drag()
          .on('drag', function () {
            // 滑块位置控制
            let rectX = d3.mouse(this)[0]
            let rectDataTimeX = rectX - vm.padding.left
            if (parseFloat(d3.mouse(this)[0]) <= parseFloat(vm.padding.left)) {
              rectX = vm.padding.left
              rectDataTimeX = rectX - vm.padding.left
            } else if (parseFloat(d3.mouse(this)[0]) >= parseFloat(vm.svgWidth - vm.padding.left)) {
              rectX = vm.svgWidth - vm.padding.right - 10
              rectDataTimeX = rectX - vm.padding.left + 10
            }
            d3.select(this).select('.rect-box')
              .attr('x', rectX)
              .attr('data-x', rectX)
              .attr('data-time', vm.axisGroup.xScaleCopy.invert(rectDataTimeX))

            // 控制条宽度以及位置更改
            let xA = vm.axisGroup.xScaleCopy(new Date(vm.parentS.select('.rect-box0').attr('data-time'))) + vm.padding.left
            let xB = vm.axisGroup.xScaleCopy(new Date(vm.parentS.select('.rect-box1').attr('data-time'))) + vm.padding.left
            vm.parentS.select('.drag-rect')
              .attr('width', (xB - xA) > 0 ? (xB - xA) : (xA - xB))
              .attr('x', (xB - xA) > 0 ? xA : xB)

            // 计算x轴 y轴 新的定义域【】，值域不变
            let x0 = new Date(vm.parentS.select('.rect-box0').attr('data-time'))
            let x1 = new Date(vm.parentS.select('.rect-box1').attr('data-time'))
            let idxL
            let idxR
            if (xA > xB) {
              x0 = new Date(vm.parentS.select('.rect-box1').attr('data-time'))
              x1 = new Date(vm.parentS.select('.rect-box0').attr('data-time'))
            }
            idxL = vm.bisect(vm.line.xAxis.data, x0)
            idxR = vm.bisect(vm.line.xAxis.data, x1)
            vm.axisGroup.xScale.domain([x0, x1])
            if (Math.abs(idxR - idxL) > 2) {
              vm.axisGroup.yScale.domain([0, getArrMaxData(vm.line.series, idxL, idxR + 1)])
            }
            vm.drawAxis()
            vm.drawLine()
          })
        let rectData = [{x: this.padding.left}, {x: this.svgWidth - this.padding.right - 10}]
        let dragMark = this.lineGroup.dragG.selectAll('g').data(rectData)
        // update 自适应窗口 位置变化
        dragMark.select('.rect-box')
          .attr('x', function (d, i) {
            let x = vm.axisGroup.xScaleCopy(new Date(d3.select(this).attr('data-time'))) + vm.padding.left
            if (i === 1) {
              x = x - 10
            }
            return x
          })
          .attr('data-x', function () {
            return vm.axisGroup.xScaleCopy(new Date(d3.select(this).attr('data-time'))) + vm.padding.left
          })
        // add
        let enterDragMark = dragMark.enter()
        enterDragMark.append('g')
          .attr('class', (d, i) => {
            return 'drag-mark drag-mark' + i
          })
          .style('cursor', 'pointer')
          .call(drag)
          .append('rect')
          .attr('class', (d, i) => {
            return 'rect-box rect-box' + i
          })
          .attr('width', 10)
          .attr('height', 15)
          .attr('x', (d) => {
            return d.x
          })
          .attr('y', this.svgHeight - this.padding.bottom / 2)
          .attr('data-x', (d) => {
            return d.x
          })
          .attr('data-time', (d, i) => {
            let dataTime = i === 0 ? this.axisGroup.xScaleCopy.invert(d.x - this.padding.left) : this.axisGroup.xScaleCopy.invert(d.x - this.padding.left + 10)
            return dataTime
          })
          .attr('stroke', 'none')
          .attr('fill', this.color(0))

        dragMark.exit().remove()
      },

      useZoom () {
        let vm = this // vue 实例
        // 鼠标选区放大缩小 滚轮／触摸板放大缩小
        let zoom = d3.zoom()
          .scaleExtent([1, 10])
          .on('start', function () {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousedown') {
              vm.mouseChange(0, d3.mouse(this))
            }
          })
          .on('zoom', function () {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
              vm.parentS.select('.tips-content').transition().duration(200).style('display', 'none')
              vm.parentS.select('.tips-line-groups').transition().duration(200).style('display', 'none')
              vm.mouseChange(1, d3.mouse(this))
            }
            /* if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'wheel') {
             wheelChange(d3.zoomTransform(this), d3.mouse(this))
             } */
          })
          .on('end', function () {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mouseup') {
              vm.mouseChange(2, d3.mouse(this))
            }
          })
        this.svg.call(zoom)
      },

      mouseChange (type, mouseP) {
        let vm = this // vue 实例
        let mouseG = this.svg.selectAll('.mouse-group')
        let mouseRect = mouseG.selectAll('.mouse-rect')
        if (mouseG.empty()) {
          mouseRect = this.svg.append('g')
            .attr('class', 'mouse-group')
            .append('rect')
            .attr('class', 'mouse-rect')
            .attr('fill', '#fff')
            .attr('stroke', '#ccc')
            .attr('opacity', 0.7)
            .attr('stroke-dasharray', '5, 5')
        }

        let dataX, dataY
        if (type === 0) {
          mouseRect.attr('x', mouseP[0])
            .attr('y', mouseP[1])
            .attr('width', 0)
            .attr('height', 0)
            .attr('data-x', mouseP[0])
            .attr('data-y', mouseP[1])
        } else if (type === 1) {
          dataX = mouseRect.attr('data-x')
          dataY = mouseRect.attr('data-y')
          let rectWidth = Math.abs(mouseP[0] - dataX)
          let rectHeight = Math.abs(mouseP[1] - dataY)
          mouseRect
            .attr('width', rectWidth <= 3 ? 0 : rectWidth)
            .attr('height', rectHeight <= 3 ? 0 : rectHeight)
            .attr('x', mouseP[0] - dataX > 0 ? dataX : mouseP[0])
            .attr('y', mouseP[1] - dataY > 0 ? dataY : mouseP[1])
        } else {
          dataX = mouseRect.attr('data-x')
          if (Math.abs(mouseP[0] - dataX) <= 3) {
            mouseG.remove()
            return false
          }
          let x0 = this.axisGroup.xScale.invert(dataX - this.padding.left)
          let x1 = this.axisGroup.xScale.invert(mouseP[0] - this.padding.left)
          if (dataX > mouseP[0]) {
            x0 = this.axisGroup.xScale.invert(mouseP[0] - this.padding.left)
            x1 = this.axisGroup.xScale.invert(dataX - this.padding.left)
          }
          this.axisGroup.xScale.domain([x0, x1])

          // 关联 drag
          if (!this.parentS.select('.rect-box0').empty()) {
            // 滑块
            this.parentS.select('.rect-box0')
              .attr('x', this.axisGroup.xScaleCopy(new Date(x0)) + this.padding.left)
              .attr('data-x', this.axisGroup.xScaleCopy(new Date(x0)) + this.padding.left)
              .attr('data-time', x0)
            this.parentS.select('.rect-box1')
              .attr('x', this.axisGroup.xScaleCopy(new Date(x1)) + this.padding.left - 10)
              .attr('data-x', this.axisGroup.xScaleCopy(new Date(x1)) + this.padding.left - 10)
              .attr('data-time', x1)

            // 控制条宽度以及位置更改
            this.parentS.select('.drag-rect')
              .attr('width', this.axisGroup.xScaleCopy(new Date(x1)) - this.axisGroup.xScaleCopy(new Date(x0)))
              .attr('x', this.axisGroup.xScaleCopy(new Date(x0)) + this.padding.left)
          }

          mouseG.remove()
          this.drawAxis()
          this.drawLine()
          let backG = this.parentS.selectAll('.back-line')
          backG.style('display', 'block')
            .style('right', this.padding.right + 'px')
            .on('click', function () {
              vm.axisGroup.xScale
                .domain([new Date(d3.min(vm.line.xAxis.data)), new Date(d3.max(vm.line.xAxis.data))])
              vm.drawAxis()
              vm.drawLine()
              d3.select(this).style('display', 'none')
              // 关联 drag 滑块复原
              if (!vm.parentS.select('.rect-box0').empty()) {
                // 滑块
                vm.parentS.select('.rect-box0')
                  .attr('x', vm.padding.left)
                  .attr('data-x', vm.padding.left)
                  .attr('data-time', new Date(d3.min(vm.line.xAxis.data)))
                vm.parentS.select('.rect-box1')
                  .attr('x', vm.lineWidth + vm.padding.left - 10)
                  .attr('data-x', vm.lineWidth + vm.padding.left - 10)
                  .attr('data-time', new Date(d3.max(vm.line.xAxis.data)))

                // 控制条宽度以及位置更改
                vm.parentS.select('.drag-rect')
                  .attr('width', vm.lineWidth)
                  .attr('x', vm.padding.left)
              }
            })
        }
      }
    },

    mounted () {
      if (!_.isEmpty(this.lineData)) {
        this.init()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../assets/css/base/methods.styl'

  .line-box {
    position relative
    font-size 12px
    color $font-color
    & svg {
      b-box-shadow(0 0 4px 0 $shadow-color)
      b-border-radius(2px)
    }
    & .chart-title {
      position absolute
      font-size 13px
      left 5px
      top 5px
    }
    & .legends-group, & .tips-content, & .back-line {
      position absolute
    }

    & .legends-group, & .tips-content {
      & i {
        display inline-block
        vertical-align middle
        margin-right 5px
      }
      position absolute
    }

    & .legends-group {
      top 5px
      right 5px
      & .legend-item {
        display inline-block
        padding-left 10px
        cursor pointer
        & .legend-i {
          width 23px
          height 13px
          b-border-radius(3px)
          opacity 1
        }
      }
    }

    & .tips-content {
      display none
      padding 5px
      min-width 100px
      max-width 200px
      background-color rgba(0, 0, 0, .4)
      color $bg-white
      b-border-radius(4px)
      & .tip-item {
        & .tip-i {
          width 10px
          height 10px
          b-border-radius(50%)
        }
      }
    }

    & .back-line {
      display none
      top 30px
      right 0
      background-color rgba(255, 255, 255, .8)
      padding 0 8px
      outline none
      border 1px solid $shadow-point-color
      cursor pointer
      b-border-radius(3px)
      &:hover {
        color $theme-color
        border-color $theme-sub-color
      }
    }
  }
</style>
