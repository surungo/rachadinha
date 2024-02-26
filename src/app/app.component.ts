import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from './local-storage.service';
import { Player } from './model/player';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  
  constructor(private storageService: LocalStorageService){}
  dataToDisplay: Player[]=new Array<Player>();
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false };  

  addData(){
    let count=1;
    let idplayer=0;
    let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    this.dataToDisplay=new Array<Player>();
    this.dataToDisplay = this.storageService.get("dataPlayer");
    if (this.dataToDisplay.length === 0) {
      this.dataToDisplay=new Array<Player>();
    }
    while(idplayer==0){
      idplayer=count;
      this.dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==count){
          idplayer=0;
        }
      });
      count++;
    }
    this.dataToDisplay.forEach((value,index)=>{
      if(value.name==name){
        name=name+idplayer;
      }
    });
    let pplayer: Player = Object.create(this.player);
    pplayer.idplayer=idplayer;
    pplayer.name=name;
    pplayer.amount=Number(this.amount.value);
    pplayer.free=Boolean(this.free.value);
    this.dataToDisplay = [...this.dataToDisplay, pplayer];
    this.storageService.set("dataPLayer",this.dataToDisplay);
  }
  //clearFields(){}
  removeData(){
    this.storageService.clear();
  }
  //clearTable(){}
  //updateCurrentBalance(){}
  //simulation(){}
}