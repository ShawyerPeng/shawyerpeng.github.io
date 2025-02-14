import { createApp } from 'vue'

createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}).mount('#app')

// var a = getApp(), t = require("../../../LK_Package/tools"), e = require("../../../LK_Package/api");
// const App = (options) => {
//     if (!options) { 
//         app = {}
//         return
//     }
//     app = options
// }

// Page = function(pageConfig){
//     // currentName 是页面路径
//     // 这里主要是 结合 vue模板 wxs 使用的组件列表 使用的template列表 做个映射
//     registerPage(currentName, currentTemplate, page, currentWxs, currentUsingComponents, currentImportTemplates)
// }
// const registerPage = (name, template, page, wxs, components, importTemplates) => {
//   // console.log("Register page ->", name)
//   // 做个映射 将页面路径以及对应配置存起来 等需要渲染再处理
//   pages.set(name, {
//     template, page, wxs, components, importTemplates
//   })
// }

Page({
    data: {
        dateArr: [],
        selectDate: "0",
        allSessionMsg: "",
        category_id: "",
        selTimeCount: 0,
        selAllPrice: 0,
        scHei: 0
    },
    makeUI: function() {
        this.getSevenDays(), this.getRightViewHei();
    },
    getSevenDays: function() {
        for (var a = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ], t = [], e = 0; e < 7; e++) {
            var s = new Date();
            s.setDate(s.getDate() + e);
            var i = s.getFullYear(), n = 0 == e ? "今天" : a[s.getDay()], l = s.getMonth() + 1;
            l = l < 10 ? "0" + l.toString() : l.toString();
            var o = s.getDate() < 10 ? "0" + s.getDate().toString() : s.getDate().toString(), d = {
                day: n,
                date: l + "." + o,
                formatDate: l + "-" + o,
                fullDate: i + "-" + l + "-" + o,
                id: e.toString()
            };
            t[e] = d;
        }
        this.setData({
            dateArr: t
        });
    },
    getRightViewHei: function() {
        var a = parseInt(.12 * wx.getSystemInfoSync().windowWidth), t = parseInt(130 / 750 * wx.getSystemInfoSync().windowWidth), e = this.data.allSessionMsg.data;
        0 != e.length && (a = a * e[0].data.length + t, this.setData({
            scHei: a
        }));
    },
    clickSelectDate: function(a) {
        var t = a.currentTarget.dataset.item, e = a.currentTarget.dataset.index;
        console.log("选择日期", a.currentTarget.dataset), this.setData({
            selectDate: e,
            selTimeCount: 0,
            selAllPrice: 0
        }), this.requestSessionMsg(t.fullDate);
    },
    getTime: function(a) {
        var t = a.split(":"), e = "";
        if ("00" == t[1]) e = t[0] + ":30"; else if (t[0] <= 24) {
            var s = parseInt(t[0]) + 1;
            e = s < 10 ? "0" + s + ":00" : s + ":00";
        } else e = "00:00";
        return e;
    },
    clickSel: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.item, s = a.currentTarget.dataset.superindex, i = a.currentTarget.dataset.superitem;
        if (1 != e.is_sign) if (this.data.selTimeCount >= this.data.allSessionMsg.detail.num) wx.showToast({
            icon: "none",
            title: "已达到预定场数限制"
        }); else {
            var n = this.data.selTimeCount, l = 100 * this.data.selAllPrice;
            if (e.sel = null == e.sel || 0 == e.sel, 0 != e.bind_id) for (var o = 0; o < this.data.allSessionMsg.data.length; o++) for (var d = 0; d < this.data.allSessionMsg.data[o].data.length; d++) e.bind_id == this.data.allSessionMsg.data[o].data[d].bind_id && (this.data.allSessionMsg.data[o].data[d].sel = e.sel);
            if (e.id = i.id, e.name = i.project_name, 0 != e.bind_id) for (var r = 0; r < this.data.allSessionMsg.data.length; r++) for (var g = 0; g < this.data.allSessionMsg.data[r].data.length; g++) e.bind_id == this.data.allSessionMsg.data[r].data[g].bind_id && (1 == this.data.allSessionMsg.data[r].data[g].sel ? (n += 1, 
            l += 100 * this.data.allSessionMsg.data[r].data[g].price) : (n -= 1, l -= 100 * this.data.allSessionMsg.data[r].data[g].price)); else e.showTime = e.time + "-" + this.getTime(e.time), 
            1 == e.sel ? (n += 1, l += 100 * e.price) : (n -= 1, l -= 100 * e.price);
            l /= 100;
            var c = this.data.allSessionMsg;
            if (0 != e.bind_id) for (var h = 0; h < this.data.allSessionMsg.data.length; h++) for (var u = 0; u < this.data.allSessionMsg.data[h].data.length; u++) e.bind_id == this.data.allSessionMsg.data[h].data[u].bind_id && (this.data.allSessionMsg.data[h].data[u].showTime = this.data.allSessionMsg.data[h].data[u].time + "-" + this.getTime(this.data.allSessionMsg.data[h].data[u].time), 
            c.data[h].data[u] = this.data.allSessionMsg.data[h].data[u], this.data.allSessionMsg.data[h].data[u].id = e.id); else c.data[s].data[t] = e;
            this.setData({
                allSessionMsg: c,
                selTimeCount: n,
                selAllPrice: l
            });
        } else wx.showToast({
            icon: "none",
            title: "已售罄"
        });
    },
    clickToCommitOrder: function() {
        var s = this, i = s.data.allSessionMsg.detail;
        if (0 != s.data.selTimeCount) {
            for (var n = [], l = 0, o = 0; o < s.data.allSessionMsg.data.length; o++) {
                for (var d = [], r = -1, g = s.data.allSessionMsg.data[o], c = 0; c < g.data.length; c++) {
                    var h = g.data[c];
                    if (1 == h.sel) if (d.push(h), l += .5, -1 == r) r = c; else {
                        if (c - r > 1) return void wx.showToast({
                            icon: "none",
                            title: "选择的场次不连贯"
                        });
                        r = c;
                    }
                }
                0 != d.length && n.push(d);
            }
            if (l < i.min_time) wx.showToast({
                icon: "none",
                title: "场次预约时长不得小于" + i.min_time + "小时"
            }); else if (l > i.max_time) wx.showToast({
                icon: "none",
                title: "场次预约时长不得大于" + i.max_time + "小时"
            }); else {
                var u = {
                    api_token: null == a.globalData.user.api_token ? "" : a.globalData.user.api_token,
                    date: s.data.dateArr[s.data.selectDate].fullDate,
                    data: JSON.stringify(n),
                    id: s.data.category_id
                };
                wx.showLoading({}), t.requestData(e.sureSessionOrder_url, "POST", u, function(a) {
                    console.log("场地预定确认订单"), console.info(a), wx.setStorageSync("sessionParams", u), 
                    wx.setStorageSync("sessionOrderMsg", a.data), wx.setStorageSync("sessionDate", s.data.dateArr[s.data.selectDate]), 
                    wx.navigateTo({
                        url: "/secondPageIndex/pages/venueCommitOrder/venueCommitOrder"
                    });
                });
            }
        } else wx.showToast({
            icon: "none",
            title: "请选择场次"
        });
    },
    requestSessionMsg: function(s) {
        var i = this;
        wx.showLoading();
        var n = {
            api_token: null == a.globalData.user.api_token ? "" : a.globalData.user.api_token,
            id: i.data.category_id,
            date: s
        };
        console.log(n), t.requestData(e.venueSessionMsg_url, "POST", n, function(a) {
            console.log("场地预约信息", a);
            var t = a.data;
            t.data.forEach(function(a) {
                var t = a.data, e = t[t.length - 1].time.split(":"), s = {
                    time: "",
                    bind_id: 0,
                    is_sign: 0,
                    price: "",
                    week: ""
                };
                if ("00" == e[1]) s.time = e[0] + ":30"; else {
                    var i = parseInt(e[0]);
                    s.time = i < 24 ? i + 1 + ":00" : "01:00";
                }
                t.push(s);
            }), i.setData({
                allSessionMsg: t
            }), console.log("11111", i.data.allSessionMsg), i.makeUI();
        });
    },
    onLoad: function(a) {
        "" != a.cateID && this.setData({
            category_id: a.cateID
        });
    },
    onShow: function() {
        this.setData({
            selectDate: 0,
            selTimeCount: 0,
            selAllPrice: 0
        }), this.requestSessionMsg(t.getCurrentDate());
    },
    onShareAppMessage: function() {}
});