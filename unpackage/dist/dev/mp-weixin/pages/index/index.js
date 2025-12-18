"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const appTitle = common_vendor.ref("凡特思");
    const loading = common_vendor.ref(false);
    const showFooter = common_vendor.ref(true);
    const version = common_vendor.ref("1.0.0");
    common_vendor.onLoad(() => {
      const token = common_vendor.index.getStorageSync("token");
      if (token)
        common_vendor.index.navigateTo({ url: "/pages/order/index/index" });
    });
    const handleAuthLogin = async () => {
      if (loading.value)
        return;
      try {
        loading.value = true;
        const userInfoRes = await common_vendor.index.getUserProfile({ desc: "用于完善会员资料" });
        const loginRes = await common_vendor.index.login();
        common_vendor.index.setStorageSync("token", "mock_token_123456");
        common_vendor.index.setStorageSync("userInfo", userInfoRes.userInfo);
        common_vendor.index.showToast({ title: "授权成功", icon: "success", duration: 1500 });
        setTimeout(() => common_vendor.index.navigateTo({ url: "/pages/order/index/index" }), 1500);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.errMsg || "授权失败，请重试",
          icon: "error",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(appTitle.value),
        c: common_vendor.t(loading.value ? "授权中..." : "授权登录"),
        d: common_vendor.o(handleAuthLogin),
        e: common_vendor.p({
          type: "primary",
          size: "large",
          shape: "square",
          loading: loading.value,
          disabled: loading.value
        }),
        f: showFooter.value
      }, showFooter.value ? {
        g: common_vendor.t(version.value)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
