// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Project import
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { DataTableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

@Component({
  selector: 'app-data-table-demo',
  standalone: true,
  imports: [CommonModule, CardComponent, DataTableComponent],
  templateUrl: './data-table-demo.component.html',
  styleUrls: ['./data-table-demo.component.scss']
})
export class DataTableDemoComponent implements OnInit {
  // Table data
  users: User[] = [];
  loading = false;
  errorMessage: string | null = null;

  // Table columns configuration
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      format: (value: string) => value // This will be handled in the template
    },
    { key: 'joinDate', label: 'Join Date' }
  ];

  // Products table data
  products = [
    {
      id: 'PRD-001',
      name: 'Premium Laptop',
      category: 'Electronics',
      price: '$1,299.00',
      stock: 45,
      status: 'In Stock'
    },
    {
      id: 'PRD-002',
      name: 'Wireless Headphones',
      category: 'Audio',
      price: '$199.00',
      stock: 120,
      status: 'In Stock'
    },
    {
      id: 'PRD-003',
      name: 'Smart Watch',
      category: 'Wearables',
      price: '$299.00',
      stock: 30,
      status: 'Low Stock'
    },
    {
      id: 'PRD-004',
      name: 'Ultra HD Monitor',
      category: 'Electronics',
      price: '$499.00',
      stock: 0,
      status: 'Out of Stock'
    },
    {
      id: 'PRD-005',
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: '$89.00',
      stock: 75,
      status: 'In Stock'
    }
  ];

  // Products table columns
  productColumns = [
    { key: 'id', label: 'Product ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', class: 'text-end' },
    { key: 'stock', label: 'Stock', class: 'text-end' },
    { key: 'status', label: 'Status' }
  ];

  // Orders table data
  orders = [
    {
      id: '84564564',
      customer: 'John Smith',
      product: 'Camera Lens',
      date: '2023-05-15',
      amount: '$40,570',
      status: 'Delivered'
    },
    {
      id: '84564786',
      customer: 'Emma Johnson',
      product: 'Laptop',
      date: '2023-05-16',
      amount: '$1,350',
      status: 'Pending'
    },
    {
      id: '84564522',
      customer: 'Michael Brown',
      product: 'Mobile Phone',
      date: '2023-05-17',
      amount: '$950',
      status: 'Cancelled'
    },
    {
      id: '84564123',
      customer: 'Sarah Wilson',
      product: 'Headphones',
      date: '2023-05-18',
      amount: '$200',
      status: 'Delivered'
    },
    {
      id: '84564789',
      customer: 'David Lee',
      product: 'Tablet',
      date: '2023-05-19',
      amount: '$650',
      status: 'Processing'
    }
  ];

  // Orders table columns
  orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'date', label: 'Order Date' },
    { key: 'amount', label: 'Amount', class: 'text-end' },
    { key: 'status', label: 'Status' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = null;

    // Simulate API call
    setTimeout(() => {
      try {
        this.users = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Administrator',
            status: 'Active',
            joinDate: '2023-01-15'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Editor',
            status: 'Active',
            joinDate: '2023-02-20'
          },
          {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            role: 'Viewer',
            status: 'Inactive',
            joinDate: '2023-03-10'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            role: 'Editor',
            status: 'Pending',
            joinDate: '2023-04-05'
          },
          {
            id: 5,
            name: 'Michael Wilson',
            email: 'michael.wilson@example.com',
            role: 'Administrator',
            status: 'Active',
            joinDate: '2023-05-12'
          }
        ];
        this.loading = false;
      } catch (error) {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    }, 1000);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-light-success text-success';
      case 'inactive':
        return 'bg-light-danger text-danger';
      case 'pending':
        return 'bg-light-warning text-warning';
      case 'delivered':
        return 'bg-light-success text-success';
      case 'processing':
        return 'bg-light-info text-info';
      case 'cancelled':
        return 'bg-light-danger text-danger';
      case 'in stock':
        return 'bg-light-success text-success';
      case 'low stock':
        return 'bg-light-warning text-warning';
      case 'out of stock':
        return 'bg-light-danger text-danger';
      default:
        return 'bg-light-secondary text-secondary';
    }
  }

  reloadData(): void {
    this.loadUsers();
  }

  deleteUser(user: User): void {
    // Simulate delete operation
    this.users = this.users.filter(u => u.id !== user.id);
  }
}