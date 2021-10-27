import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  loading: any;

  constructor(
    private loadingController: LoadingController
  ) { }

  async aguardar() {
    this.loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
      backdropDismiss: false
    });
    await this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
  }
}
