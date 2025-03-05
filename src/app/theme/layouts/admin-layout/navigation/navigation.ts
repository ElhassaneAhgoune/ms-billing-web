export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  apiEndpoint?: string; // Added to show API endpoint in tooltips
  path?: string;
  resourceId?: string;  // Added for RBAC permissions
  tooltipTitle?: string; // Added for enhanced tooltips
  disabled?: boolean;  // Added for disabled menu items
  badge?: { variant: string; text: string }; // Added for badge indicators
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-highlight',
    children: [
      {
        id: 'home',
        title: 'Home',
        type: 'item',
        url: '/dashboard/main',
        icon: 'dashboard',
        classes: 'nav-item',
        breadcrumbs: false,
        tooltipTitle: 'Main Dashboard',
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Executive Analytics',
    type: 'group',
    icon: 'chart-line',
    groupClasses: 'nav-group-premium',
    children: [
      {
        id: 'analytics-dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'dashboard',
        classes: 'nav-item premium-feature',
        breadcrumbs: false,
        resourceId: 'analytics',
        tooltipTitle: 'Executive Analytics Dashboard',
        badge: { variant: 'warning', text: 'Premium' }
      }
    ]
  },
  {
    id: 'visa-management',
    title: 'Invoice Management',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-visa',
    children: [
      {
        id: 'visa-section',
        title: 'Visa',
        type: 'item',
        url: '#',
        icon: 'credit-card',
        classes: 'nav-item section-header',
        breadcrumbs: false
      },
      {
        id: 'visa-invoices',
        title: 'Visa Invoices',
        type: 'item',
        url: '/invoices/visa',
        icon: 'credit-card',
        classes: 'nav-item visa-item',
        breadcrumbs: false,
        tooltipTitle: 'View all Visa invoices',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-upload',
        title: 'Upload Visa Invoice',
        type: 'item',
        url: '/invoices/visa/upload',
        classes: 'nav-item visa-item',
        icon: 'upload',
        breadcrumbs: false,
        tooltipTitle: 'Upload individual Visa invoice',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-summary',
        title: 'Visa Invoice Summary',
        type: 'item',
        url: '/invoices/visa/summary',
        classes: 'nav-item visa-item',
        icon: 'line-chart',
        breadcrumbs: false,
        tooltipTitle: 'Summarized invoice data',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-breakdown',
        title: 'Visa Service Breakdown',
        type: 'item',
        url: '/invoices/visa/breakdown',
        classes: 'nav-item visa-item',
        icon: 'pie-chart',
        breadcrumbs: false,
        tooltipTitle: 'Service-wise breakdown',
        resourceId: 'visa-invoices'
      },
      {
        id: 'mastercard-section',
        title: 'Mastercard',
        type: 'item',
        url: '#',
        icon: 'credit-card',
        classes: 'nav-item section-header',
        breadcrumbs: false
      },
      {
        id: 'mastercard-invoices',
        title: 'Mastercard Invoices',
        type: 'item',
        url: '/invoices/mastercard',
        icon: 'credit-card',
        classes: 'nav-item mastercard-item',
        breadcrumbs: false,
        tooltipTitle: 'View all Mastercard invoices',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-upload',
        title: 'Upload Mastercard Invoice',
        type: 'item',
        url: '/invoices/mastercard/upload',
        classes: 'nav-item mastercard-item',
        icon: 'upload',
        breadcrumbs: false,
        tooltipTitle: 'Upload individual Mastercard invoice',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'visa-detail',
        title: 'Visa Invoice Details',
        type: 'item',
        url: '/invoices/visa/:id',
        classes: 'nav-item',
        icon: 'file-text',
        breadcrumbs: false,
        hidden: true // Hide from menu but keep for breadcrumbs
      },
      {
        id: 'mastercard-detail',
        title: 'Mastercard Invoice Details',
        type: 'item',
        url: '/invoices/mastercard/:id',
        classes: 'nav-item',
        icon: 'file-text',
        breadcrumbs: false,
        hidden: true, // Hide from menu but keep for breadcrumbs
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-summary',
        title: 'Mastercard Invoice Summary',
        type: 'item',
        url: '/invoices/mastercard/summary',
        classes: 'nav-item mastercard-item',
        icon: 'line-chart',
        breadcrumbs: false,
        tooltipTitle: 'Summarized invoice data',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-breakdown',
        title: 'Mastercard Service Breakdown',
        type: 'item',
        url: '/invoices/mastercard/breakdown',
        classes: 'nav-item mastercard-item',
        icon: 'pie-chart',
        breadcrumbs: false,
        tooltipTitle: 'Service-wise breakdown',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'history-section',
        title: 'History',
        type: 'item',
        url: '#',
        icon: 'history',
        classes: 'nav-item section-header',
        breadcrumbs: false
      },
      {
        id: 'csv-files',
        title: 'Invoices Uploading history',
        type: 'item',
        url: '/csv-files',
        classes: 'nav-item history-item',
        icon: 'folder',
        breadcrumbs: false,
        tooltipTitle: 'Manage uploaded Invoices',
        resourceId: 'csv-files'
      }
    ]
  },
  {
    id: 'visa-csv-details',
    title: 'Visa CSV File Details',
    type: 'item',
    url: '/csv-files/visa/:csvName',
    classes: 'nav-item',
    icon: 'file-excel',
    breadcrumbs: false,
    hidden: true, // Hide from menu but keep for breadcrumbs
    resourceId: 'csv-files'
  },
  {
    id: 'mastercard-csv-details',
    title: 'Mastercard CSV File Details',
    type: 'item',
    url: '/csv-files/mastercard/:csvName',
    classes: 'nav-item',
    icon: 'file-excel',
    breadcrumbs: false,
    hidden: true, // Hide from menu but keep for breadcrumbs
    resourceId: 'csv-files'
  },
  {
    id: 'settings-management',
    title: 'SETTINGS',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-settings',
    children: [
      {
        id: 'users-section',
        title: 'Users',
        type: 'item',
        url: '#',
        icon: 'user',
        classes: 'nav-item section-header',
        breadcrumbs: false
      },
      {
        id: 'actions-follow-up',
        title: 'Audit Trail',
        type: 'item',
        url: '/follow-up',
        classes: 'nav-item users-item',
        icon: 'table',
        breadcrumbs: false,
        tooltipTitle: 'Audit Trail',
        resourceId: 'actions-follow-up'
      },
      {
        id: 'users-list',
        title: 'Users List',
        type: 'item',
        url: '/users-list',
        classes: 'nav-item users-item',
        icon: 'table',
        breadcrumbs: false,
        tooltipTitle: 'Users List',
        resourceId: 'users-list'
      },
      {
        id: 'bank-section',
        title: 'Banks',
        type: 'item',
        url: '#',
        icon: 'credit-card',
        classes: 'nav-item section-header',
        breadcrumbs: false
      },
     {
        id: 'bank-list',
        title: 'List of Banks',
        type: 'item',
        url: '/bank-list',
        classes: 'nav-item bank-item',
        icon: 'table',
        breadcrumbs: false,
        tooltipTitle: 'List of banks',
        resourceId: 'bank-list'
      },
      {
        id: 'bank-creation',
        title: 'Bank Creation',
        type: 'item',
        url: '/bank-list/create',
        classes: 'nav-item bank-item',
        icon: 'upload',
        breadcrumbs: false,
        tooltipTitle: 'Bank Creation',
        resourceId: 'bank-list'
      },
      {
        id: 'bank-detail',
        title: 'Update bank detail',
        type: 'item',
        url: '/bank-list/:id',
        classes: 'nav-item',
        icon: 'file-text',
        breadcrumbs: false,
        hidden: true
      }
    ]
  }
];
 