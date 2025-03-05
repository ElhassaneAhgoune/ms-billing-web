import { CommonModule } from '@angular/common';
import { Component, inject, input, output, OnInit, HostListener } from '@angular/core';

// icons import
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { MenuUnfoldOutline, MenuFoldOutline, SearchOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-nav-left',
  imports: [IconDirective, CommonModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {
  private iconService = inject(IconService);
  
  // public props
  navCollapsed = input.required<boolean>();
  NavCollapse = output();
  NavCollapsedMob = output();
  
  windowWidth: number;
  
  // Constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(...[MenuUnfoldOutline, MenuFoldOutline, SearchOutline]);
  }
  
  ngOnInit() {
    // Initialize based on screen size
    this.checkScreenSize();
  }
  
  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.checkScreenSize();
  }
  
  // Check screen size and adjust nav accordingly
  private checkScreenSize() {
    // You could emit an event to the parent if needed
  }
  
  // Public method to collapse sidebar
  navCollapse() {
    this.NavCollapse.emit();
  }
}