<template>
  <div :class="type"></div>
</template>
<script>
  import echarts from 'echarts'
  import _ from 'lodash'

  export default{
    name: 'Chart',

    props: ['echart', 'type'],

    watch: {
      'echart': {
        handler () {
          this.getChart()
        },
        deep: true
      }
    },

    methods: {
      getChart () {
        let echartItem = echarts.init(this.$el, 'normal')
        let option = {}

        if (this.type === 'pie') {
          option = {
            title: {
              text: this.echart.title,
              bottom: 'bottom',
              x: 'center'
            },
            legend: {
              bottom: '18',
              itemWidth: 10,
              data: this.echart.legend
            },
            toolTip: {
              show: false
            },
            series: {
              type: 'pie',
              data: this.echart.series,
              label: {
                normal: {
                  formatter: '{d}%'
                }
              }
            }
          }
        }
        if (this.type === 'line') {
          option = {
            title: {
              text: this.echart.title,
              left: 'left'
            },
            legend: {
              show: true,
              left: 'right',
              itemWidth: 15,
              data: this.echart.legend
            },
            dataZoom: {
              type: 'slider',
              orient: 'horizontal',
              height: 15,
              width: '50%',
              x: 'center',
              y: this.echart.dataZoomY || 145,
              backgroundColor: 'rgba(0,0,0,0)',
              dataBackgroundColor: '#eee',
              fillerColor: 'rgba(144,197,237,0.2)',
              handleColor: 'rgba(70,130,180,01)'
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              axisPointer: {
                axis: 'x'
              }
            },
            xAxis: [{
              boundaryGap: false,
              axisLabel: {
                formatter: (val) => {
                  return val.split(' ').join('\n')
                }
              },
              data: this.echart.xAxis
            }],
            yAxis: [{
              splitLine: {
                lineStyle: {
                  color: '#f1f2f7'
                }
              }
            }],
            series: this.echart.series
          }
        }
        if (this.type === 'graph') {
          if (_.isEmpty(this.echart.instance)) {
            return false
          }
          this.echart.instance.forEach((item, idx) => {
            item.ctime = item.ctime.replace('T', ' ').split('.')[0]
            item.name = item.name || '暂未获取到实例名称'
            item.symbol = 'image://static/database.png'
            item.draggable = true
            item.symbolSize = (idx === 0) ? 20 : 13
            item.x = (idx === 0) ? 40 : 40 * idx
            item.y = (idx === 0) ? 0 : 50
          })
          this.echart.link.forEach((item, idx) => {
            item.source = 0
            item.target = idx + 1
          })

          option = {
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: (params) => {
                let val = 'name: ' + params.data.name +
                  '<br>ctime: ' + params.data.ctime +
                  '<br>status: ' + params.data.status +
                  '<br>pool: ' + params.data.pool +
                  '<br>type: ' + params.data.type +
                  '<br>version: ' + params.data.version
                return val
              }
            },
            series: {
              type: 'graph',
              data: this.echart.instance,
              links: this.echart.link
            }
          }
        }
        echartItem.setOption(option)

        echartItem.on('click', (params) => {
          if (this.type === 'graph' && params.data.id) {
            this.$router.push({name: 'instanceInfo', params: {id: params.data.id}})
          }
        })

        window.addEventListener('resize', function () {
          echartItem.resize()
        })
      }
    },

    mounted () {
      if (!_.isEmpty(this.echart)) {
        this.getChart()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  /*.pie {
    width 100px
    height 140px
  }*/

  .line, .graph {
    width 100%
    height 100%
  }
</style>
