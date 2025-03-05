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
<<<<<<< HEAD
  FolderOutline,
  CrownOutline
=======
  FolderOutline
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
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

  // Navigation highlight properties
  highlightX = 0;
  highlightY = 0;
  mouseX = 0;
  mouseY = 0;
  isAnimating = false;

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
<<<<<<< HEAD
        FolderOutline,
        CrownOutline
=======
        FolderOutline
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
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
    
    // Initialize highlight position
    this.initializeHighlightPosition();
    
    // Start animation frame for smoother transitions
    this.animateHighlight();
  }
  
  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    this.isAnimating = false;
  }
  
  // Set highlight position
  updateGlowPosition(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }
  
  // Initialize highlight based on active navigation item
  initializeHighlightPosition() {
    // Find active menu item
    setTimeout(() => {
      const activeItem = document.querySelector('.coded-inner-navbar li.active a') as HTMLElement;
      if (activeItem) {
        const rect = activeItem.getBoundingClientRect();
        const parentRect = (document.querySelector('.navbar-content') as HTMLElement).getBoundingClientRect();
        this.highlightX = rect.left + rect.width / 2 - parentRect.left;
        this.highlightY = rect.top + rect.height / 2 - parentRect.top;
      }
    }, 500);
  }
  
  // Smooth animation for highlight effect
  animateHighlight() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const animate = () => {
      if (!this.isAnimating) return;
      
      // Smooth transition for highlight
      this.highlightX += (this.mouseX - this.highlightX) * 0.1;
      this.highlightY += (this.mouseY - this.highlightY) * 0.1;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Update highlight position when hovering over navigation items
  updateHighlightPosition(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Check if hovering over nav item or its child
    const navItem = target.closest('a');
    if (navItem) {
      const rect = navItem.getBoundingClientRect();
      const parentRect = (document.querySelector('.navbar-content') as HTMLElement).getBoundingClientRect();
      
      this.mouseX = rect.left + rect.width / 2 - parentRect.left;
      this.mouseY = rect.top + rect.height / 2 - parentRect.top;
    }
  }

  // Listen for window resize to adjust highlight
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
    this.initializeHighlightPosition();
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
    
    // Update highlight position when menu item is clicked
    this.initializeHighlightPosition();
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }
}
