import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, PickerController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { ApiService } from '../providers/api.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-modifica-avatar',
  templateUrl: './modifica-avatar.page.html',
  styleUrls: ['./modifica-avatar.page.scss'],
})

export class ModificaAvatarPage implements OnInit {
    constructor(
      private service: ApiService,
      public navCtrl: NavController,
      private pickerController: PickerController,
      public alertController: AlertController,
      private router: Router,
      private dataService: DataService,
      private storage: Storage
    ) {}
  
    colorFullfilled: string[] = [
      "https://drive.google.com/uc?export=view&id=1ZD-1DVtsR-8RAb1TgLW7G9Wj2lMVXC58",
      "https://drive.google.com/uc?export=view&id=13-i6kq5sqX_Ry4KZIK54qBH3lToIZrO4",
      "https://drive.google.com/uc?export=view&id=1EIUym1roTs4jzWhQrzCnGjSjogl1KvWg",
      "https://drive.google.com/uc?export=view&id=1mdKmwxPLHiEPiRIy2QEyobZomXT_m8Ma",
      "https://drive.google.com/uc?export=view&id=13linAdkvGkr3lnbfix-UwWfFCxRgQZU-",
      "https://drive.google.com/uc?export=view&id=1d29GDDUZHwRFM7XlNLw4jDQ6rAVyh0RR",
      "https://drive.google.com/uc?export=view&id=1xDxRAzZ1SD22tAiqPPnnNFFDdwEppgVM",
      "https://drive.google.com/uc?export=view&id=1Yyy3cD5EewcK5uQ_hndCcUo_E-ms7Se1",
      "https://drive.google.com/uc?export=view&id=1ysycCESmeRWDpVz5ip2r0dLnh6nB4EUq",
      "https://drive.google.com/uc?export=view&id=1rzgauoxl4HtKoR_C63hBM9QkXUwuqKKB",
      "https://drive.google.com/uc?export=view&id=1rxP7v05e8I0J1WqDEigAvfhfEIg7sdzu",
      "https://drive.google.com/uc?export=view&id=1O4ZPpoBxBQYNbhOJVaO_AJtDVz_RKw81",
      "https://drive.google.com/uc?export=view&id=1n-CfTeBRzP0RE84ifdblh_4tVOFb7ASx",
      "https://drive.google.com/uc?export=view&id=1WpuajNQd_Xho-yU2VBzR2IjRJ7hTCwcU",
      "https://drive.google.com/uc?export=view&id=1fn3WuH8oRQIwCwwG_l8nqMJ2O-yuBBaZ",
      "https://drive.google.com/uc?export=view&id=1EoKQYhfnDX6xPCvFivnQCrOj6eEuXER9",
      "https://drive.google.com/uc?export=view&id=188044AoUqgfwA7J_OyI1e9PEr0oHT6Ge",
      "https://drive.google.com/uc?export=view&id=1O2XpTvwIyj8fXj0xOGyUFtFC1oSPhb9C",
      "https://drive.google.com/uc?export=view&id=1Ciyz7GP0P7GX5XiuFF3ic8z_3qG7PaLz",
      "https://drive.google.com/uc?export=view&id=1VbrukfFivjp_88cIumqVdOT6fq7SKRB6",
      "https://drive.google.com/uc?export=view&id=1uqqqCzChX6z9DC7zKS9T4UxDoxg43_Ih",
      "https://drive.google.com/uc?export=view&id=11JkirRe4AqVkqVRwztlxEMvg7G6MfypY",
      "https://drive.google.com/uc?export=view&id=1yT0Ai-3_8kHfjwwecSi_jJ8pdtP5Q2Zl",
      "https://drive.google.com/uc?export=view&id=1n-mabCr6mJFHOJMZ59uLAkaKJH5faJBq",
      "https://drive.google.com/uc?export=view&id=1x6IEWf-M3muSFG_AMfvNVpTIa0wn4Wte",
      "https://drive.google.com/uc?export=view&id=11ULaaCyHCCkxW2ceEDTSFHkt6JsNB0xm",
      "https://drive.google.com/uc?export=view&id=1DSGRTKGL1f3_cZNvjQDfe-OlEB4UY_Ma",
      "https://drive.google.com/uc?export=view&id=11gMx_CM4dF1m7WtbxNz2x8Vp4uFofCeY",
      "https://drive.google.com/uc?export=view&id=1wWku_j8CLztWFTdXamoKHOSTc1CXD50A",
      "https://drive.google.com/uc?export=view&id=1X4LTw6PHnJuNpO04nz7uuVLhib95_rIx",
      "https://drive.google.com/uc?export=view&id=1kTsuivRdiw85NFYdnK-ys9-Vj3rYUo0U",
      "https://drive.google.com/uc?export=view&id=1_yqrO94W4CgmrgrGynBIkdeSJEDcD1_q",
      "https://drive.google.com/uc?export=view&id=1Utru6l6o4MrypLH6EuuGwBuWzPhSh_72",
      "https://drive.google.com/uc?export=view&id=1L55PcXxSUkf3TQ2olud3FmVDuFC-1Frl",
    ];
  
    linesFilled: string[] = [
      "https://drive.google.com/uc?export=view&id=127UyyM2iiOlz_KxgMI6GPmdbQiPvHMld",
      "https://drive.google.com/uc?export=view&id=1l2mTdPlj32T7jXL83R1EyWd4zgJMCjb_",
      "https://drive.google.com/uc?export=view&id=1TrzsZfHth3dANQ5x7B4JVxpSCyjxsgkB",
      "https://drive.google.com/uc?export=view&id=1u0sTc3IW7J8oRu6g_gUhrtXnPvnp2nE9",
      "https://drive.google.com/uc?export=view&id=1_bt4ZiTkFceNa3AIApzkRRPDAJYPZF4T",
      "https://drive.google.com/uc?export=view&id=1R7VYI-d6rpPfzHh4RvhaQFYonULE_rDW",
      "https://drive.google.com/uc?export=view&id=1Eja6ybZe3g3racVictruoP_SwlMb-NZW",
      "https://drive.google.com/uc?export=view&id=1ucq1FsVXKyLZeJy-u8cqCjaAfki07eBX",
      "https://drive.google.com/uc?export=view&id=1L18tyrOGVMnYPoUDWR9zONQYtpq5EGh0",
      "https://drive.google.com/uc?export=view&id=1FUDGp2xARnvZDtyZ0Xt_esyHOfQVHJQY",
      "https://drive.google.com/uc?export=view&id=1NbuGAU1dDos9DDNqMWlo9ys3neExG8Bn",
      "https://drive.google.com/uc?export=view&id=1IcbGnPhmNs3_hNUMykp28dabqWUeW4L5",
      "https://drive.google.com/uc?export=view&id=1M7aJ8C6m0G3OjSYyihfgo8tWgHxvIMAB",
      "https://drive.google.com/uc?export=view&id=1017epqRUfp4hjuNkNdFD7lRgNoAP8MxF",
      "https://drive.google.com/uc?export=view&id=10Uu6P86gYMAX-epxLUTD5AqRrgNh71sk",
      "https://drive.google.com/uc?export=view&id=1kTCLt9VXs6QmVkyKGCOMLPkOpLWNyTGp",
      "https://drive.google.com/uc?export=view&id=1xTONr8C1clCs-fcqbOFtTM5OXUHmQdzb",
      "https://drive.google.com/uc?export=view&id=13HnOq3kXq8Ekd9YC8ZpsR1AA07Zb0jbs",
      "https://drive.google.com/uc?export=view&id=14YKguR4ArX40sRBKxpf46S7o7iwzjB9C",
      "https://drive.google.com/uc?export=view&id=1vb3TfHpR5XvcKjSSiwRHSfZ4p9a-Foob",
      "https://drive.google.com/uc?export=view&id=1jRg9McPyMPV9bTDCBrVPHoDNWsotwZrU",
    ];
  
    elementID: string;
    avatar: string;
  
    ngOnInit() {
    }
    ionViewDidEnter() {
    }
  
    annulla() {
      this.toastUnsuccess("Avatar non scelto");
      this.navCtrl.back();
    }
  
    avatarScelto() {
      if (this.avatar === "" || this.avatar === undefined) {
        this.toastUnsuccess("Non hai selezionato alcun avatar!");
      } else {
        this.dataService.settaTemporaryAvatar(this.avatar);
        this.navCtrl.back();
        this.toastSuccess();
      }
    }
  
    toastSuccess() {
      const toast = document.createElement("ion-toast");
      toast.message = "Avatar scelto!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "success";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
      return toast.present();
    }
  
    toastUnsuccess(txt: string) {
      const toast = document.createElement("ion-toast");
      toast.message = txt;
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
      return toast.present();
    }
  
    stampaUrl(Url, tipo, index) {
      //Controllo i valori
      console.log(Url, index);
      this.avatar = Url;
      if (this.elementID !== undefined) {
        //Rimuovo lo stile se applicato ad un altro ion avatar
        let old = document.getElementById(this.elementID);
        old.style.backgroundColor = "";
      }
      if (tipo === "colored") {
        if (this.elementID !== "coloredAvatar" + index) {
          this.elementID = "coloredAvatar" + index;
          //Prendo la classe relativa all'avata cliccato
          let elem = document.getElementById(this.elementID);
          //Styling dell'elemento selezionato
          elem.style.backgroundColor = "#ffffff";
        } else {
          this.elementID = undefined;
          this.avatar = "";
        }
      } else {
        if (this.elementID !== "linedAvatar" + index) {
          this.elementID = "linedAvatar" + index;
          //Prendo la classe relativa all'avata cliccato
          let elem = document.getElementById(this.elementID);
          //Styling dell'elemento selezionato
          elem.style.backgroundColor = "#ffffff";
        } else {
          this.elementID = undefined;
          this.avatar = "";
        }
      }
    }
  }
  