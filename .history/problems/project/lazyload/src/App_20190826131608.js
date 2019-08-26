import React, { useEffect } from 'react';
import './App.css';

// 配置项
const placeHolder = 'https://cdn.dribbble.com/users/1821976/screenshots/7041584/raining_1x.jpg' // 默认图片地址，如果使用颜色，直接设置图片背景色即可
const threshold = 200 // 距离视窗底部多少像素开始加载
const lazyClss = 'loaded' // 加载成功后样式，用来增加过滤动画等效果

function App() {
  // 需要展示的大量图片
  const imgUrl = [
    'https://cdn.dribbble.com/users/772985/screenshots/7043973/pika_1_1x.jpg',
    'https://cdn.dribbble.com/users/788099/screenshots/7043452/couple_the_forest_kit8-net_1x.png',
    'https://cdn.dribbble.com/users/730703/screenshots/6988911/elenidebo-thisiscolossal-theroad-forchicagodesignmuseum_1x.jpg',
    'https://cdn.dribbble.com/users/1278383/screenshots/7045919/_____0825_1x.png',
    'https://cdn.dribbble.com/users/1776107/screenshots/7045879/3191566782115_.pic_hd_1x.jpg',
    'https://cdn.dribbble.com/users/1478415/screenshots/7045840/________1x.png',
    'https://cdn.dribbble.com/users/1786203/screenshots/7045898/__2___1x.png',
    'https://cdn.dribbble.com/users/1818193/screenshots/7042394/weather_2x_zuairia_1x.jpg',
    'https://cdn.dribbble.com/users/674925/screenshots/7044499/___1x.png',
    'https://cdn.dribbble.com/users/1778456/screenshots/7045882/1_1x.png',
    'https://cdn.dribbble.com/users/2285295/screenshots/7045974/application_of_antique_auction_1x.png',
    'https://cdn.dribbble.com/users/772985/screenshots/7043973/pika_1_1x.jpg',
    'https://cdn.dribbble.com/users/788099/screenshots/7043452/couple_the_forest_kit8-net_1x.png',
    'https://cdn.dribbble.com/users/730703/screenshots/6988911/elenidebo-thisiscolossal-theroad-forchicagodesignmuseum_1x.jpg',
    'https://cdn.dribbble.com/users/1278383/screenshots/7045919/_____0825_1x.png',
    'https://cdn.dribbble.com/users/1776107/screenshots/7045879/3191566782115_.pic_hd_1x.jpg',
    'https://cdn.dribbble.com/users/1478415/screenshots/7045840/________1x.png',
    'https://cdn.dribbble.com/users/1786203/screenshots/7045898/__2___1x.png',
    'https://cdn.dribbble.com/users/1818193/screenshots/7042394/weather_2x_zuairia_1x.jpg',
    'https://cdn.dribbble.com/users/674925/screenshots/7044499/___1x.png',
    'https://cdn.dribbble.com/users/1778456/screenshots/7045882/1_1x.png',
    'https://cdn.dribbble.com/users/2285295/screenshots/7045974/application_of_antique_auction_1x.png'
  ]

  useEffect(() => {
    const domScroll = () => {
      const clientHeight = document.documentElement.clientHeight || window.innerHeight

      document.querySelectorAll('.lazy').forEach((el) => {
        const imageTop = el.getBoundingClientRect().top
        const dataSrc = el.getAttribute('data-src')
        if (placeHolder && !el.src) {
          el.src = placeHolder
        }
        if (imageTop <= clientHeight + threshold && el.src !== dataSrc) {
          el.src = dataSrc
          if (lazyClss) {
            el.classList.add(lazyClss)
          }
        }
      });
    }

    domScroll()

    window.addEventListener('scroll', domScroll)

    return () => {
      window.removeEventListener('resize', domScroll)
    }
  }, [])

  return (
    <div className="App">

      {imgUrl.map((item, idx) =>
        <img className="lazy" data-src={item} key={idx} alt={'图片' + idx} width="100%" />)
      }
    </div>
  );
}

export default App;
