import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item } from 'osrs-tools';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


  // public _rangerBoots: Item;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // this._rangerBoots = RangerBoots
    const i= 2;

  }

}
