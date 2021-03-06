export default {
  /**
   * 时间格式化
   * 用法：utils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
   * @param {string} date - 当前时间
   * @param {string} format - 格式化之后的格式
   */
  dateFormat: function(date, format) {
    if (format === undefined) {
      format = date;
      date = new Date();
    }
    var map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
      var v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });
    return format;
  },
  /**
   * 获取url参数
   */
  getUrlParam: function(url, param) {
    var r = new RegExp('\\?(?:.+&)?' + param + '=(.*?)(?:[?&].*)?$');
    var m = url.match(r);
    return m ? m[1] : '';
  },
  /**
   * 时间倒计时
   * @param {string} d - 截止的时间 Date.UTC(2030, 6, 27, 16, 34)
   * @param {object} o - 倒计时的DOM对象集
     sec: 显示秒数值的标签对象,
     mini: 显示分钟数值的标签对象,
     hour: 显示小时数值的标签对象,
     day: 显示天数数值的标签对象,
     month: 显示月份数值的标签对象,
     year: 显示年数数值的标签对象
   */
  timeCountDown: function(d, o) {
    var f = {
      zero: function(n) {
        var nowN = parseInt(n, 10);
        if (nowN > 0) {
          if (nowN <= 9) {
            nowN = '0' + nowN;
          }
          return String(nowN);
        } else {
          return '00';
        }
      },
      dv: function() {
        d = d || Date.UTC(2050, 0, 1); // 如果未定义时间，则我们设定倒计时日期是2050年1月1日
        var future = new Date(d);
        var now = new Date();
        // 现在将来秒差值
        var dur = Math.round((future.getTime() - now.getTime()) / 1000) + future.getTimezoneOffset() * 60;
        var pms = {
          sec: '00',
          mini: '00',
          hour: '00',
          day: '00',
          month: '00',
          year: '0'
        };
        if (dur > 0) {
          pms.sec = f.zero(dur % 60);
          pms.mini = Math.floor(dur / 60) > 0 ? f.zero(Math.floor(dur / 60) % 60) : '00';
          pms.hour = Math.floor(dur / 3600) > 0 ? f.zero(Math.floor(dur / 3600) % 24) : '00';
          pms.day = Math.floor(dur / 86400) > 0 ? f.zero(Math.floor(dur / 86400) % 30) : '00';
          // 月份，以实际平均每月秒数计算
          pms.month = Math.floor(dur / 2629744) > 0 ? f.zero(Math.floor(dur / 2629744) % 12) : '00';
          // 年份，按按回归年365天5时48分46秒算
          pms.year = Math.floor(dur / 31556926) > 0 ? Math.floor(dur / 31556926) : '0';
        }
        return pms;
      },
      ui: function() {
        if (o.sec) {
          o.sec.innerHTML = f.dv().sec;
        }
        if (o.mini) {
          o.mini.innerHTML = f.dv().mini;
        }
        if (o.hour) {
          o.hour.innerHTML = f.dv().hour;
        }
        if (o.day) {
          o.day.innerHTML = f.dv().day;
        }
        if (o.month) {
          o.month.innerHTML = f.dv().month;
        }
        if (o.year) {
          o.year.innerHTML = f.dv().year;
        }
        setTimeout(f.ui, 1000);
      }
    };
    f.ui();
  },
  // 设置cookie
  setCookie: function(name, value, seconds) {
    seconds = seconds || 0; // seconds有值就直接赋值，没有为0，这个跟php不一样。
    var expires = '';
    if (seconds !== 0) {
      // 设置cookie生存时间
      var date = new Date();
      date.setTime(date.getTime() + seconds * 1000);
      expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + escape(value) + expires + '; path=/'; // 转码并赋值
  },
  // 取得cookie
  getCookie: function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';'); // 把cookie分割成组
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]; // 取得字符串
      while (c.charAt(0) === ' ') {
        // 判断一下字符串有没有前导空格
        c = c.substring(1, c.length); // 有的话，从第二位开始取
      }
      if (c.indexOf(nameEQ) === 0) {
        // 如果含有我们要的name
        return unescape(c.substring(nameEQ.length, c.length)); // 解码并截取我们要值
      }
    }
    return false;
  },
  // 清除cookie
  clearCookie: function(name) {
    this.setCookie(name, '', -1);
  }
};
