import { Injectable, signal } from "@angular/core";
import { Player } from "../model/player";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "../local-storage.service";
import { SelectionModel } from "@angular/cdk/collections";


@Injectable({
    providedIn: 'root',
})


export class BusinessService{
  PLAYER_DATA: Player[] = [
      //{idplayer: 1,  name: 'Hydrogen',  amount: 500.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00, free: true},
      //{idplayer: 2,  name: 'Helium',    amount: 700.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 3,  name: 'Lithium',   amount: 300.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 4,  name: 'Beryllium', amount: 100.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 5,  name: 'Boron',     amount:   0.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 6,  name: 'Carbon',    amount: 12.07, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 7,  name: 'Nitrogen',  amount: 14.67, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 8,  name: 'Oxygen',    amount: 15.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 9,  name: 'Fluorine',  amount: 18.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
      //{idplayer: 10, name: 'Neon',      amount: 20.17, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false},
    ];
    
  nmDataPlayer: string = "dataPlayer";
  app_player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false };
  public player = signal<Player>(this.app_player); 
  public balance_dataToDisplay = signal<Player[]>([...this.PLAYER_DATA]);
  public balance_dataSource = signal(new MatTableDataSource(this.balance_dataToDisplay()));
  public balance_total = signal(0);
  public totalAmount = signal(0);
  public totalNoFree = signal(0);
  public totalForPerson = signal(0); 
  public totalBalance = signal(0);
  public selection = signal(new SelectionModel<Player>(true, []));

  constructor(private storageService: LocalStorageService, ){
    this.loadData();
  }

  loadData(){
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataPlayer));
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
    this.updateBalance();
  }    

  addData(value: Player){
    let count=1;
    let idplayer=0;
    this.player.set(value);
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataPlayer));
    if(this.storageService.get(this.nmDataPlayer).length!=0){
        while(idplayer==0){
        idplayer=count;
        this.balance_dataToDisplay().forEach((value,index)=>{
          if(value.idplayer==count){
            idplayer=0;
          }
        });
        count++;
      }
      this.player().idplayer=idplayer;
    }else{
      this.player().idplayer=1;
    }
    this.balance_dataToDisplay().forEach((value,index)=>{
      if(value.name==this.player().name){
        this.player().name=this.player().name+idplayer;
      }
    });
    
    this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), this.player()]);
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
    this.storageService.set(this.nmDataPlayer,this.balance_dataToDisplay());
    this.updateBalance();
  }
  
  removeData(){
    this.storageService.clear();
    this.loadData();
  }

  removeItem() {
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataPlayer));
    this.selection().selected.forEach((svalue,sindex)=>{
      this.balance_dataToDisplay().forEach((value,index)=>{
        if(value.idplayer==svalue.idplayer) this.balance_dataToDisplay().splice(index,1);
      });
    });
    //this.balance_dataToDisplay = this.balance_dataToDisplay.slice(0, -1);
    this.balance_dataSource().data=this.balance_dataToDisplay();
    this.selection().clear();
    this.storageService.set(this.nmDataPlayer,this.balance_dataToDisplay());
    
  }



  getTotal() {
    this.balance_total.set(this.storageService.get(this.nmDataPlayer).length)
  }

  getTotalAmount() {
    this.totalAmount.set(this.balance_dataToDisplay().map(t => t.amount).reduce((acc, value) => acc + value, 0));
  }

  getTotalNoFree() {
    this.totalNoFree.set(this.balance_dataToDisplay().map(t => t.free).reduce((acc, value) => (!value)?acc + 1:acc, 0));
  }

  getTotalForPerson() {
    this.totalForPerson.set(Number(this.totalAmount())/Number(this.totalNoFree()));
  }

  updateTotals(){
    this.getTotal();
    this.getTotalAmount();
    this.getTotalNoFree();
    this.getTotalForPerson();
  }

  updateBalance() {
    this.updateTotals();
    this.balance_dataToDisplay().forEach((value,index)=>{
      if(value.free){
        value.balance=value.amount;
      }else{
        value.balance=value.amount-Number(this.totalForPerson());
      }
    });
    this.getTotalBalance();
  }

  getTotalBalance() {
    this.totalBalance.set(this.balance_dataToDisplay().map(t => t.balance).reduce((acc, value) => acc + value, 0));
  }

}