# 自写轮播图思路回顾
## 1.交互点
### next & preview
通过下一个和上一个箭头可以直接跳转到下一张、上一张，绑定相应的click事件；
### 索引小圆圈
轮播图下方的索引圈来直接跳转到相应的index位置
## 2. 逻辑关系
### 自动播放
自动播放： `setInterval()` 固定时间跳转下一张
### 动画效果
两种思路：
  1. 原生JS： 利用CSS3的transition属性，实现一个动画效果，js控制left值
  2. Jquery： 利用 animate()实现动画效果
### 具体位置
  将每一张图的left值保存在数组中index = []，索引即其序号

# 函数说明
```
/**
*轮播图片展示函数(最新，利用CSS3)，根据索引值到达相应地方
*@param none
*@return none
*/
function disPlay

/**
*上一张/下一章图片
*Function lastPlay/nextPlay
*@param none
*@return none
*/
function lastPlay
function nextPlay

/**
*绑定时间，包括小圆点、箭头的click事件
*@function bindEvent
*@param none
*@return none
*/
function bindEvent()

/**
*跳转到某张图片
*@function moveTo
*@param location 索引值，具体位置存储在locatArr数组中
*@return none
*/
function moveTo(location)

```
