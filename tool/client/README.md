### 判断当前引擎、浏览器、平台

请参考[客户端检测原理]()

#### 引擎判断 engine
  - Opera
  检测window.opera，Opera5以及更高版本都存在该对象，version()记录Opera的版本号
  - WebKit
  由于webkit的用户代理字符串中包含'Gecko'和'KHTML'子字符串，所以先检测webkit再检测gecko和khtml
  通过检测用户代理字符串中'AppleWebkit'来确定是否是webkit引擎
  - KHTML
  由于khtml的用户代理字符串中也包含'Gecko'子字符串，所以先检测khtml再检测gecko
  - Gecko
  Gecko的版本号不会出现在字符串'Gecko'后面，而是位于字符串'rv:'与一个闭括号之间，且还需判断'Gecko/'后是否跟8个数字
  - IE
  IE的版本号位于字符串'MSIE'的后面，一个分号的前面

#### 浏览器判断 browser
  - 对于IE、Opera来说，browser中的值等于engine对象中的值
  - 对于Konqueror来说，browser.konq = engine.khtml，browser.ver = engine.ver