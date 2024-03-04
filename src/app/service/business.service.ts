import { Injectable, signal } from "@angular/core";
import { Player } from "../model/player";
import { MatTableDataSource } from "@angular/material/table";


@Injectable({
    providedIn: 'root',
})


export class BusinessService{
    PLAYER_DATA: Player[] = [
        {idplayer: 1,  name: 'Hydrogen',  amount: 500.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00, free: true},
        {idplayer: 2,  name: 'Helium',    amount: 700.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        {idplayer: 3,  name: 'Lithium',   amount: 300.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        {idplayer: 4,  name: 'Beryllium', amount: 100.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        {idplayer: 5,  name: 'Boron',     amount:   0.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        //{idplayer: 6,  name: 'Carbon',    amount: 12.07, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        //{idplayer: 7,  name: 'Nitrogen',  amount: 14.67, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        //{idplayer: 8,  name: 'Oxygen',    amount: 15.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        //{idplayer: 9,  name: 'Fluorine',  amount: 18.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
        //{idplayer: 10, name: 'Neon',      amount: 20.17, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      ];
      
    
    app_player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false };
    public player = signal<Player>(this.app_player); 
    
    public balance_dataToDisplay = signal<Player[]>([...this.PLAYER_DATA]);
    public balance_dataSource = signal(new MatTableDataSource(this.balance_dataToDisplay()));
    
    constructor(){}

    /**public updateDataBase(value: string){
        this.dataBase.set(value);
    }*/

   

    addData(value: Player){
        let count=1;
        let idplayer=0;
        this.player.set(value);

        this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), this.player()]);
        this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
        
        
  /*  let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    this.app_dataToDisplay=new Array<Player>();
    this.app_dataToDisplay = this.storageService.get("dataPlayer");
    if (this.app_dataToDisplay.length === 0) {
      this.app_dataToDisplay=new Array<Player>();
    }
    while(idplayer==0){
      idplayer=count;
      this.app_dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==count){
          idplayer=0;
        }
      });
      count++;
    }
    this.app_dataToDisplay.forEach((value,index)=>{
      if(value.name==name){
        name=name+idplayer;
      }
    });
    
    this.app_player.idplayer=idplayer;
    this.app_player.name=name;
    this.app_player.amount=Number(this.amount.value);
    this.app_player.free=Boolean(this.free.value);
    this.app_dataToDisplay = [...this.app_dataToDisplay, this.app_player];
    this.app_dataSource.data = this.app_dataToDisplay;
    this.storageService.set("dataPLayer",this.app_dataToDisplay);*/
  }
  //clearFields(){}
  removeData(){
    //this.storageService.clear();
  }
}