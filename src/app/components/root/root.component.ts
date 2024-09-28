import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HeaderComponent, FooterComponent],
  templateUrl: './root.component.html',
  styles: ``,
})
export class RootComponent {}
