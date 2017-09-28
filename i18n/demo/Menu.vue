<template>
  <div v-show="openMenu" class="menu-container">
    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="0" @click="closeOtherMenu($event, '/permissions')">
      <a>{{$t('menu', [$t('type.permissions')])}}</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/permissions" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/permissions/role">{{$t('menu', [$t('type.role')])}}</router-link>
        <router-link to="/permissions/user">{{$t('menu', [$t('type.user')])}}</router-link>
      </div>
    </div>

    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="1" @click="closeOtherMenu($event, '/template')">
      <a>{{$t('menu', [$t('type.template')])}}</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/template" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/template/param">{{$t('menu', [$t('type.params')])}}</router-link>
        <router-link to="/template/software">{{$t('menu', [$t('type.software')])}}</router-link>
        <router-link to="/template/plugin">{{$t('menu', [$t('type.plugin')])}}</router-link>
        <router-link to="/template/alert">{{$t('menu', [$t('type.alert')])}}</router-link>
      </div>
    </div>

    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="2" @click="closeOtherMenu($event, '/product')">
      <a>{{$t('menu', [$t('type.product')])}}</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/product" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/products">{{$t('common.all', [$t('type.product')])}}</router-link>
      </div>
    </div>

    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="3" @click="closeOtherMenu($event, '/alertgroup')">
      <a>报警组管理</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/alertgroup" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/alertgroups">全部报警组</router-link>
      </div>
    </div>

    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="4" @click="closeOtherMenu($event, '/pool')">
      <a>{{$t('menu', [$t('type.pool')])}}</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/pool" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/pool/resource">{{$t('menu', [$t('type.resource')])}}</router-link>
        <router-link to="/pool/backup">{{$t('menu', [$t('type.backup')])}}</router-link>
        <router-link to="/pool/reserve">{{$t('menu', [$t('type.reserve')])}}</router-link>
      </div>
    </div>

    <div class="menu-item">
      <input type="checkbox" name="menu" data-index="5" @click="closeOtherMenu($event, '/service')">
      <a>{{$t('menu', [$t('type.service')])}}</a>
      <i class="iconfont icon-tianjia"></i>
      <i class="iconfont icon-jian"></i>
      <div class="sub-menu">
        <router-link to="/service" exact>{{$t('common.preview')}}</router-link>
        <router-link to="/services">{{$t('common.all', [$t('type.service')])}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default{
    name: 'Menu',

    computed: {
      ...mapState([
        'openMenu'
      ])
    },

    methods: {
      closeOtherMenu (event, url) {
        let inputList = document.querySelectorAll('input[name=menu]')
        inputList.forEach((item, idx) => {
          if (idx !== parseInt(event.currentTarget.dataset.index)) {
            item.checked = false
          } else {
            this.$router.push({path: url})
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus"3e3>
  @import '../assets/css/base/methods.styl'

  .menu-container {
    float left
    overflow-y auto
    width 180px
    height 100%
    padding 15px 10px 100px
    background-color #2a3542
    & .menu-item {
      position relative
      margin-bottom 5px
      & a {
        display block
        padding 0 10px
        color $text-color-c5
      }
      & .iconfont {
        position absolute
        top 15.5px
        right 10px
        color $bg-color-w
      }
      & .icon-jian {
        display none
      }
      & > a {
        line-height 47px
        b-border-radius(4px)
      }
      &:hover > a {
        color $bg-color-w
        background-color #35404D
      }
      & > input {
        position absolute
        z-index 1
        width 160px
        height 47px
        top 0
        opacity 0
        cursor pointer
        &:checked {
          & + a {
            color #fff
            background-color #35404D
            b-border-radius(4px 4px 0 0)
          }
          & ~ .icon-tianjia {
            display none
          }
          & ~ .icon-jian {
            display block
          }
          & ~ .sub-menu {
            display block
            & a {
              background-color #35404D
            }
          }
        }
      }
      & .sub-menu {
        display none
        & a {
          padding-left 20px
          line-height 35px
          &:hover {
            color $theme-color
          }
        }
        & .router-link-active {
          color $theme-color
        }
      }
    }
  }
</style>
