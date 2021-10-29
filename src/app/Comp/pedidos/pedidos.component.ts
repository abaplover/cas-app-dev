import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
