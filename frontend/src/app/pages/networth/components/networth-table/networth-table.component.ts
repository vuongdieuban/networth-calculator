import { Component, OnInit } from '@angular/core';
import { CurrencyType } from '../../dtos/networth-data.interface';

@Component({
  selector: 'app-networth-table',
  templateUrl: './networth-table.component.html',
  styleUrls: ['./networth-table.component.scss'],
})
export class NetworthTableComponent implements OnInit {
  // should fetch currencies from backend, remove currency type enum.
  currencies = Object.values(CurrencyType) as string[];
  ngOnInit() {}
}
