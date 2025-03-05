// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';

import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Total Page Views',
      amount: '4,42,236',
      background: 'bg-primary',
      border: 'border-primary',
      icon: 'chart-bar',
      percentage: '59.3%',
      color: 'text-primary',
      number: '35,000'
    },
    {
      title: 'Total Users',
      amount: '78,250',
      background: 'bg-success',
      border: 'border-success',
      icon: 'users',
      percentage: '70.5%',
      color: 'text-success',
      number: '8,900'
    },
    {
      title: 'Total Order',
      amount: '18,800',
      background: 'bg-warning',
      border: 'border-warning',
      icon: 'shopping-cart',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Total Sales',
      amount: '$35,078',
      background: 'bg-info',
      border: 'border-info',
      icon: 'credit-card',
      percentage: '27.4%',
      color: 'text-info',
      number: '$20,395'
    }
  ];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'settings',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
