import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-marca-horario',
  templateUrl: './marca-horario.component.html',
  styleUrls: ['./marca-horario.component.scss'],
})
export class MarcaHorarioComponent implements OnInit {

  @Input() horario: any;

  constructor() { }

  ngOnInit() {
  }

}
