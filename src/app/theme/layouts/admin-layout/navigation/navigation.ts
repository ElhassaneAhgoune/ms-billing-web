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
        url: '/dashboard/default',
        icon: 'dashboard',
        classes: 'nav-item',
        breadcrumbs: false,
        tooltipTitle: 'Main Dashboard',
        description: 'Overview and statistics'
      }
    ]
  },
  {
    id: 'visa-management',
    title: 'Visa Invoice Management',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-visa',
    children: [
      {
        id: 'visa-invoices',
        title: 'Visa Invoices',
        type: 'item',
        url: '/invoices/visa',
        icon: 'credit-card',
        classes: 'nav-item',
        breadcrumbs: false,
        description: 'List & filter invoices',
        apiEndpoint: 'GET /api/invoices/visa',
        tooltipTitle: 'View all Visa invoices',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-detail',
        title: 'Visa Invoice Details',
        type: 'item',
        url: '/invoices/visa/:id',
        classes: 'nav-item',
        icon: 'file-text',
        breadcrumbs: false,
        apiEndpoint: 'GET /api/invoices/visa/{id}',
        hidden: true // Hide from menu but keep for breadcrumbs
      },
      {
        id: 'visa-upload',
        title: 'Upload Visa Invoice',
        type: 'item',
        url: '/invoices/visa/upload',
        classes: 'nav-item',
        icon: 'upload',
        breadcrumbs: false,
        description: 'Upload single invoice',
        apiEndpoint: 'POST /api/invoices/upload/visa',
        tooltipTitle: 'Upload individual Visa invoice',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-csv-upload',
        title: 'Upload Visa CSV',
        type: 'item',
        url: '/invoices/visa/csv-upload',
        classes: 'nav-item',
        icon: 'file-upload',
        breadcrumbs: false,
        description: 'Upload multiple invoices',
        apiEndpoint: 'POST /api/invoices/upload/visa/list-csv-files',
        tooltipTitle: 'Batch upload via CSV',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-summary',
        title: 'Visa Invoice Summary',
        type: 'item',
        url: '/invoices/visa/summary',
        classes: 'nav-item',
        icon: 'line-chart',
        breadcrumbs: false,
        description: 'View summary',
        apiEndpoint: 'GET /api/invoices/summary/visa',
        tooltipTitle: 'Summarized invoice data',
        resourceId: 'visa-invoices'
      },
      {
        id: 'visa-breakdown',
        title: 'Visa Service Breakdown',
        type: 'item',
        url: '/invoices/visa/breakdown',
        classes: 'nav-item',
        icon: 'pie-chart',
        breadcrumbs: false,
        description: 'Breakdown details',
        apiEndpoint: 'GET /api/invoices/services-beakdown/visa',
        tooltipTitle: 'Service-wise breakdown',
        resourceId: 'visa-invoices'
      }
    ]
  },
  {
    id: 'mastercard-management',
    title: 'Mastercard Invoice Management',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-mastercard',
    children: [
      {
        id: 'mastercard-invoices',
        title: 'Mastercard Invoices',
        type: 'item',
        url: '/invoices/mastercard',
        icon: 'credit-card',
        classes: 'nav-item',
        breadcrumbs: false,
        description: 'List & filter invoices',
        apiEndpoint: 'GET /api/invoices/mastercard',
        tooltipTitle: 'View all Mastercard invoices',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-detail',
        title: 'Mastercard Invoice Details',
        type: 'item',
        url: '/invoices/mastercard/:id',
        classes: 'nav-item',
        icon: 'file-text',
        breadcrumbs: false,
        apiEndpoint: 'GET /api/invoices/mastercard/{id}',
        hidden: true, // Hide from menu but keep for breadcrumbs
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-upload',
        title: 'Upload Mastercard Invoice',
        type: 'item',
        url: '/invoices/mastercard/upload',
        classes: 'nav-item',
        icon: 'upload',
        breadcrumbs: false,
        description: 'Upload single invoice',
        apiEndpoint: 'POST /api/invoices/upload/mastercard',
        tooltipTitle: 'Upload individual Mastercard invoice',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-csv-upload',
        title: 'Upload Mastercard CSV',
        type: 'item',
        url: '/invoices/mastercard/csv-upload',
        classes: 'nav-item',
        icon: 'file-upload',
        breadcrumbs: false,
        description: 'Upload multiple invoices',
        apiEndpoint: 'POST /api/invoices/upload/mastercard/list-csv-files',
        tooltipTitle: 'Batch upload via CSV',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-summary',
        title: 'Mastercard Invoice Summary',
        type: 'item',
        url: '/invoices/mastercard/summary',
        classes: 'nav-item',
        icon: 'line-chart',
        breadcrumbs: false,
        description: 'View summary',
        apiEndpoint: 'GET /api/invoices/summary/masterCard',
        tooltipTitle: 'Summarized invoice data',
        resourceId: 'mastercard-invoices'
      },
      {
        id: 'mastercard-breakdown',
        title: 'Mastercard Service Breakdown',
        type: 'item',
        url: '/invoices/mastercard/breakdown',
        classes: 'nav-item',
        icon: 'pie-chart',
        breadcrumbs: false,
        description: 'Breakdown details',
        apiEndpoint: 'GET /api/invoices/service-breakdown/masterCard',
        tooltipTitle: 'Service-wise breakdown',
        resourceId: 'mastercard-invoices'
      }
    ]
  },
  {
    id: 'csv-management',
    title: 'CSV File Management',
    type: 'group',
    icon: 'icon-navigation',
    groupClasses: 'nav-group-csv',
    children: [
      {
        id: 'csv-files',
        title: 'Load CSV Files',
        type: 'item',
        url: '/csv-files',
        classes: 'nav-item',
        icon: 'folder',
        breadcrumbs: false,
        description: 'Filter & manage CSV',
        apiEndpoint: 'GET /api/csv-file/load',
        tooltipTitle: 'Manage uploaded CSV files',
        resourceId: 'csv-files'
      },
      {
        id: 'visa-csv-details',
        title: 'Visa CSV File Details',
        type: 'item',
        url: '/csv-files/visa/:csvName',
        classes: 'nav-item',
        icon: 'file-excel',
        breadcrumbs: false,
        apiEndpoint: 'GET /api/csv-file/load/visa/{csvName}',
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
        apiEndpoint: 'GET /api/csv-file/load/master-card/{csvName}',
        hidden: true, // Hide from menu but keep for breadcrumbs
        resourceId: 'csv-files'
      }
    ]
  }
];
