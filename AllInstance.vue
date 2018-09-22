<template>
  <el-main class="datav-main">
    <div class="three-container" ref="threeContainer"></div>
    <div class="datav-three-menu">
      <button :class="['helix-btn', {'active': targetType === 'helix'}]" @click="changeStructur('helix')">螺旋状</button>
      <button :class="['sphere-btn', {'active': targetType === 'sphere'}]" @click="changeStructur('sphere')">球状</button>
      <button :class="['grid-btn', {'active': targetType === 'grid'}]" @click="changeStructur('grid')">网格状</button>
      <button class="back-btn" @click="$router.push('/dashboard/datav')">返回</button>
    </div>
  </el-main>
</template>

<script>
  /* global TWEEN */
  import {getAllInstanceAPI} from '@/apis'
  import * as THREE from 'three'
  import {
    CSS3DRenderer,
    CSS3DObject,
    TrackballControls
  } from '@/utils'
  const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
  const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
  export default {
    name: 'DashboardDatavInstance',

    data () {
      return {
        allInstanceList: [],
        instanceData: this.getRandomData(200),
        objects: [], // 记录每一组数据的结构，包括位置信息等
        scene: null, // 场景
        group: null,
        camera: null, // 相机
        renderer: null, // 渲染器
        controls: null, // 控制器，控制触摸板操作
        targets: {grid: [], helix: [], sphere: []}, // 保存三种类型结构
        targetType: 'helix', // 标记当前类型 [sphere, helix, gard]
        statusColor: {
          running: '143, 232, 245, ',
          alert: '255, 128, 101, ',
          stop: '162, 162, 162, ',
          unknow: '162, 162, 162, '
        },
        icons: {
          oracle: 'icon-db-Oracle',
          mysql: 'icon-db-MySQL',
          redis: 'icon-db-Redis'
        }
      }
    },

    components: {},

    methods: {
      getRandomData (count) {
        let testData = []
        for (let j = 1; j < count + 1; j++) {
          testData.push({
            instanceId: j,
            instance: 'qZGXQIUbr.oracle.bst.com.cn' + j,
            service: '测试服务' + j,
            status: j % 9 === 0 ? 'alert' : j % 7 === 0 ? 'stop' : 'running',
            dbType: j % 3 === 0 ? 'oracle' : j % 4 === 0 ? 'redis' : 'mysql',
            nodeType: 'node 11g ' + j,
            pool: '47.92.38.5' + j,
            runningTime: '39天 14小时 8分 44秒'
          })
        }
        return testData
      },

      init () {
        // 定义场景与远景相机(PerspectiveCamera)[视角、长宽比、近裁剪面、远裁剪面]
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = 1900
        this.scene = new THREE.Scene()
        this.group = new THREE.Group()
        this.scene.add(this.group)

        // 初始化
        this.allInstanceList.forEach((item) => {
          let color = this.statusColor[item.status] || this.statusColor.unknow
          let element = document.createElement('div')
          element.className = 'datav-three-element'
          element.setAttribute('data-db-type', item.dbType)
          element.setAttribute('data-instance-id', item.instanceId)
          element.style.backgroundColor = 'rgba(' + color + (Math.random() * 0.5 + 0.25) + ')'
          element.style.borderColor = 'rgba(' + color + ' .4)'

          let icon = document.createElement('i')
          icon.className = this.icons[item.dbType]
          element.appendChild(icon)

          let nodeType = document.createElement('h6')
          nodeType.className = 'node-type nowrap'
          nodeType.innerHTML = item.nodeType
          element.appendChild(nodeType)

          let instanceName = document.createElement('h6')
          instanceName.className = 'title nowrap'
          instanceName.innerHTML = item.instance
          element.appendChild(instanceName)

          let details = document.createElement('div')
          details.className = 'details'
          details.innerHTML = item.service + '<br>' + item.pool
          element.appendChild(details)

          let object = new CSS3DObject(element)
          object.position.x = Math.random() * 4000 - 2000
          object.position.y = Math.random() * 4000 - 2000
          object.position.z = Math.random() * 4000 - 2000
          this.group.add(object)

          this.objects.push(object)
        })

        // 获取sphere结构
        let sphereVector = new THREE.Vector3()
        let spherical = new THREE.Spherical()
        let len = this.objects.length
        this.objects.forEach((item, i) => {
          let phi = Math.acos(-1 + (2 * i) / len)
          let theta = Math.sqrt(len * Math.PI) * phi
          let object = new THREE.Object3D()
          spherical.set(800, phi, theta)
          object.position.setFromSpherical(spherical)
          sphereVector.copy(object.position).multiplyScalar(2)
          object.lookAt(sphereVector)
          this.targets.sphere.push(object)
        })

        // 获取helix结构
        let helixVector = new THREE.Vector3()
        let cylindrical = new THREE.Cylindrical()
        this.objects.forEach((item, i) => {
          let theta = i * 0.175 + Math.PI
          let y = -(i * 8) + 450
          let object = new THREE.Object3D()
          cylindrical.set(900, theta, y)
          object.position.setFromCylindrical(cylindrical)
          helixVector.x = object.position.x * 2
          helixVector.y = object.position.y
          helixVector.z = object.position.z * 2
          object.lookAt(helixVector)
          this.targets.helix.push(object)
        })

        // 获取grid结构
        this.objects.forEach((item, i) => {
          let object = new THREE.Object3D()
          object.position.x = ((i % 5) * 400) - 800
          object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800
          object.position.z = (Math.floor(i / 25)) * 1000 - 2000
          this.targets.grid.push(object)
        })

        // 定义渲染
        this.renderer = new CSS3DRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.$refs.threeContainer.appendChild(this.renderer.domElement)
        this.controls = new TrackballControls(this.camera, this.renderer.domElement)
        this.controls.rotateSpeed = 0.5
        this.controls.minDistance = 500
        this.controls.maxDistance = 6000
        this.controls.addEventListener('change', this.render)

        this.transform(this.targets.helix, 1000)

        window.addEventListener('resize', this.onWindowResize, false)
      },

      onDocumentMouseDown (event) {
        event.preventDefault()
        let dbType = event.currentTarget.getAttribute('data-db-type')
        let instanceId = event.currentTarget.getAttribute('data-instance-id')
        const {href} = this.$router.resolve({
          path: '/instance/' + dbType + '/' + instanceId
        })
        window.open(href, '_blank')
      },

      changeStructur (type) {
        this.transform(this.targets[type], 1000)
        this.targetType = type
      },

      transform (targets, duration) {
        this.group.rotation.y = 0
        this.camera.position.y = 0
        this.camera.position.x = 0
        this.camera.position.z = 1900

        TWEEN.removeAll()

        this.objects.forEach((item, i) => {
          var object = item
          var target = targets[i]

          // 更改对象位置，to({}, duration)， {}：对象属性的具体变化，duration：时间
          // start激活动画，为了得到平滑的效果，需要使用requestAnimationFrame，在循环函数中一直调用update方法
          new TWEEN.Tween(object.position)
            .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()

          new TWEEN.Tween(object.rotation)
            .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
        })

        new TWEEN.Tween(this)
          .to({}, duration * 2)
          .onUpdate(this.render)
          .start()
      },

      onWindowResize () {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
      },

      animate () {
        this.rAnimation = requestAnimationFrame(this.animate)
        // 将会更新所有被激活的Tweens动画，即transform中定义的动画
        // update方法会明确告诉TweenJS什么时候开始运行
        TWEEN.update()
        this.controls.update()
        if (this.group && this.targetType !== 'grid') {
          this.group.rotation.y -= 0.001
        }
        this.render()
      },

      render () {
        this.renderer.render(this.scene, this.camera)
      },

      getAllInstance () {
        getAllInstanceAPI().then((res) => {
          if (res.data.status === 200) {
            this.allInstanceList = res.data.result.slice(0, 120) || []
            this.init()
            this.animate()
            let nodes = [...document.querySelectorAll('.datav-three-element')]
            nodes.forEach((node) => {
              node.addEventListener('click', this.onDocumentMouseDown, false)
            })
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    },

    mounted () {
      this.getAllInstance()
    },

    destroyed () {
      window.removeEventListener('click', this.onDocumentMouseDown, false)
      window.removeEventListener('resize', this.onWindowResize, false)
      window.removeEventListener('change', this.render, false)
      cancelAnimationFrame(this.rAnimation)
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .datav-main {
    position relative
    height 100%
    background url("/static/img/datav-bg.png") center center / cover no-repeat
  }

  .datav-three-menu {
    position absolute
    top 30px
    left 40px
    text-align left
    & button {
      display block
      outline none
      width 100px
      line-height 36px
      font-size 13px
      border-radius 2px
      border 1px solid rgba(125, 206, 223, 1)
      color #dcf9ff
      background rgba(125, 206, 223, 0.5)
      margin-bottom 25px
      transition all 1s
      &.active {
        background rgba(125, 206, 223, 0.7)
        box-shadow 0 0 12px 2px rgba(125, 206, 223, 0.7)
        width 120px
        line-height 40px
        margin-left -10px
      }
      &.back-btn {
        border 1px solid #a2a2a2
        color #dedddd
        background rgba(179, 179, 179, 0.5)
        &:hover {
          background rgba(179, 179, 179, 0.7)
        }
      }
      &:hover {
        background rgba(125, 206, 223, 0.7)
      }
    }
  }

</style>
<style lang="stylus" rel="stylesheet/stylus">
  .datav-three-element {
    width 120px
    height 160px
    box-shadow 0px 0px 6px rgba(255, 255, 255, 0.5)
    border 1px solid transparent
    text-align center
    cursor pointer
    box-sizing border-box
    padding 24px 1px 29px
    border-radius 4px
    cursor pointer
    &:hover {
      box-shadow 0px 0px 20px rgba(255, 255, 255, 1)
      border-color rgba(255, 255, 255, 1)
    }
    & i {
      font-size 36px
      color #fff
    }
    & .node-type, & .title, & .details {
      transform-origin center top
      color rgba(255, 255, 255, .9)
    }
    & .node-type {
      transform scale(.7)
    }
    & .title {
      color #fff
      font-weight 500
      transform scale(.85)
    }
    & .details {
      transform scale(.75)
    }
  }
</style>
