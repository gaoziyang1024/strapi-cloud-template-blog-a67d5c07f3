const config = {
  // 配置管理后台支持的语言
  locales: [
    'zh-Hans', // 简体中文
    'en'       // 英文
  ],
  // 设置默认语言
  defaultLocale: 'zh-Hans',
  // 自定义翻译 - 中文
  translations: {
    'zh-Hans': {
      // 通用翻译
      'app.components.HomePage.welcome': '欢迎使用 GDITE 内容管理系统',
      'app.components.HomePage.welcome.again': '欢迎回来！',
      'app.components.HomePage.create': '创建你的第一个内容类型',
      
      // 认证相关
      'Auth.form.welcome.title': '欢迎登录 GDITE CMS',
      'Auth.form.welcome.subtitle': '登录您的账户',
      'Auth.form.button.login': '登录',
      'Auth.form.button.register': '注册',
      'Auth.form.error.email.required': '邮箱是必填项',
      'Auth.form.error.password.required': '密码是必填项',
      
      // 导航菜单
      'app.components.LeftMenu.navbrand.title': 'GDITE 管理系统',
      'app.components.LeftMenu.navbrand.workplace': 'GDITE 工作台',
      
      // 内容管理器
      'content-manager.headerLayout.title': '内容管理器',
      'content-manager.components.List.title': '内容列表',
      'content-manager.containers.Edit.pluginHeader.title.new': '创建新内容',
      'content-manager.containers.Edit.pluginHeader.title.edit': '编辑内容',
      
      // 设置页面
      'Settings.application.title': '应用设置',
      'Settings.application.description': '管理您的应用设置',
      'Settings.application.customization.menu-logo.carousel.title': 'GDITE 管理系统',
      'Settings.application.language.title': '语言设置',
      'Settings.application.language.description': '选择管理后台的显示语言',
      
      // 用户管理
      'Settings.permissions.users.title': '用户管理',
      'Settings.permissions.users.description': '管理系统用户',
      'Settings.permissions.roles.title': '角色管理',
      'Settings.permissions.roles.description': '管理用户角色权限',
      
      // 通用操作
      'app.utils.save': '保存',
      'app.utils.cancel': '取消',
      'app.utils.delete': '删除',
      'app.utils.edit': '编辑',
      'app.utils.add': '添加',
      'app.utils.create': '创建',
      'app.utils.publish': '发布',
      'app.utils.unpublish': '取消发布',
      'app.utils.search': '搜索',
      'app.utils.filter': '筛选',
      'app.utils.reset': '重置'
    },
    
    // 英文翻译
    'en': {
      'app.components.HomePage.welcome': 'Welcome to GDITE Content Management System',
      'app.components.HomePage.welcome.again': 'Welcome back!',
      'app.components.HomePage.create': 'Create your first Content Type',
      
      'Auth.form.welcome.title': 'Welcome to GDITE CMS',
      'Auth.form.welcome.subtitle': 'Log in to your account',
      'Auth.form.button.login': 'Login',
      'Auth.form.button.register': 'Register',
      'Auth.form.error.email.required': 'Email is required',
      'Auth.form.error.password.required': 'Password is required',
      
      'app.components.LeftMenu.navbrand.title': 'GDITE Management System',
      'app.components.LeftMenu.navbrand.workplace': 'GDITE Workplace',
      
      'content-manager.headerLayout.title': 'Content Manager',
      'content-manager.components.List.title': 'Content List',
      'content-manager.containers.Edit.pluginHeader.title.new': 'Create New Content',
      'content-manager.containers.Edit.pluginHeader.title.edit': 'Edit Content',
      
      'Settings.application.title': 'Application Settings',
      'Settings.application.description': 'Manage your application settings',
      'Settings.application.customization.menu-logo.carousel.title': 'GDITE Management System',
      'Settings.application.language.title': 'Language Settings',
      'Settings.application.language.description': 'Choose the display language for admin panel',
      
      'Settings.permissions.users.title': 'User Management',
      'Settings.permissions.users.description': 'Manage system users',
      'Settings.permissions.roles.title': 'Role Management',
      'Settings.permissions.roles.description': 'Manage user role permissions',
      
      'app.utils.save': 'Save',
      'app.utils.cancel': 'Cancel',
      'app.utils.delete': 'Delete',
      'app.utils.edit': 'Edit',
      'app.utils.add': 'Add',
      'app.utils.create': 'Create',
      'app.utils.publish': 'Publish',
      'app.utils.unpublish': 'Unpublish',
      'app.utils.search': 'Search',
      'app.utils.filter': 'Filter',
      'app.utils.reset': 'Reset'
    }
  },
  
  // 主题配置
  theme: {
    light: {},
    dark: {}
  },
  
  // 头部配置
  head: {
    favicon: '/favicon.png'
  }
};

const bootstrap = (app) => {
  // 添加语言切换逻辑
  const savedLanguage = window.localStorage.getItem('strapi-admin-language');
  if (savedLanguage && config.locales.includes(savedLanguage)) {
    // 如果本地存储中有保存的语言设置，则使用该设置
    app.locales = config.locales;
    app.defaultLocale = savedLanguage;
  }
  
  console.log('GDITE CMS 管理后台启动完成 - GDITE CMS Admin Panel Started');
  console.log('支持的语言 - Supported Languages:', config.locales);
};

export default {
  config,
  bootstrap,
}; 