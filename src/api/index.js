/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-09 13:33:56
 * @LastEditTime: 2022-09-07 12:12:28
 * @Description: 组件创建
 */
const LOGIN = "/login/login"; // 登录

const LABOURLIST = "/labourManageController/getAdvancedQuery"; // 劳务管理列表
const LABOURLISTALL = "/labourManageController/getListprams"; // 劳务管理列表ALL
const LABOURADD = "/labourManageController/save"; // 新增
const LABOURUPDATE = "/labourManageController/update"; // 修改
const LABOURDEL = "/labourManageController/dels"; // 删除

const LABOURTYPELIST = "/labourTypeController/getAdvancedQuery"; //劳务分类列表
const LABOURTYPEADD = "/labourTypeController/save"; //劳务分类新增
const LABOURTYPEUPDATE = "/labourTypeController/update"; //劳务分类更新
const LABOURTYPEDEL = "/labourTypeController/dels"; //劳务分类删除

const PERSONALINFOLIST = "/personalInformationController/getAdvancedQuery"; //个人列表
const PERSONALINFOLISTALL = "/personalInformationController/getListprams"; //个人列表ALL
const PERSONIMPORTEXCEL = "/uploadController/importExcel";
const PERSONALINFOADD = "/personalInformationController/save"; // 个人新增
const PERSONALINFOUPDATE = "/personalInformationController/update"; // 个人修改
const PERSONALINFODEL = "/personalInformationController/dels"; // 个人删除
const SETPERSONBLACKLIST = "/personalInformationController/setBlackList"; // 将用户拉入黑名单

const BLACKLISTLIST = "/blackListController/getAdvancedQuery"; // 黑名单列表
const BLACKLISTADD = "/blackListController/save"; // 黑名单新增
const BLACKLISTUPDATE = "/blackListController/update"; // 黑名单修改
const BLACKLISTDEL = "/blackListController/dels"; // 黑名单删除
const BLACKLLISTEXMINE = "/blackListController/auditing"; //黑名单审批

const WORKTYPELIST = "/workTypeController/getAdvancedQuery"; // 工种 列表
const WORKTYPELISTALL = "/workTypeController/getListprams"; // 工种 列表不分页
const WORKTYPEADD = "/workTypeController/save"; // 工种 增
const WORKTYPEUPDATE = "/workTypeController/update"; // 工种 改
const WORKTYPEDEL = "/workTypeController/dels"; // 工种 删

const EMPLOYMENTLIST = "/appliactionEmploymentController/getAdvancedQuery"; //用工申请 增删改查
const EMPLOYMENTADD = "/appliactionEmploymentController/save";
const EMPLOYMENTUPDATE = "/appliactionEmploymentController/update";
const EMPLOYMENTDEL = "/appliactionEmploymentController/dels";

const SALARYPAYMENTLIST = "/clockRecordController/getAdvancedQuery"; // 薪资管理 增删改查
const SALARYPAYMENTADD = "/clockRecordController/save";
const SALARYPAYMENTUPDATE = "/clockRecordController/update";
const SALARYPAYMENTDEL = "/clockRecordController/dels";

const PELIST = "/attendanceRecordController/getAdvancedQuery"; // 打卡记录
const PEADD = "/personalEmploymentController/save";
const PEUPDATE = "/personalEmploymentController/update";
const PEDEL = "/personalEmploymentController/dels";

// 系统管理
const SYSORGSADD = "/sysorgController/save"; // 机构管理
const SYSORGSLIST = "/sysorgController/queryDepartmentByOrgIds"; //queryOrgByPageService
const SYSORGSLISTALL = "/sysorgController/getList";
const SYSORGSUPDATE = "/sysorgController/update";
const SYSORGSDEL = "/sysorgController/dels";

const SYSUSERSADD = "/sysuserController/save"; // 用户管理
const SYSUSERSLIST = "/sysuserController/getStringFliedsPage";
const SYSUSERSUPDATE = "/sysuserController/update";
const SYSUSERSDEL = "/sysuserController/dels";
const SAVEUSERROLES = "sysuserController/saveUserRoles";

const SYSROLEADD = "/sysroleController/save"; // 角色管理
const SYSROLELIST = "/sysroleController/getListprams";
const SYSROLEUPDATE = "/sysroleController/update";
const SYSROLEDEL = "/sysroleController/dels";
const SYSROLESMODULESSAVE = "/sysroleController/saveModuleUidsAndOperUids"; //角色保存菜单权限
const SYSROLESMODULES = "/sysroleController/queryModuleUidsAndOperUids"; //角色查询菜单权限

const SYSMODULEADD = "/sysmoduleController/save"; // 模块管理
const SYSMODULELIST = "/sysmoduleController/queryModuleByPageService";
const SYSMODULEUPDATE = "/sysmoduleController/update";
const SYSMODULEDEL = "/sysmoduleController/dels";
export {
  LOGIN,
  LABOURLIST,
  LABOURLISTALL,
  LABOURADD,
  LABOURUPDATE,
  LABOURDEL,
  PERSONALINFOLIST,
  PERSONALINFOLISTALL,
  PERSONIMPORTEXCEL,
  PERSONALINFOADD,
  PERSONALINFOUPDATE,
  PERSONALINFODEL,
  SETPERSONBLACKLIST,
  BLACKLISTLIST,
  BLACKLISTADD,
  BLACKLISTUPDATE,
  BLACKLISTDEL,
  BLACKLLISTEXMINE,
  LABOURTYPELIST,
  LABOURTYPEADD,
  LABOURTYPEUPDATE,
  LABOURTYPEDEL,
  WORKTYPELIST,
  WORKTYPELISTALL,
  WORKTYPEADD,
  WORKTYPEUPDATE,
  WORKTYPEDEL,
  EMPLOYMENTLIST,
  EMPLOYMENTADD,
  EMPLOYMENTUPDATE,
  EMPLOYMENTDEL,
  SALARYPAYMENTLIST,
  SALARYPAYMENTADD,
  SALARYPAYMENTUPDATE,
  SALARYPAYMENTDEL,
  PELIST,
  PEADD,
  PEUPDATE,
  PEDEL,
  SYSORGSADD,
  SYSORGSLIST,
  SYSORGSUPDATE,
  SYSORGSDEL,
  SYSUSERSADD,
  SYSUSERSLIST,
  SYSUSERSUPDATE,
  SYSUSERSDEL,
  SAVEUSERROLES,
  SYSROLEADD,
  SYSROLELIST,
  SYSROLEUPDATE,
  SYSROLEDEL,
  SYSROLESMODULESSAVE,
  SYSROLESMODULES,
  SYSMODULEADD,
  SYSMODULELIST,
  SYSORGSLISTALL,
  SYSMODULEUPDATE,
  SYSMODULEDEL,
};
