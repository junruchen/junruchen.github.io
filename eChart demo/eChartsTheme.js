export const theme = {
  'color': [
    '#5588aa',
    '#ffbb33',
    '#DE3331',
    '#959595'
  ],
  'backgroundColor': '#ffffff',
  'title': {
    'textStyle': {
      'color': '#2a3542',
      'fontWeight': '400',
      'fontFamily': 'PingFang SC',
      'fontSize': 13
    }
  },
  'legend': {
    'show': true,
    'itemHeight': 10
  },
  'grid': {
    'top': 35,
    'left': 50,
    'right': 0,
    'bottom': 53
  },
  'pie': {
    'hoverAnimation': false,
    'center': ['50', '50'],
    'radius': '100%',
    'label': {
      'normal': {
        'show': true,
        'position': 'inside'
      }
    }
  },
  'graph': {
    'force': {
      'repulsion': 500,
      'edgeLength': 100
    },
    'top': 50,
    'left': 'center',
    'bottom': 50,
    'focusNodeAdjacency': true,
    'hoverAnimation': true,
    'animationDuration': 3000,
    'animationEasingUpdate': 'quinticInOut',
    'itemStyle': {
      'normal': {
        'color': '#58a'
      }
    },
    'lineStyle': {
      'normal': {
        'color': {
          'type': 'linear',
          'colorStops': [{
            'offset': 0, 'color': '#58a'
          }, {
            'offset': 1, 'color': '#fb3'
          }]
        },
        'curveness': 0,
        'type': 'solid'
      }
    },
    'label': {
      'normal': {
        'show': true,
        'position': 'top'
      }
    },
    'roam': 'move'
  },
  'xAxis': [{
    'boundaryGap': false,
    'splitNumber': 10,
    'axisTick': {
      'interval': 6,
      'length': 5
    },
    'axisLabel': {
      'interval': 6,
      'showMaxLabel': false
    },
    'splitLine': {
      'show': false
    }
  }],
  'yAxis': [{
    'type': 'value',
    'splitLine': {
      'show': true
    }
  }]
}
