import { Injectable, signal } from "@angular/core";
import { Player } from "../model/player";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "../local-storage.service";
import { SelectionModel } from "@angular/cdk/collections";
import { Refund } from "../model/refund";


@Injectable({
  providedIn: 'root',
})


export class BusinessService {
  PLAYER_DATA: Player[] = [
    { idplayer: 1, name: 'Hydrogen', amount: 500.00, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: true },
    { idplayer: 2, name: 'Helium', amount: 700.00, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false },
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
  public player = signal<Player>(new Player());
  public balance_dataToDisplay = signal<Player[]>([]);//...this.PLAYER_DATA]);  
  public balance_dataSource = signal(new MatTableDataSource(this.balance_dataToDisplay()));
  public balance_selection = signal(new SelectionModel<Player>(true, []));

  public balance_total = signal(0);
  public totalAmount = signal(0);
  public totalNoFree = signal(0);
  public totalForPerson = signal(0);
  public totalBalance = signal(0);

  clonedBalance:Player[]=[];
  recapBalance:Player[]=[];

  REFUND_DATA: Refund[] = [
    { 'idrefund': 0, 'payee': this.PLAYER_DATA[0], 'payer': this.PLAYER_DATA[1], 'amount': 0 }
  ];
  nmDataRefund: string = "dataRefund";
  public refund = signal<Refund>(new Refund());//this.REFUND_DATA[0]); 
  public refund_dataToDisplay = signal<Refund[]>([]);//...this.REFUND_DATA]);
  public refund_dataSource = signal(new MatTableDataSource(this.refund_dataToDisplay()));
  public refund_selection = signal(new SelectionModel<Refund>(true, []));
  
  constructor(private storageService: LocalStorageService,) {
    this.loadData();
  }

  loadData() {
    this.loadBalanceData();
    this.loadRefundData();
    this.updateBalance();
  }

  loadBalanceData() {
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataPlayer));
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
  }

  loadRefundData() {
    this.refund_dataToDisplay.set(this.storageService.get(this.nmDataRefund));
    this.refund_dataSource.set(new MatTableDataSource(this.refund_dataToDisplay()));
  }

  addData(value: Player) {
    let count = 1;
    let idplayer = 0;
    this.player.set(value);
    
    // load Storage
    this.loadBalanceData();
    this.loadRefundData();

    // select player id
    if (this.storageService.get(this.nmDataPlayer).length != 0) {
      while (idplayer == 0) {
        idplayer = count;
        this.balance_dataToDisplay().forEach((value, index) => {
          if (value.idplayer == count) {
            idplayer = 0;
          }
        });
        count++;
      }
      this.player().idplayer = idplayer;
    } else {
      this.player().idplayer = 1;
    }
    this.balance_dataToDisplay().forEach((value, index) => {
      if (value.name == this.player().name) {
        this.player().name = this.player().name + idplayer;
      }
    });

    // add new balance storage
    this.addBalance(this.player());
    this.updateBalance();
  /*
    if (this.storageService.get(this.nmDataPlayer).length > 1) {
      this.updateRefund();
    }
  */
    this.loadData();
  }

  updateRefund(){
    this.createRefund();    
  }

  createRefund() {
    this.clearRefund();
    this.loadRefundData();
    this.restartCurrentBalance();
    let refund = this.newRefund();
    // case 1
    debugger;
    let solver=1;
    let count=0;
    let player0 = this.getPlayerEmpty();
    this.clonedBalance = this.balance_dataToDisplay().slice();

    while(count<this.clonedBalance.length) {
      this.clonedBalance=this.updatePositiveBalance(this.clonedBalance);
      this.clonedBalance=this.sortBalance(this.clonedBalance);
      let player1 = this.getPlayerCadidate(player0, solver);
      if(player1.idplayer==0){
        continue;
      }
      if(player1.balance>0){
        refund.payee=player1;
      }
      if(player1.balance<0){
        refund.payer=player1;
      }

      let player2 = this.getPlayerCadidate(player1, solver);
      if(player2.idplayer==0){
        continue;
      }
      if(player2.balance>0){
        refund.payee=player2;
      }
      if(player2.balance<0){
        refund.payer=player2;
      }
      
      if(refund.payee.current_balance>=refund.payer.current_balance){
        refund.amount=this.convertToPositiveValue(refund.payer.current_balance);
      }else{

      }
      refund.payee.current_balance=refund.payee.balance-refund.amount;
      refund.payer.current_balance=refund.payer.balance+refund.amount;
      refund.payee.current_balance=refund.payee.current_balance<0.00?0:refund.payee.current_balance;
      refund.payer.current_balance=refund.payer.current_balance<0.00?0:refund.payer.current_balance;
      this.clonedBalance=this.updatePositiveBalance(this.clonedBalance);
      this.addRefund(refund);
      refund = this.newRefund();
      count++;
    }
  }
  getPlayerEmpty() {
    let player = new Player();
    player.idplayer=0;
    player.balance=0;
    player.current_balance=0;
    player.positive_balance=0;
    return player;
  }

  getPlayerCadidate(player: Player, solver: Number) {
    
    for(let player_loop of this.clonedBalance){
      let exists=false;
      
      // to be a candidate the id has to be different
      if(player.idplayer==player_loop.idplayer){
        exists=true;
        continue;
      }   

      // to be a candidate the current balance has to be oppositional
      if(player_loop.current_balance > 0 ) {
        if( player.current_balance > 0 ){
          exists=true;
          continue;
        }                   
      }else{
        if( player.current_balance < 0 ){
          exists=true;
          continue;
        } 
      }

      // to be a candidate the current balance has to exists
      if(player_loop.current_balance == 0){
        exists=true;
        continue;
      }
      
      for(let refund_loop of this.refund_dataToDisplay()){
        // to be a candidate, if they have same ID, they need have current balance
        if(refund_loop.payee.idplayer==player_loop.idplayer 
          && 
          (  refund_loop.payee.current_balance==0
          || refund_loop.payer.current_balance==0)){
            exists=true;
            continue;
        }
      }
      switch(solver){
        case 1:
          if(player.idplayer>0 && player_loop.positive_balance!=player.positive_balance){
            exists=true;
          }
          break;
      }
        
      if(!exists){
        this.recapBalance.push(player_loop);
        this.clonedBalance  = this.clonedBalance.filter((e, i) => e.idplayer !== player_loop.idplayer); 
        return player_loop;
      }
    }
    return this.getPlayerEmpty();

  }

  sortBalance(balance_dataToDisplay : Player[]) {
    balance_dataToDisplay.sort((a, b) => a.balance - b.balance); 
    balance_dataToDisplay.sort((a, b) => b.positive_balance - a.positive_balance); 
    return balance_dataToDisplay;
  }
  newRefund() {
    let count = 1;
    let idrefund = 0;
    let refund = new Refund();
    if (this.storageService.get(this.nmDataRefund).length != 0) {
      while (idrefund == 0) {
        idrefund = count;
        this.refund_dataToDisplay().forEach((value, index) => {
          if (value.idrefund == count) {
            idrefund = 0;
          }
        });
        count++;
      }
      refund.idrefund = idrefund;
    } else {
      refund.idrefund = 1;
    };
    return refund;
  }

  addBalance(player: Player) {
    this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), player]);
    this.saveBalance();
  }

  saveBalance() {
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
    this.storageService.set(this.nmDataPlayer, this.balance_dataToDisplay());
  }

  addRefund(refund: Refund) {
    if (refund.idrefund > 0) {
      this.refund_dataToDisplay.set([...this.refund_dataToDisplay(), refund]);
      this.saveRefund();
    }
  }

  saveRefund() {
    this.refund_dataSource.set(new MatTableDataSource(this.refund_dataToDisplay()));
    this.storageService.set(this.nmDataRefund, this.refund_dataToDisplay());
  }

  clearRefund() {
    this.refund_dataToDisplay.set(<Refund[]>([]));
    this.refund_dataSource.set(new MatTableDataSource(this.refund_dataToDisplay()));
    this.storageService.set(this.nmDataRefund, this.refund_dataToDisplay());
  }

  removeData() {
    this.storageService.clear();
    this.loadData();
  }

  removeItem() {
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataPlayer));
    this.balance_selection().selected.forEach((svalue, sindex) => {
      this.balance_dataToDisplay().forEach((value, index) => {
        if (value.idplayer == svalue.idplayer) this.balance_dataToDisplay().splice(index, 1);
      });
    });
    //this.balance_dataToDisplay = this.balance_dataToDisplay.slice(0, -1);
    this.balance_dataSource().data = this.balance_dataToDisplay();
    this.balance_selection().clear();
    this.storageService.set(this.nmDataPlayer, this.balance_dataToDisplay());
    this.loadData();

  }

  getTotal() {
    this.balance_total.set(this.storageService.get(this.nmDataPlayer).length)
  }

  getTotalAmount() {
    this.totalAmount.set(this.balance_dataToDisplay().map(t => t.amount).reduce((acc, value) => acc + value, 0));
  }

  getTotalNoFree() {
    this.totalNoFree.set(this.balance_dataToDisplay().map(t => t.free).reduce((acc, value) => (!value) ? acc + 1 : acc, 0));
  }

  getTotalForPerson() {
    this.totalForPerson.set(Number(this.totalAmount()) / Number(this.totalNoFree()));
  }

  updateTotals() {
    this.getTotal();
    this.getTotalAmount();
    this.getTotalNoFree();
    this.getTotalForPerson();
  }

  updateBalance() {
    this.updateTotals();
    this.balance_dataToDisplay().forEach((value, index) => {
      if (value.free) {
        value.balance = value.amount;
      } else {
        value.balance = value.amount - Number(this.totalForPerson());
      }
      let valueAux = Number(value.current_balance);
      value.positive_balance = this.convertToPositiveValue(valueAux);
    });
    this.getTotalBalance();
  }

  updatePositiveBalance(balance_dataToDisplay: Player[]) {
    balance_dataToDisplay.forEach((value, index) => {
      let valueAux = Number(value.current_balance);
      value.positive_balance = this.convertToPositiveValue(valueAux);
    });
    return balance_dataToDisplay;
  }

  convertToPositiveValue(value: number): number {
    return Math.sqrt(Math.pow(value, 2))
  }

  restartCurrentBalance() {
    this.updateTotals();
    this.balance_dataToDisplay().forEach((value, index) => {
      if (value.free) {
        value.balance = value.amount;
        value.current_balance = value.amount;
      } else {
        value.balance = value.amount - Number(this.totalForPerson());
        value.current_balance = value.amount - Number(this.totalForPerson());
      }
      let valueAux = Number(value.balance);
      value.positive_balance = this.convertToPositiveValue(valueAux);
    });
    this.getTotalBalance();
  }

  getTotalBalance() {
    this.totalBalance.set(this.balance_dataToDisplay().map(t => t.balance).reduce((acc, value) => acc + value, 0));
    this.saveBalance();
  }

}
