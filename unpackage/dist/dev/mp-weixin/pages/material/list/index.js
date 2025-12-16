"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_u_datetime_picker2 = common_vendor.resolveComponent("u-datetime-picker");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  (_easycom_u_search2 + _easycom_u_button2 + _easycom_u_input2 + _easycom_u_picker2 + _easycom_u_datetime_picker2 + _easycom_u_loading_icon2 + _easycom_u_empty2 + _easycom_u_icon2 + _easycom_u_tag2)();
}
const _easycom_u_search = () => "../../../uni_modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_button = () => "../../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_input = () => "../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_picker = () => "../../../uni_modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_u_datetime_picker = () => "../../../uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.js";
const _easycom_u_loading_icon = () => "../../../uni_modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_empty = () => "../../../uni_modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_icon = () => "../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_tag = () => "../../../uni_modules/uview-plus/components/u-tag/u-tag.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_button + _easycom_u_input + _easycom_u_picker + _easycom_u_datetime_picker + _easycom_u_loading_icon + _easycom_u_empty + _easycom_u_icon + _easycom_u_tag)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const showFilterPanel = common_vendor.ref(false);
    const showCategoryPicker = common_vendor.ref(false);
    const showStockStatusPicker = common_vendor.ref(false);
    const showDatePicker = common_vendor.ref(false);
    const filterForm = common_vendor.reactive({
      supplier: "",
      minStock: "",
      maxStock: "",
      addDate: ""
    });
    const categoryValue = common_vendor.ref("");
    const stockStatusValue = common_vendor.ref("");
    const categoryDisplay = common_vendor.computed(() => {
      const option = categoryOptions.value.find((opt) => opt.value === categoryValue.value);
      return option ? option.label : "选择原料分类";
    });
    const stockStatusDisplay = common_vendor.computed(() => {
      const option = stockStatusOptions.value.find((opt) => opt.value === stockStatusValue.value);
      return option ? option.label : "选择库存状态";
    });
    const dateDisplay = common_vendor.computed(() => {
      return filterForm.addDate || "选择日期";
    });
    const categoryOptions = common_vendor.ref([
      { label: "全部", value: "" },
      { label: "金属材料", value: "metal" },
      { label: "塑料原料", value: "plastic" },
      { label: "化工原料", value: "chemical" },
      { label: "电子元件", value: "electronic" },
      { label: "包装材料", value: "packaging" }
    ]);
    const stockStatusOptions = common_vendor.ref([
      { label: "全部", value: "" },
      { label: "库存充足", value: "available" },
      { label: "库存紧张", value: "limited" },
      { label: "缺货", value: "out" }
    ]);
    const loading = common_vendor.ref(true);
    const materials = common_vendor.ref([]);
    const getCategoryIcon = (category) => {
      const iconMap = {
        "metal": "shopping-cart",
        "plastic": "tags",
        "chemical": "flask",
        "electronic": "wifi",
        "packaging": "gift"
      };
      return iconMap[category] || "cube";
    };
    const getCategoryColor = (category) => {
      const colorMap = {
        "metal": "#e74c3c",
        "plastic": "#3498db",
        "chemical": "#9b59b6",
        "electronic": "#f39c12",
        "packaging": "#1abc9c"
      };
      return colorMap[category] || "#95a5a6";
    };
    const getStatusText = (status) => {
      const statusMap = {
        "available": "库存充足",
        "limited": "库存紧张",
        "out": "缺货"
      };
      return statusMap[status] || "未知";
    };
    const getStatusType = (status) => {
      const typeMap = {
        "available": "success",
        "limited": "warning",
        "out": "error"
      };
      return typeMap[status] || "info";
    };
    const toggleFilterPanel = () => {
      showFilterPanel.value = !showFilterPanel.value;
    };
    const handleSearch = () => {
      common_vendor.index.__f__("log", "at pages/material/list/index.vue:371", "搜索关键词:", searchKeyword.value);
    };
    const handleCategoryConfirm = (e) => {
      const selected = e.value[0];
      categoryValue.value = selected.value;
      showCategoryPicker.value = false;
      handleFilterChange();
    };
    const handleStockStatusConfirm = (e) => {
      const selected = e.value[0];
      stockStatusValue.value = selected.value;
      showStockStatusPicker.value = false;
      handleFilterChange();
    };
    const handleDateConfirm = (e) => {
      const date = new Date(e.value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      filterForm.addDate = `${year}-${month}-${day}`;
      showDatePicker.value = false;
      handleFilterChange();
    };
    const handleFilterChange = () => {
      common_vendor.index.__f__("log", "at pages/material/list/index.vue:404", "筛选条件变化:", { ...filterForm, category: categoryValue.value, stockStatus: stockStatusValue.value });
    };
    const handleFilter = () => {
      common_vendor.index.__f__("log", "at pages/material/list/index.vue:409", "应用筛选条件:", { ...filterForm, category: categoryValue.value, stockStatus: stockStatusValue.value });
    };
    const resetFilters = () => {
      Object.keys(filterForm).forEach((key) => {
        filterForm[key] = "";
      });
      categoryValue.value = "";
      stockStatusValue.value = "";
      searchKeyword.value = "";
      loadMaterials();
    };
    const handleItemClick = (material) => {
      common_vendor.index.showToast({
        title: `点击了 ${material.name}`,
        icon: "none"
      });
    };
    const handleAddMaterial = () => {
      common_vendor.index.showToast({
        title: "点击了新增原料",
        icon: "none"
      });
    };
    const hasActiveFilters = common_vendor.computed(() => {
      return Object.values(filterForm).some((value) => value !== "") || categoryValue.value !== "" || stockStatusValue.value !== "" || searchKeyword.value !== "";
    });
    const filteredMaterials = common_vendor.computed(() => {
      if (!materials.value.length)
        return [];
      let result = [...materials.value];
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(
          (material) => material.name.toLowerCase().includes(keyword) || material.code.toLowerCase().includes(keyword)
        );
      }
      if (categoryValue.value) {
        result = result.filter((material) => material.categoryValue === categoryValue.value);
      }
      if (filterForm.supplier) {
        result = result.filter(
          (material) => material.supplier.toLowerCase().includes(filterForm.supplier.toLowerCase())
        );
      }
      if (stockStatusValue.value) {
        result = result.filter((material) => material.stockStatus === stockStatusValue.value);
      }
      if (filterForm.minStock) {
        result = result.filter((material) => material.stock >= parseInt(filterForm.minStock));
      }
      if (filterForm.maxStock) {
        result = result.filter((material) => material.stock <= parseInt(filterForm.maxStock));
      }
      if (filterForm.addDate) {
        result = result.filter((material) => material.addTime.includes(filterForm.addDate));
      }
      return result;
    });
    const loadMaterials = () => {
      loading.value = true;
      setTimeout(() => {
        materials.value = [
          {
            id: 1,
            name: "不锈钢板",
            code: "MAT001",
            category: "金属材料",
            categoryValue: "metal",
            supplier: "华东钢材有限公司",
            stock: 1500,
            unit: "吨",
            stockStatus: "available",
            addTime: "2023-05-10"
          },
          {
            id: 2,
            name: "ABS塑料",
            code: "MAT002",
            category: "塑料原料",
            categoryValue: "plastic",
            supplier: "华南化工集团",
            stock: 800,
            unit: "千克",
            stockStatus: "limited",
            addTime: "2023-06-15"
          },
          {
            id: 3,
            name: "硫酸",
            code: "MAT003",
            category: "化工原料",
            categoryValue: "chemical",
            supplier: "北方化学制品厂",
            stock: 0,
            unit: "升",
            stockStatus: "out",
            addTime: "2023-04-22"
          },
          {
            id: 4,
            name: "电阻",
            code: "MAT004",
            category: "电子元件",
            categoryValue: "electronic",
            supplier: "深圳电子元器件",
            stock: 1e4,
            unit: "个",
            stockStatus: "available",
            addTime: "2023-07-05"
          },
          {
            id: 5,
            name: "纸箱",
            code: "MAT005",
            category: "包装材料",
            categoryValue: "packaging",
            supplier: "华东包装制品",
            stock: 5e3,
            unit: "个",
            stockStatus: "available",
            addTime: "2023-06-30"
          },
          {
            id: 6,
            name: "铜线",
            code: "MAT006",
            category: "金属材料",
            categoryValue: "metal",
            supplier: "华东钢材有限公司",
            stock: 200,
            unit: "卷",
            stockStatus: "limited",
            addTime: "2023-07-12"
          }
        ];
        loading.value = false;
      }, 800);
    };
    common_vendor.onMounted(() => {
      loadMaterials();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleSearch),
        c: common_vendor.o(($event) => searchKeyword.value = $event),
        d: common_vendor.p({
          placeholder: "输入原料名称或编号搜索",
          ["show-action"]: false,
          ["bg-color"]: "#ffffff",
          ["border-color"]: "#e0e0e0",
          shape: "square",
          height: "40",
          modelValue: searchKeyword.value
        }),
        e: common_vendor.t(showFilterPanel.value ? "收起筛选" : "展开筛选"),
        f: common_vendor.o(toggleFilterPanel),
        g: common_vendor.p({
          type: "primary",
          icon: showFilterPanel.value ? "arrow-up" : "arrow-down",
          size: "small",
          ["custom-style"]: "height: 40px; display: flex; align-items: center; justify-content: center;"
        }),
        h: showFilterPanel.value
      }, showFilterPanel.value ? {
        i: common_vendor.o(($event) => categoryDisplay.value = $event),
        j: common_vendor.p({
          placeholder: "选择原料分类",
          readonly: true,
          border: "bottom",
          ["suffix-icon"]: "arrow-down",
          ["suffix-icon-style"]: "color: #909399;",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: categoryDisplay.value
        }),
        k: common_vendor.o(($event) => showCategoryPicker.value = true),
        l: common_vendor.o(handleFilterChange),
        m: common_vendor.o(($event) => filterForm.supplier = $event),
        n: common_vendor.p({
          placeholder: "输入供应商名称",
          clearable: true,
          border: "bottom",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: filterForm.supplier
        }),
        o: common_vendor.o(($event) => stockStatusDisplay.value = $event),
        p: common_vendor.p({
          placeholder: "选择库存状态",
          readonly: true,
          border: "bottom",
          ["suffix-icon"]: "arrow-down",
          ["suffix-icon-style"]: "color: #909399;",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: stockStatusDisplay.value
        }),
        q: common_vendor.o(($event) => showStockStatusPicker.value = true),
        r: common_vendor.o(handleFilterChange),
        s: common_vendor.o(($event) => filterForm.minStock = $event),
        t: common_vendor.p({
          placeholder: "最小库存量",
          type: "number",
          clearable: true,
          border: "bottom",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: filterForm.minStock
        }),
        v: common_vendor.o(handleFilterChange),
        w: common_vendor.o(($event) => filterForm.maxStock = $event),
        x: common_vendor.p({
          placeholder: "最大库存量",
          type: "number",
          clearable: true,
          border: "bottom",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: filterForm.maxStock
        }),
        y: common_vendor.o(($event) => dateDisplay.value = $event),
        z: common_vendor.p({
          placeholder: "选择日期",
          readonly: true,
          border: "bottom",
          ["suffix-icon"]: "calendar",
          ["suffix-icon-style"]: "color: #909399;",
          ["input-align"]: "left",
          ["custom-style"]: "display: flex; align-items: center;",
          modelValue: dateDisplay.value
        }),
        A: common_vendor.o(($event) => showDatePicker.value = true),
        B: common_vendor.o(handleFilter),
        C: common_vendor.p({
          type: "primary",
          icon: "search",
          ["custom-style"]: "display: flex; align-items: center; justify-content: center; height: 36px;"
        }),
        D: common_vendor.o(resetFilters),
        E: common_vendor.p({
          icon: "reload",
          ["custom-style"]: "display: flex; align-items: center; justify-content: center; height: 36px;"
        })
      } : {}, {
        F: common_vendor.o(handleCategoryConfirm),
        G: common_vendor.o(($event) => showCategoryPicker.value = false),
        H: common_vendor.o(($event) => showCategoryPicker.value = $event),
        I: common_vendor.p({
          columns: [categoryOptions.value],
          keyName: "label",
          title: "选择原料分类",
          show: showCategoryPicker.value
        }),
        J: common_vendor.o(handleStockStatusConfirm),
        K: common_vendor.o(($event) => showStockStatusPicker.value = false),
        L: common_vendor.p({
          show: showStockStatusPicker.value,
          columns: [stockStatusOptions.value],
          keyName: "label",
          title: "选择库存状态"
        }),
        M: common_vendor.o(handleDateConfirm),
        N: common_vendor.o(($event) => showDatePicker.value = false),
        O: common_vendor.o(($event) => filterForm.addDate = $event),
        P: common_vendor.p({
          show: showDatePicker.value,
          mode: "date",
          title: "选择日期",
          modelValue: filterForm.addDate
        }),
        Q: loading.value
      }, loading.value ? {
        R: common_vendor.p({
          text: "加载中...",
          size: "20",
          color: "#2979ff"
        })
      } : filteredMaterials.value.length === 0 ? common_vendor.e({
        T: hasActiveFilters.value
      }, hasActiveFilters.value ? {
        U: common_vendor.o(resetFilters)
      } : {}, {
        V: common_vendor.p({
          mode: "data",
          icon: "/static/images/empty-data.png",
          text: "暂无原料数据"
        })
      }) : {
        W: common_vendor.f(filteredMaterials.value, (material, k0, i0) => {
          return {
            a: "86da4f89-15-" + i0,
            b: common_vendor.p({
              name: getCategoryIcon(material.categoryValue),
              size: "24",
              color: getCategoryColor(material.categoryValue)
            }),
            c: common_vendor.t(material.name),
            d: common_vendor.t(material.code),
            e: "86da4f89-16-" + i0,
            f: common_vendor.t(material.category),
            g: "86da4f89-17-" + i0,
            h: common_vendor.t(material.supplier),
            i: "86da4f89-18-" + i0,
            j: common_vendor.t(material.stock),
            k: common_vendor.t(material.unit),
            l: "86da4f89-19-" + i0,
            m: common_vendor.t(material.addTime),
            n: "86da4f89-20-" + i0,
            o: common_vendor.p({
              text: getStatusText(material.stockStatus),
              type: getStatusType(material.stockStatus),
              size: "mini",
              plain: material.stockStatus !== "available",
              ["custom-style"]: "display: flex; align-items: center;"
            }),
            p: material.id,
            q: common_vendor.o(($event) => handleItemClick(material), material.id)
          };
        }),
        X: common_vendor.p({
          name: "grid",
          size: "14",
          color: "#909399"
        }),
        Y: common_vendor.p({
          name: "account",
          size: "14",
          color: "#909399"
        }),
        Z: common_vendor.p({
          name: "list-dot",
          size: "14",
          color: "#909399"
        }),
        aa: common_vendor.p({
          name: "calendar",
          size: "14",
          color: "#909399"
        })
      }, {
        S: filteredMaterials.value.length === 0,
        ab: !loading.value
      }, !loading.value ? {
        ac: common_vendor.o(handleAddMaterial),
        ad: common_vendor.p({
          type: "primary",
          icon: "plus",
          ["custom-style"]: "display: flex; align-items: center; justify-content: center; height: 44px;",
          text: "新增原料"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-86da4f89"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/material/list/index.js.map
