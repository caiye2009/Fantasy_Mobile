"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
const _sfc_main = {
  __name: "order_card",
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const statusColorMap = {
      online: "#2979ff",
      // 蓝色
      offline: "#909399",
      // 灰色
      fault: "#fa3534"
      // 红色
    };
    const getStatusColor = (status) => {
      return statusColorMap[status] || "#909399";
    };
    const handleRepair = () => {
      common_vendor.index.showModal({
        title: "维修确认",
        content: `确定要开始维修 ${props.task.name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "开始维修",
              icon: "success"
            });
          }
        }
      });
    };
    const handleCheck = () => {
      common_vendor.index.navigateTo({
        url: `/pages/device/check?id=${props.task.id}`
      });
    };
    const handleInspect = () => {
      common_vendor.index.navigateTo({
        url: `/pages/order/start?id=${props.task.id}`
      });
    };
    const handleDetail = () => {
      emit("click", props.task);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: getStatusColor(__props.task.status),
        b: common_vendor.t(__props.task.statusText),
        c: getStatusColor(__props.task.status),
        d: common_vendor.t(__props.task.name),
        e: __props.task.priority === "high"
      }, __props.task.priority === "high" ? {} : __props.task.priority === "medium" ? {} : {}, {
        f: __props.task.priority === "medium",
        g: common_vendor.t(__props.task.site),
        h: common_vendor.t(__props.task.serialNo),
        i: common_vendor.t(__props.task.responsible),
        j: common_vendor.t(__props.task.date),
        k: __props.task.status === "fault"
      }, __props.task.status === "fault" ? {
        l: common_vendor.o(handleRepair),
        m: common_vendor.p({
          type: "error",
          size: "mini",
          shape: "circle"
        })
      } : __props.task.status === "offline" ? {
        o: common_vendor.o(handleCheck),
        p: common_vendor.p({
          type: "warning",
          size: "mini",
          shape: "circle"
        })
      } : {
        q: common_vendor.o(handleInspect),
        r: common_vendor.p({
          type: "primary",
          size: "mini",
          shape: "circle"
        })
      }, {
        n: __props.task.status === "offline",
        s: common_vendor.o(handleDetail),
        t: common_vendor.p({
          type: "info",
          size: "mini",
          plain: true,
          shape: "circle"
        }),
        v: common_vendor.o(($event) => _ctx.$emit("click", __props.task))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-33cb024d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/order_card.js.map
