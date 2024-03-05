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
    public businessService: BusinessService
    ){}
   
  app_dataToDisplay: Player[]=new Array<Player>();
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  app_player: Player = new Player();
  app_dataSource = new MatTableDataSource(this.app_dataToDisplay);

  addData(){
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
    this.clearFields();
  }

  clearFields(){
    this.name.setValue("");
    this.amount.setValue(0);
    this.free.setValue("");
  }
}