"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_avatar2 + _easycom_u_icon2)();
}
const _easycom_u_avatar = () => "../../../uni_modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_u_icon = () => "../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_avatar + _easycom_u_icon)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({
      name: "用户",
      avatar: "https://cdn.uviewui.com/uview/swiper/1.jpg"
    });
    const activeIndex = common_vendor.ref(-1);
    const refreshing = common_vendor.ref(false);
    const gridList = common_vendor.ref([
      {
        id: 1,
        title: "订单管理",
        desc: "查看所有订单",
        icon: "order",
        iconColor: "#409EFF",
        iconBg: "rgba(64, 158, 255, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(64, 158, 255, 0.2)",
        path: "/pages/order/list/index",
        badge: "3"
      },
      {
        id: 2,
        title: "商品中心",
        desc: "浏览商品",
        icon: "shopping-cart",
        iconColor: "#67C23A",
        iconBg: "rgba(103, 194, 58, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(103, 194, 58, 0.2)",
        path: "/pages/material/list/index"
      },
      {
        id: 3,
        title: "消息通知",
        desc: "查看消息",
        icon: "chat",
        iconColor: "#E6A23C",
        iconBg: "rgba(230, 162, 60, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(230, 162, 60, 0.2)",
        path: "/pages/message/index",
        badge: "12"
      },
      {
        id: 4,
        title: "我的收藏",
        desc: "收藏夹",
        icon: "flask",
        iconColor: "#F56C6C",
        iconBg: "rgba(245, 108, 108, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(245, 108, 108, 0.2)",
        path: "/pages/favorite/index"
      },
      {
        id: 5,
        title: "会员中心",
        desc: "尊享权益",
        icon: "vip",
        iconColor: "#909399",
        iconBg: "rgba(144, 147, 153, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(144, 147, 153, 0.2)",
        path: "/pages/vip/index"
      },
      {
        id: 6,
        title: "系统设置",
        desc: "应用设置",
        icon: "setting",
        iconColor: "#409EFF",
        iconBg: "rgba(64, 158, 255, 0.1)",
        bgColor: "#FFFFFF",
        shadowColor: "rgba(64, 158, 255, 0.2)",
        path: "/pages/settings/index"
      }
    ]);
    const getGridStyle = (index) => {
      const baseTransform = "perspective(1000px)";
      const hoverTransform = activeIndex.value === index ? "translateZ(20px) scale(1.05)" : "translateZ(0px)";
      return {
        transform: `${baseTransform} ${hoverTransform}`,
        background: gridList.value[index].bgColor,
        boxShadow: activeIndex.value === index ? `0 20px 40px ${gridList.value[index].shadowColor}, 0 10px 20px rgba(0,0,0,0.1)` : `0 10px 20px ${gridList.value[index].shadowColor}, 0 5px 10px rgba(0,0,0,0.05)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${gridList.value[index].iconColor}20`
      };
    };
    const handleTouchStart = (index) => {
      activeIndex.value = index;
    };
    const handleTouchEnd = (index) => {
      setTimeout(() => {
        activeIndex.value = -1;
      }, 150);
    };
    const handleGridClick = (item) => {
      common_vendor.index.showLoading({ title: "加载中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: `进入${item.title}`,
          icon: "success",
          duration: 1500
        });
        common_vendor.index.__f__("log", "at pages/order/index/index.vue:258", item.path);
        common_vendor.index.navigateTo({ url: item.path });
      }, 500);
    };
    const handleNotification = () => {
      common_vendor.index.showToast({
        title: "消息通知",
        icon: "none"
      });
    };
    const handleSearch = () => {
      common_vendor.index.showToast({
        title: "搜索功能",
        icon: "none"
      });
    };
    const onRefresh = () => {
      refreshing.value = true;
      setTimeout(() => {
        refreshing.value = false;
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success"
        });
      }, 1500);
    };
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/order/index/index.vue:295", "首页加载完成");
    });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: userInfo.value.avatar,
          size: "48",
          shape: "circle"
        }),
        b: common_vendor.t(userInfo.value.name),
        c: common_vendor.o(handleNotification),
        d: common_vendor.p({
          name: "bell",
          size: "24",
          color: "#333"
        }),
        e: common_vendor.o(handleSearch),
        f: common_vendor.p({
          name: "search",
          size: "24",
          color: "#333"
        }),
        g: common_vendor.f(gridList.value, (item, index, i0) => {
          return common_vendor.e({
            a: "6b6d90d7-3-" + i0,
            b: common_vendor.p({
              name: item.icon,
              color: item.iconColor,
              size: "28"
            }),
            c: item.iconBg,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.desc),
            f: item.badge
          }, item.badge ? {
            g: common_vendor.t(item.badge),
            h: item.iconColor
          } : {}, {
            i: item.id,
            j: activeIndex.value === index ? 1 : "",
            k: common_vendor.s(getGridStyle(index)),
            l: common_vendor.o(($event) => handleTouchStart(index), item.id),
            m: common_vendor.o(($event) => handleTouchEnd(), item.id),
            n: common_vendor.o(($event) => handleGridClick(item), item.id)
          });
        }),
        h: common_vendor.p({
          name: "info-circle",
          size: "18",
          color: "#666"
        }),
        i: refreshing.value,
        j: common_vendor.o(onRefresh)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/order/index/index.js.map
