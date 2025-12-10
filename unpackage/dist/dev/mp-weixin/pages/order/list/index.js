"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  (_easycom_u_icon2 + _easycom_u_navbar2 + _easycom_u_search2 + _easycom_u_tabs2 + _easycom_u_button2 + _easycom_u_empty2 + _easycom_u_loading_icon2)();
}
const _easycom_u_icon = () => "../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_navbar = () => "../../../uni_modules/uview-plus/components/u-navbar/u-navbar.js";
const _easycom_u_search = () => "../../../uni_modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_tabs = () => "../../../uni_modules/uview-plus/components/u-tabs/u-tabs.js";
const _easycom_u_button = () => "../../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../uni_modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loading_icon = () => "../../../uni_modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_navbar + _easycom_u_search + _easycom_u_tabs + _easycom_u_button + _easycom_u_empty + _easycom_u_loading_icon + TaskCard)();
}
const TaskCard = () => "../../../components/order_card.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 0);
    const pageTitle = common_vendor.ref("订单列表");
    const searchKeyword = common_vendor.ref("");
    const currentTab = common_vendor.ref(0);
    const refreshing = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const loadingMore = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const pageNum = common_vendor.ref(1);
    common_vendor.ref(10);
    const taskList = common_vendor.ref([]);
    const tabList = common_vendor.ref([
      { name: "待办", value: "pending" },
      { name: "全部", value: "all" },
      { name: "已完成", value: "completed" },
      { name: "未完成", value: "uncompleted" },
      { name: "其他", value: "other" }
    ]);
    const mockTasks = [
      {
        id: 1,
        name: "A9二排5号机",
        deviceNo: "A9-2-5",
        status: "online",
        statusText: "在线",
        statusColor: "#2979ff",
        site: "湖南京广线-长沙南站-A区9号检票口",
        serialNo: "SF7336190300055",
        responsible: "赵佳志",
        date: "2024-01-15 09:30",
        priority: "high"
      },
      {
        id: 2,
        name: "A9二排5号机",
        deviceNo: "A9-2-5",
        status: "offline",
        statusText: "离线",
        statusColor: "#909399",
        site: "湖南京广线-长沙南站-A区9号检票口",
        serialNo: "SF7336190300055",
        responsible: "赵佳志",
        date: "2024-01-15 10:15",
        priority: "medium"
      },
      {
        id: 3,
        name: "A9二排5号机",
        deviceNo: "A9-2-5",
        status: "fault",
        statusText: "故障",
        statusColor: "#fa3534",
        site: "湖南京广线-长沙南站-A区9号检票口",
        serialNo: "SF7336190300055",
        responsible: "赵佳志",
        date: "2024-01-15 11:20",
        priority: "high"
      },
      {
        id: 4,
        name: "A9二排5号机",
        deviceNo: "A9-2-5",
        status: "online",
        statusText: "在线",
        statusColor: "#2979ff",
        site: "湖南京广线-长沙南站-A区9号检票口",
        serialNo: "SF7336190300055",
        responsible: "赵佳志",
        date: "2024-01-15 13:45",
        priority: "low"
      }
    ];
    const handleTabChange = (e) => {
      currentTab.value = e.index;
      refreshTaskList();
    };
    const handleSearch = (value) => {
      common_vendor.index.__f__("log", "at pages/order/list/index.vue:214", "搜索关键词:", value);
      refreshTaskList();
    };
    const handleClearSearch = () => {
      searchKeyword.value = "";
      refreshTaskList();
    };
    const handleTaskClick = (task) => {
      common_vendor.index.__f__("log", "at pages/order/list/index.vue:224", "点击订单:", task);
      common_vendor.index.navigateTo({
        url: `/pages/order/detail/index?id=${task.id}`
      });
    };
    const handleScan = () => {
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/order/list/index.vue:234", "扫码结果:", res.result);
          common_vendor.index.showToast({
            title: "扫码成功",
            icon: "success"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/order/list/index.vue:244", "扫码失败:", err);
          common_vendor.index.showToast({
            title: "扫码失败，请重试",
            icon: "none"
          });
        }
      });
    };
    const showMoreMenu = () => {
      common_vendor.index.showActionSheet({
        title: "更多操作",
        itemList: ["刷新列表", "筛选设置", "导出数据", "关于"],
        success: (res) => {
          const index = res.tapIndex;
          switch (index) {
            case 0:
              refreshTaskList();
              break;
            case 1:
              showFilterModal();
              break;
            case 2:
              exportData();
              break;
            case 3:
              showAbout();
              break;
          }
        }
      });
    };
    const goToDetail = (e) => {
      common_vendor.index.navigateTo({
        url: "/pages/order/stats"
      });
    };
    const fetchTaskList = async (isRefresh = false, isLoadMore = false) => {
      if (loading.value || isLoadMore && noMore.value)
        return;
      if (isRefresh) {
        refreshing.value = true;
        pageNum.value = 1;
      } else if (isLoadMore) {
        loadingMore.value = true;
        pageNum.value++;
      } else {
        loading.value = true;
      }
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        if (isRefresh || !isLoadMore) {
          taskList.value = [...mockTasks];
        } else {
          const moreTasks = mockTasks.map((task) => ({
            ...task,
            id: task.id + taskList.value.length
          }));
          taskList.value = [...taskList.value, ...moreTasks];
        }
        if (isLoadMore && pageNum.value >= 3) {
          noMore.value = true;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/list/index.vue:317", "获取订单列表失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
        loadingMore.value = false;
        refreshing.value = false;
      }
    };
    const refreshTaskList = () => {
      fetchTaskList(true);
    };
    const loadMore = () => {
      if (!noMore.value) {
        fetchTaskList(false, true);
      }
    };
    const onRefresh = () => {
      refreshTaskList();
    };
    const showFilterModal = () => {
      common_vendor.index.showModal({
        title: "筛选设置",
        content: "筛选功能开发中...",
        showCancel: false
      });
    };
    const exportData = () => {
      common_vendor.index.showToast({
        title: "导出功能开发中",
        icon: "none"
      });
    };
    const showAbout = () => {
      common_vendor.index.showModal({
        title: "关于",
        content: "巡检订单管理系统 v1.0.0",
        showCancel: false
      });
    };
    common_vendor.onLoad(() => {
      fetchTaskList();
    });
    common_vendor.onShow(() => {
      refreshTaskList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(showMoreMenu),
        c: common_vendor.p({
          name: "more-dot-fill",
          size: "20",
          color: "#333"
        }),
        d: common_vendor.p({
          name: "info-circle",
          size: "20",
          color: "#333"
        }),
        e: common_vendor.o(goToDetail),
        f: common_vendor.p({
          title: pageTitle.value,
          autoBack: true,
          leftIcon: "arrow-left",
          placeholder: true,
          safeAreaInsetTop: true
        }),
        g: common_vendor.o(handleSearch),
        h: common_vendor.o(handleClearSearch),
        i: common_vendor.o(($event) => searchKeyword.value = $event),
        j: common_vendor.p({
          placeholder: "关键词搜索, 如订单编号, 负责人",
          showAction: false,
          shape: "square",
          bgColor: "#f5f5f5",
          modelValue: searchKeyword.value
        }),
        k: common_vendor.o(handleTabChange),
        l: common_vendor.p({
          list: tabList.value,
          current: currentTab.value,
          activeStyle: {
            color: "#2979ff",
            fontWeight: "bold"
          },
          inactiveStyle: {
            color: "#666"
          },
          lineColor: "#2979ff",
          lineWidth: 30,
          lineHeight: 3,
          itemStyle: "padding-left: 15px; padding-right: 15px; height: 44px;"
        }),
        m: taskList.value.length === 0 && !loading.value
      }, taskList.value.length === 0 && !loading.value ? {
        n: common_vendor.o(fetchTaskList),
        o: common_vendor.p({
          type: "primary",
          text: "刷新",
          size: "mini"
        }),
        p: common_vendor.p({
          mode: "list",
          icon: "http://cdn.uviewui.com/uview/empty/list.png",
          text: "暂无巡检订单"
        })
      } : {}, {
        q: loading.value && taskList.value.length === 0
      }, loading.value && taskList.value.length === 0 ? {
        r: common_vendor.p({
          text: "加载中...",
          textSize: "16",
          color: "#2979ff"
        })
      } : {
        s: common_vendor.f(taskList.value, (task, index, i0) => {
          return {
            a: task.id || index,
            b: common_vendor.o(($event) => handleTaskClick(task), task.id || index),
            c: "4eb6758f-8-" + i0,
            d: common_vendor.p({
              task
            })
          };
        })
      }, {
        t: loadingMore.value
      }, loadingMore.value ? {
        v: common_vendor.p({
          text: "加载中...",
          size: "20",
          textSize: "14",
          color: "#999"
        })
      } : {}, {
        w: noMore.value
      }, noMore.value ? {} : {}, {
        x: refreshing.value,
        y: common_vendor.o(onRefresh),
        z: common_vendor.o(loadMore),
        A: common_vendor.p({
          name: "scan",
          size: "20",
          color: "#fff"
        }),
        B: common_vendor.o(handleScan),
        C: common_vendor.p({
          type: "primary",
          shape: "circle",
          customStyle: {
            height: "88rpx",
            fontSize: "32rpx",
            fontWeight: "500"
          }
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/order/list/index.js.map
