var config = {};
// 立即执行函数
(function () {
  // 设置宽高初始值
  var config_width = 640,
    config_height = 0,
    // 简写
    html = document.documentElement,

    delay, setSize = function () {
      // 获取宽高
      config.windowWidth = html.clientWidth || window.innerWidth || html.getBoundingClientRect().width;
      config.windowHeight = html.clientHeight || window.innerHeight || html.getBoundingClientRect().height;
      // 计算纵横比
      config.aspectRatio = config.windowWidth / config.windowHeight;
      console.log(!!config_width);
      // 判断初始值有宽或有高时的情况 横竖屏情况
      if (!config_width || config.aspectRatio > config_width / config_height) {
        config.windowScale = config_height / config.windowHeight;
        html.style.cssText += 'font-size:' + config.windowHeight * 100 / config_height + 'px!important;';
      } else {
        config.windowScale = config_width / config.windowWidth;
        html.style.cssText += 'font-size:' + config.windowWidth * 100 / config_width + 'px!important;';
      }
      // ？？
      // html.offsetWidth;
    }
  // 宽高都没有时
  if (!config_height && !config_width) {
    config_width = 640;
  }
  setSize();
  /*
  DOM文档加载的步骤为
  1.解析HTML结构。
  2.加载外部脚本和样式表文件。
  3.解析并执行脚本代码。
  4.DOM树构建完成。//DOMContentLoaded
  5.加载图片等外部文件。
  6.页面加载完毕。//load
  */
  document.addEventListener('DOMContentLoaded', function () {
    /*
    window.onresize事件是在窗口改变大小之前发生的
    window.onresize或者$(window).resize()触发两次.
    比如浏览器全屏显示,如果使用screen.availHeight重布局屏幕会闪两次,
    因为resize方法会进2次.而且每次screen.availHeight都不一样.
    解决办法:
    为resize设置一个延迟
    */
    window.addEventListener('resize', function () {
      clearTimeout(delay);
      delay = setTimeout(setSize, 50);
    }, false);
  }, false);
})();
