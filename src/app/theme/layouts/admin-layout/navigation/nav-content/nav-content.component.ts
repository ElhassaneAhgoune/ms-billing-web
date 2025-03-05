// Angular import
import { Component, OnInit, inject, output, HostListener } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';

import { NavGroupComponent } from './nav-group/nav-group.component';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline,
  FileOutline,
  FileSearchOutline,
  UploadOutline,
  FileTextOutline,
  LineChartOutline,
  PieChartOutline,
  FileExcelOutline,
  FolderOutline,
  CrownOutline,
  TableOutline

} from '@ant-design/icons-angular/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-content',
  imports: [CommonModule, RouterModule, NavGroupComponent, NgScrollbarModule],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private iconService = inject(IconService);

  // public props
  NavCollapsedMob = output();

  navigations: NavigationItem[];

  // version
  title = 'MS Billing Application';
  currentApplicationVersion = environment.appVersion;

  // Online status
  isOnline = navigator.onLine;

  navigation = NavigationItems;
  windowWidth = window.innerWidth;

  // Constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        ChromeOutline,
        QuestionOutline,
        FileOutline,
        FileSearchOutline,
        UploadOutline,
        FileTextOutline,
        LineChartOutline,
        PieChartOutline,
        FileExcelOutline,
        FolderOutline,
        CrownOutline,
        TableOutline
      ]
    );
    this.navigations = NavigationItems;
    
    // Online/offline event listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Life cycle events
  ngOnInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement)?.classList.add('menupos-static');
    }
  }
  
  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Listen for window resize
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }
  
  // Handle click events
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // Don't handle clicks that will be handled by child components
    if ((event.target as HTMLElement).closest('app-nav-item, app-nav-collapse')) {
      return;
    }
    
    const target = event.target as HTMLElement;
    const navItem = target.closest('a');
    
    if (navItem) {
      // Use requestAnimationFrame to ensure DOM operations are batched
      requestAnimationFrame(() => {
        // Add active class directly to ensure visual feedback
        const listItem = navItem.closest('li');
        if (listItem) {
          // Remove active class from all items first
          document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
          });
          
          // Add active class to clicked item
          listItem.classList.add('active');
        }
      });
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }
}
