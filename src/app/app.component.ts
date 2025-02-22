import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

interface NavigationTab {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ferie-manager';
  hasEmployee = false;

  navigationTabs: NavigationTab[] = [
    {
      label: 'Stato Ferie',
      route: '/dashboard',
      icon: 'fa-chart-bar'
    },
    {
      label: 'Nuova Richiesta',
      route: '/request',
      icon: 'fa-calendar-plus'
    },
    {
      label: 'Configurazione',
      route: '/config',
      icon: 'fa-cog'
    }
  ];
}