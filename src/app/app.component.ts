import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Player } from './model/player';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessService } from './service/business.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  
  constructor(
    //private storageService: LocalStorageService, 
    public businessService: BusinessService
    ){
    //effect(() => {});
  }
   
  app_dataToDisplay: Player[]=new Array<Player>();
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  app_player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false };  
  currentItem = 'Television';
  app_dataSource = new MatTableDataSource(this.app_dataToDisplay);

  addData(){
    
    let count=1;
    let idplayer=0;
    let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    this.app_dataToDisplay=new Array<Player>();
    //this.app_dataToDisplay = this.storageService.get("dataPlayer");
    //if (this.app_dataToDisplay.length === 0) {
    //  this.app_dataToDisplay=new Array<Player>();
    //}
    //while(idplayer==0){
    //  idplayer=count;
    //  this.app_dataToDisplay.forEach((value,index)=>{
    //    if(value.idplayer==count){
    //      idplayer=0;
    //    }
    //  });
    //  count++;
    //}
    //this.app_dataToDisplay.forEach((value,index)=>{
    //  if(value.name==name){
    //    name=name+idplayer;
    //  }
    //});
    
    this.app_player.idplayer=idplayer;
    this.app_player.name=name;
    this.app_player.amount=Number(this.amount.value);
    this.app_player.free=Boolean(this.free.value);
    this.businessService.addData(this.app_player);

    //this.app_dataToDisplay = [...this.app_dataToDisplay, this.app_player];
    //this.app_dataSource.data = this.app_dataToDisplay;
    //this.storageService.set("dataPLayer",this.app_dataToDisplay);
  }
  
  //clearTable(){}
  //updateCurrentBalance(){}
  //simulation(){}
}