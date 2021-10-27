import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { HttpRequestService } from '../services/http-request.service';
import { ServicosService } from '../services/servicos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: string = "";
  senha: string = "";

  constructor(
    private http: HttpRequestService,
    private navCtrl: NavController,
    private toast: ToastController,
    private servicos: ServicosService
  ) { }

  ngOnInit() {
  }

  async logar(){

    if(this.usuario.trim().length > 5 && this.senha.trim().length > 5){
      let body = {
        userID: this.usuario,
        accessKey: this.senha,
        grantType: "password"
      }

      try {
        await this.servicos.aguardar();
        const res: any = await this.http.login(body);
        this.servicos.loadingDismiss();
        if(res.status){
          this.presentToast("Ocorreu um problema, verifique seu usuário/senha.");
        }else{
          localStorage['token'] = res.accessToken;
          localStorage['nome'] = res.name;
          this.navCtrl.navigateRoot("/home");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      this.presentToast("Preencha corretamente o usuário/senha.");
    }
  }

  async presentToast(message:string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

}
