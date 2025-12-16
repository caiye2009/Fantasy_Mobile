"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_action_sheet2 = common_vendor.resolveComponent("u-action-sheet");
  const _easycom_u_modal2 = common_vendor.resolveComponent("u-modal");
  const _easycom_u_loading_page2 = common_vendor.resolveComponent("u-loading-page");
  (_easycom_u_icon2 + _easycom_u_navbar2 + _easycom_u_button2 + _easycom_u_image2 + _easycom_u_action_sheet2 + _easycom_u_modal2 + _easycom_u_loading_page2)();
}
const _easycom_u_icon = () => "../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_navbar = () => "../../../uni_modules/uview-plus/components/u-navbar/u-navbar.js";
const _easycom_u_button = () => "../../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_image = () => "../../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_action_sheet = () => "../../../uni_modules/uview-plus/components/u-action-sheet/u-action-sheet.js";
const _easycom_u_modal = () => "../../../uni_modules/uview-plus/components/u-modal/u-modal.js";
const _easycom_u_loading_page = () => "../../../uni_modules/uview-plus/components/u-loading-page/u-loading-page.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_navbar + _easycom_u_button + _easycom_u_image + _easycom_u_action_sheet + _easycom_u_modal + _easycom_u_loading_page)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const showActionSheet = common_vendor.ref(false);
    const showDeleteConfirm = common_vendor.ref(false);
    const showBottomActions = common_vendor.computed(() => {
      return [0, 2, 3].includes(orderInfo.status);
    });
    const orderInfo = common_vendor.reactive({
      id: "",
      orderNo: "",
      status: 1,
      // 0: 已取消, 1: 待付款, 2: 待发货/待收货, 3: 已完成
      createTime: "",
      paymentMethod: "",
      deliveryMethod: "",
      totalAmount: 0,
      shippingFee: 0,
      discountAmount: 0,
      payAmount: 0,
      remark: "",
      goods: [],
      address: {}
    });
    const actions = common_vendor.computed(() => {
      const baseActions = [
        { name: "查看物流", value: "logistics" },
        { name: "联系客服", value: "customerService" },
        { name: "复制订单号", value: "copy" }
      ];
      if (orderInfo.status === 1) {
        baseActions.unshift({ name: "取消订单", value: "cancel" });
      }
      return baseActions;
    });
    common_vendor.onLoad((options) => {
      if (options.id) {
        orderInfo.id = options.id;
        fetchOrderDetail(options.id);
      }
    });
    const fetchOrderDetail = (id) => {
      loading.value = true;
      setTimeout(() => {
        Object.assign(orderInfo, {
          id,
          orderNo: "20231225123456789",
          status: 1,
          createTime: "2023-12-25 14:30:25",
          paymentMethod: "微信支付",
          deliveryMethod: "快递配送",
          totalAmount: 198,
          shippingFee: 10,
          discountAmount: 20,
          payAmount: 188,
          remark: "请尽快发货，谢谢！",
          goods: [
            {
              id: 1,
              name: "商品名称示例商品名称示例商品名称示例",
              image: "https://via.placeholder.com/80x80",
              spec: "颜色：白色；尺码：M",
              price: 99,
              quantity: 2
            },
            {
              id: 2,
              name: "另一个商品示例",
              image: "https://via.placeholder.com/80x80",
              spec: "颜色：黑色；尺码：L",
              price: 89,
              quantity: 1
            }
          ],
          address: {
            receiver: "张三",
            phone: "13800138000",
            fullAddress: "广东省深圳市南山区科技园科苑路100号"
          }
        });
        loading.value = false;
      }, 800);
    };
    const getStatusIcon = (status) => {
      const icons = {
        0: "close-circle-fill",
        1: "clock-fill",
        2: "car-fill",
        3: "checkmark-circle-fill"
      };
      return icons[status] || "info-circle-fill";
    };
    const getStatusColor = (status) => {
      const colors = {
        0: "#909399",
        1: "#f9ae3d",
        2: "#2979ff",
        3: "#19be6b"
      };
      return colors[status] || "#909399";
    };
    const getStatusText = (status) => {
      const texts = {
        0: "已取消",
        1: "待付款",
        2: "待收货",
        3: "已完成"
      };
      return texts[status] || "未知状态";
    };
    const getStatusDesc = (status) => {
      const descs = {
        0: "订单已取消",
        1: "请在30分钟内完成支付",
        2: "商品正在运输中",
        3: "交易已完成"
      };
      return descs[status] || "";
    };
    const handlePay = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "模拟支付流程",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "支付成功",
              icon: "success"
            });
            orderInfo.status = 2;
          }
        }
      });
    };
    const handleCancel = () => {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "确定要取消这个订单吗？",
        success: (res) => {
          if (res.confirm) {
            orderInfo.status = 0;
            common_vendor.index.showToast({
              title: "订单已取消",
              icon: "success"
            });
          }
        }
      });
    };
    const handleConfirmReceipt = () => {
      common_vendor.index.showModal({
        title: "确认收货",
        content: "请确认已收到商品",
        success: (res) => {
          if (res.confirm) {
            orderInfo.status = 3;
            common_vendor.index.showToast({
              title: "确认收货成功",
              icon: "success"
            });
          }
        }
      });
    };
    const handleDelete = () => {
      showDeleteConfirm.value = true;
    };
    const confirmDelete = () => {
      common_vendor.index.showToast({
        title: "删除成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
      showDeleteConfirm.value = false;
    };
    const handleRebuy = () => {
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success"
      });
    };
    const handleAfterSale = () => {
      common_vendor.index.navigateTo({
        url: "/pages/afterSale/apply"
      });
    };
    const copyOrderNo = () => {
      common_vendor.index.setClipboardData({
        data: orderInfo.orderNo,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success"
          });
        }
      });
    };
    const onActionSelect = (item) => {
      showActionSheet.value = false;
      switch (item.value) {
        case "copy":
          copyOrderNo();
          break;
        case "logistics":
          common_vendor.index.navigateTo({
            url: `/pages/order/logistics?id=${orderInfo.id}`
          });
          break;
        case "customerService":
          common_vendor.index.makePhoneCall({
            phoneNumber: "400-123-4567"
          });
          break;
        case "cancel":
          handleCancel();
          break;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => showActionSheet.value = true),
        b: common_vendor.p({
          name: "more-dot-fill",
          color: "#333",
          size: "22"
        }),
        c: common_vendor.p({
          title: "订单详情",
          autoBack: true,
          placeholder: true,
          bgColor: "#ffffff"
        }),
        d: common_vendor.p({
          name: getStatusIcon(orderInfo.status),
          size: "40",
          color: getStatusColor(orderInfo.status)
        }),
        e: common_vendor.t(getStatusText(orderInfo.status)),
        f: common_vendor.t(getStatusDesc(orderInfo.status)),
        g: orderInfo.status === 1
      }, orderInfo.status === 1 ? {
        h: common_vendor.o(handlePay),
        i: common_vendor.p({
          type: "primary",
          size: "small",
          text: "立即支付"
        }),
        j: common_vendor.o(handleCancel),
        k: common_vendor.p({
          type: "default",
          size: "small",
          text: "取消订单"
        })
      } : {}, {
        l: common_vendor.p({
          name: "map-fill",
          color: "#2979ff",
          size: "20"
        }),
        m: common_vendor.t(orderInfo.address.receiver),
        n: common_vendor.t(orderInfo.address.phone),
        o: common_vendor.t(orderInfo.address.fullAddress),
        p: common_vendor.p({
          name: "bag-fill",
          color: "#2979ff",
          size: "20"
        }),
        q: common_vendor.f(orderInfo.goods, (item, index, i0) => {
          return {
            a: "a8bbe39b-7-" + i0,
            b: common_vendor.p({
              src: item.image,
              width: "80",
              height: "80",
              radius: "8"
            }),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.spec),
            e: common_vendor.t(item.price),
            f: common_vendor.t(item.quantity),
            g: index
          };
        }),
        r: common_vendor.p({
          name: "order",
          color: "#2979ff",
          size: "20"
        }),
        s: common_vendor.t(orderInfo.orderNo),
        t: common_vendor.o(copyOrderNo),
        v: common_vendor.p({
          name: "file-text",
          size: "18"
        }),
        w: common_vendor.t(orderInfo.createTime),
        x: common_vendor.t(orderInfo.paymentMethod),
        y: common_vendor.t(orderInfo.deliveryMethod),
        z: orderInfo.remark
      }, orderInfo.remark ? {
        A: common_vendor.t(orderInfo.remark)
      } : {}, {
        B: common_vendor.t(orderInfo.totalAmount),
        C: common_vendor.t(orderInfo.shippingFee),
        D: common_vendor.t(orderInfo.discountAmount),
        E: common_vendor.t(orderInfo.payAmount),
        F: showBottomActions.value
      }, showBottomActions.value ? common_vendor.e({
        G: orderInfo.status === 2
      }, orderInfo.status === 2 ? {
        H: common_vendor.o(handleConfirmReceipt),
        I: common_vendor.p({
          type: "primary",
          text: "确认收货"
        })
      } : {}, {
        J: orderInfo.status === 0
      }, orderInfo.status === 0 ? {
        K: common_vendor.o(handleDelete),
        L: common_vendor.p({
          type: "error",
          text: "删除订单"
        })
      } : {}, {
        M: orderInfo.status === 3
      }, orderInfo.status === 3 ? {
        N: common_vendor.o(handleRebuy),
        O: common_vendor.p({
          type: "default",
          text: "再次购买"
        })
      } : {}, {
        P: orderInfo.status === 3
      }, orderInfo.status === 3 ? {
        Q: common_vendor.o(handleAfterSale),
        R: common_vendor.p({
          type: "primary",
          plain: true,
          text: "申请售后"
        })
      } : {}) : {}, {
        S: common_vendor.o(($event) => showActionSheet.value = false),
        T: common_vendor.o(onActionSelect),
        U: common_vendor.p({
          show: showActionSheet.value,
          actions: actions.value,
          title: "更多操作"
        }),
        V: common_vendor.o(confirmDelete),
        W: common_vendor.o(($event) => showDeleteConfirm.value = false),
        X: common_vendor.p({
          show: showDeleteConfirm.value,
          title: "确认删除",
          content: "确定要删除这个订单吗？删除后不可恢复。",
          showCancelButton: true
        }),
        Y: common_vendor.p({
          loading: loading.value,
          bgColor: "#f8f8f8"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8bbe39b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/order/detail/index.js.map
