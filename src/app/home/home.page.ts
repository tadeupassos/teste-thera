import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpRequestService } from '../services/http-request.service';
import { ServicosService } from '../services/servicos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nomeLogado: string = "";
  diaCorrente: any;
  horaCorrente: any;
  tempo: any;

  botaoSel: number;

  horariosMarcados = [];

  constructor(
    private http: HttpRequestService,
    private navCtrl: NavController,
    private servicos:  ServicosService
  ) {
    this.setaHoraCorrente();
    this.nomeLogado = localStorage['nome'];
    this.nomeLogado = this.nomeLogado.split(" ")[0];
    this.carregarHorarios();
  }

  setaHoraCorrente(){
    setInterval(() => {
      let hora = new Date();
      this.diaCorrente = hora.toLocaleDateString();
      this.horaCorrente = [hora.getHours(),hora.getMinutes(),hora.getSeconds()].join(":")
    }, 1000)
  }

  inserirHorario(btn: number){
    this.botaoSel = btn;
    let marcarHorario = new Date().toLocaleString();

    if(btn == 0){
      let h = { data: marcarHorario.split(" ")[0], inicio: marcarHorario.split(" ")[1], almocoIni: "", almocoFim: "", fim: "", tempo: "" };
      this.horariosMarcados.unshift(h)
    }else{
      let h = this.horariosMarcados[0];
      if(btn == 1) {
        h.almocoIni = marcarHorario.split(" ")[1];
      }else if(btn == 2){
        h.almocoFim = marcarHorario.split(" ")[1];
      }else if (btn == 3){
        h.fim = marcarHorario.split(" ")[1];

        this.gravarHorario(h);
      }
    }
  }

  async gravarHorario(h:any){

    let [dia,mes,ano] = h.data.split("/");

    let start = [ano,mes,dia].join("-") + "T" + h.inicio + ".000Z";
    let startLunch = [ano,mes,dia].join("-") + "T" + h.almocoIni + ".000Z";
    let endLunch = [ano,mes,dia].join("-") + "T" + h.almocoFim + ".000Z";
    let end = [ano,mes,dia].join("-") + "T" + h.fim + ".000Z";

    let body = { id: 0, start, startLunch, endLunch, end }

    this.servicos.aguardar();
    const res: any = await this.http.postTimesheet(body);
    this.servicos.loadingDismiss();
    this.carregarHorarios()

  }

  tempoFinal(inicio, fim, data){
    let [dia,mes,ano] = data.split("/");
    let [hora,min,sec] = inicio.split(":");
    let dtInicio = new Date(ano,mes,dia,hora,min,sec,0);
    [hora,min,sec] = fim.split(":");
    let dtFim = new Date(ano,mes,dia,hora,min,sec,0);
    return this.entreHoras(dtInicio,dtFim);
  }

  async carregarHorarios(){
    try {
      this.horariosMarcados = [];
      await this.servicos.aguardar();
      const res: any = await this.http.getTimesheet();
      this.servicos.loadingDismiss();
      if(res.items.length > 1){
        this.preparaHorarios(res.items);
      }
    } catch (error) {
      console.log(error);
    }
  }

  preparaHorarios(items: any[]){

    for (const i of items) {

      let h = { data: "", inicio: "", almocoIni: "", almocoFim: "", fim: "", tempo: "" };

      let dia;
      let mes;
      let ano;

      if(i.start){
        [ano,mes,dia] = i.start.split("T")[0].split("-");
        h.data = [dia,mes,ano].join("/");
        h.inicio = i.start.split("T")[1].substr(0,8);
      }

      if(i.startLunch){
        h.almocoIni = i.startLunch.split("T")[1].substr(0,8);
      }

      if(i.endLunch){
        h.almocoFim = i.endLunch.split("T")[1].substr(0,8);
      }

      if(i.end){
        h.fim = i.end.split("T")[1].substr(0,8);
      }

      if(i.start && i.end){
        h.tempo = this.entreHoras(i.start,i.end);
      }

      this.horariosMarcados.push(h);
    }
  }

  entreHoras(strat, end){
    let inicio = new Date(strat);
    let fim = new Date(end);
    let tempo = Math.abs(inicio.getTime() - fim.getTime());
    let diffHrs = Math.floor((tempo % 86400000) / 3600000);
    let diffMins = Math.round(((tempo % 86400000) % 3600000) / 60000);
    let horas = diffHrs.toString().length == 1 ? "0" + diffHrs : diffHrs;
    let minutos = diffMins.toString().length == 1 ? "0" + diffMins : diffMins;
    let diff = horas  + ':' + minutos;
    return diff;
  }

  sair(){
    localStorage.clear();
    this.navCtrl.navigateRoot("/login");
  }

}
