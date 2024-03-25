import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Player } from './model/player';
import { BusinessService } from './service/business.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  
  constructor(
    public businessService: BusinessService
    ){}
  
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  app_player: Player = new Player();
  
  btnAddData(){
    let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    this.app_player=new Player();
    this.app_player.name=name;
    this.app_player.amount=Number(this.amount.value);
    this.app_player.free=Boolean(this.free.value);
    this.businessService.addData(this.app_player);
    this.btnClearFields();
  }

  btnRemoveItem() {
    this.businessService.removeItem()
  }

  btnRemoveData() {
    this.businessService.removeData();
  }

  btnUpdateBalance() {
    this.businessService.updateBalance();
  }

  btnUpdatePositiveBalance() {
    this.businessService.balance_dataToDisplay.set(this.businessService.updatePositiveBalance(this.businessService.balance_dataToDisplay()));
  }

  btnRestartCurrentBalance() {
    this.businessService.restartCurrentBalance()
  }

  btnUpdateRefund() {
    this.businessService.updateRefund()
  }  

  btnClearFields(){
    this.name.setValue("");
    this.amount.setValue(0);
    this.free.setValue("");
  }
}