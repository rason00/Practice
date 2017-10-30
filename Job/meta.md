 <!-- 
    width：控制 viewport 的大小，可以指定的一个值，如果 600，或者特殊的值，
    如 device-width 为设备的宽度（单位为缩放为 100% 时的 CSS 的像素）。
    
    而android下你设置width无效，你能设置的是一个特殊的字段target-densitydpi：
    当 target-densitydpi=device-dpi 时， css中的1px会等于物理像素中的1px。
    因为这个属性只有安卓支持，并且安卓已经决定要废弃 target-densitydpi 这个属性了，
    尽量避免使用这个属性。
    
    maximum-scale：允许用户缩放到的最大比例。
    
    user-scalable：用户是否可以手动缩放 
  -->

  <meta name="viewport" content="width=640,target-densitydpi=device-dpi,maximum-scale=1.0, user-scalable=no">
