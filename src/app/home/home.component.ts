import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WikiItemImages } from '../constants/wiki-item-images.constant';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly WikiItemImages = WikiItemImages;
}
