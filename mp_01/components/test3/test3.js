// components/test3/test3.js
Component({
  options: {
    pureDataPattern: /^_/,
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    _rgb: {
      r: 0,
      g: 0,
      b: 0,
    },
    fullColor: "0,0,0",
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    created() {
      console.log("created");
    },

    attached() {
      console.log("attached");
    },

    detached() {
      this.clearTimer();
    },
  },

  /**
   * 组件的定时器
   */
  timer: null,

  /**
   * 组件的方法列表
   */
  methods: {
    changeColor(channel, delta) {
      const key = `_rgb.${channel}`;
      const value = this.data._rgb[channel];
      const newValue = value + delta;
      this.setData({
        [key]: newValue < 0 ? 0 : newValue > 255 ? 255 : newValue,
      });
    },
    increaseR() {
      this.changeColor("r", 5);
    },
    decreaseR() {
      this.changeColor("r", -5);
    },
    increaseG() {
      this.changeColor("g", 5);
    },
    decreaseG() {
      this.changeColor("g", -5);
    },
    increaseB() {
      this.changeColor("b", 5);
    },
    decreaseB() {
      this.changeColor("b", -5);
    },
    startChange(action) {
      this.clearTimer();
      action();
      this.timer = setInterval(action, 100);
    },
    startIncreaseR() {
      this.startChange(() => this.increaseR());
    },
    startDecreaseR() {
      this.startChange(() => this.decreaseR());
    },
    startIncreaseG() {
      this.startChange(() => this.increaseG());
    },
    startDecreaseG() {
      this.startChange(() => this.decreaseG());
    },
    startIncreaseB() {
      this.startChange(() => this.increaseB());
    },
    startDecreaseB() {
      this.startChange(() => this.decreaseB());
    },
    stopChange() {
      this.clearTimer();
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    _randomColor() {
      this.setData({
        _rgb: {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256)
        }
      })
    }
  },

  observers: {
    // '_rgb.r,_rgb.g,_rgb.b': function (r, g, b) {
    //   this.setData({
    //     fullColor: `${r},${g},${b}`
    //   })
    // },
    "_rgb.**": function (obj) {
      this.setData({
        fullColor: `${obj.r},${obj.g},${obj.b}`,
      });
    },
  },

  pageLifetimes: {
    show() {
      console.log("show");
      this._randomColor()
    },
    hide() {
      console.log("hide");
    },
    resize() {
      console.log("resize");
    }
  }
});