import { Injectable, signal } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { LocalStorageService } from "./local-storage.service";
import { SelectionModel } from "@angular/cdk/collections";
import { Refund } from "../model/refund";

@Injectable({
  providedIn: 'root',
})

export class RefundStorage {
  
  REFUND_DATA: Refund[] = [
    //{ 'idrefund': 0, 'payee': this.BALANCE_DATA[0], 'payer': this.BALANCE_DATA[1], 'amount': 0 }
  ];
  nmDataRefund: string = "dataRefund";
  public refund = signal<Refund>(new Refund());//this.REFUND_DATA[0]); 
  public refund_dataToDisplay = signal<Refund[]>([]);//...this.REFUND_DATA]);
  public refund_dataSource = signal(new MatTableDataSource(this.refund_dataToDisplay()));
  public refund_selection = signal(new SelectionModel<Refund>(true, []));
  
  constructor(
    private storageService: LocalStorageService,
    ) {
  }

  loadData() {
    this.loadRefundData();
  }

  loadRefundData() {
    this.refund_dataToDisplay.set(this.storageService.get(this.nmDataRefund));
    this.loadDataSource(this.refund_dataToDisplay());    
  }

  loadDataSource(refund_dataToDisplay: Refund[]){
    this.refund_dataToDisplay.set(refund_dataToDisplay);
    this.refund_dataSource.set(new MatTableDataSource(this.refund_dataToDisplay()));
  }

  saveRefund() {
    this.refund_dataSource.set(new MatTableDataSource(this.refund_dataToDisplay()));
    this.storageService.set(this.nmDataRefund, this.refund_dataToDisplay());
  }
  saveRefundData(refund_Data: Refund[]) {
    this.refund_dataToDisplay.set([...refund_Data]);
    this.saveRefund();
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

/*
    TRASH 1
  ||||||||||||||||||||||
  vvvvvvvvvvvvvvvvvvvvvv
 

  loadBalanceData() {
    this.balance_dataToDisplay.set(this.storageService.get(this.nmDataBalance));
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
  }

  addData(value: Balance) {
    let count = 1;
    let idbalance = 0;
    this.balance.set(value);
    
    // load Storage
    this.loadBalanceData();
    this.loadRefundData();

    // select balance id
    if (this.storageService.get(this.nmDataBalance).length != 0) {
      while (idbalance == 0) {
        idbalance = count;
        this.balance_dataToDisplay().forEach((value, index) => {
          if (value.idbalance == count) {
            idbalance = 0;
          }
        });
        count++;
      }
      this.balance().idbalance = idbalance;
    } else {
      this.balance().idbalance = 1;
    }
    this.balance_dataToDisplay().forEach((value, index) => {
      if (value.name == this.balance().name) {
        this.balance().name = this.balance().name + idbalance;
      }
    });

    // add new balance storage
    this.addBalance(this.balance());
    this.updateBalance();
  
  //  if (this.storageService.get(this.nmDataBalance).length > 1) {
  //    this.updateRefund();
  //  }
  
    this.loadData();
  }
 

  createRefund() {
    this.clearRefund();
    this.loadRefundData();
    this.restartCurrentBalance();
    this.balance_dataToDisplay.set(this.resetRecapAll(this.balance_dataToDisplay()));
        
    let refund = this.newRefund();
    // case 1
    debugger;
    let solver=1;
    let count=0;
    let balance1Arr : Balance[] = [];
    let balance2Arr : Balance[] = [];
    while(solver<3) {
      while(this.balance_dataToDisplay().filter((e, i) => e.recap).length < this.balance_dataToDisplay().length &&
            count<this.balance_dataToDisplay().length) {

        this.balance_dataToDisplay.set(this.updatePositiveBalance(this.balance_dataToDisplay()));
        this.balance_dataToDisplay.set(this.sortBalance(this.balance_dataToDisplay()));
        
        balance1Arr = this.getBalanceCadidate([], solver);
        if(balance1Arr.length<1){
          continue;
        }
        
        balance2Arr = this.getBalanceCadidate(balance1Arr, solver);
        if(balance2Arr.length<1){
          balance1Arr=[];
          continue;
        }
        
        for(let balance1 of balance1Arr){
          for(let balance2 of balance2Arr){
            if(balance1.balance>0){
              refund.payee=balance1;
            }
            if(balance1.balance<0){
              refund.payer=balance1;
            }
            
            if(balance2.balance>0){
              refund.payee=balance2;
            }
            if(balance2.balance<0){
              refund.payer=balance2;
            }
            
            if(refund.payee.current_balance>=refund.payer.current_balance){
              refund.amount=this.utilService.convertToPositiveValue(refund.payer.current_balance);
            }else{

            }
            refund.payee.current_balance=refund.payee.balance-refund.amount;
            refund.payer.current_balance=refund.payer.balance+refund.amount;
            refund.payee.current_balance=refund.payee.current_balance<0.00?0:refund.payee.current_balance;
            refund.payer.current_balance=refund.payer.current_balance<0.00?0:refund.payer.current_balance;
            this.balance_dataToDisplay.set(this.updatePositiveBalance(this.balance_dataToDisplay()));
            this.addRefund(refund);
            refund = this.newRefund();
            count++;
          }
        } 
        balance2Arr=[]; 
      }
      count=0;
      solver++;
      this.balance_dataToDisplay.set(this.resetRecap(this.balance_dataToDisplay()));
    }
  }
  
  sumPositiveBalance(myNums: Balance[]) {
    let sum = 0;
    myNums.forEach( balance => {
      sum += balance.positive_balance;
    });
    return sum;
  }
  sumCurrentBalance(myNums: Balance[]) {
    let sum = 0;
    myNums.forEach( balance => {
      sum += balance.current_balance;
    });
    return sum;
  }
  resetRecapAll(balance_dataToDisplay: Balance[]): Balance[] {
    balance_dataToDisplay.forEach((value, index) => value.recap=false);
    return balance_dataToDisplay;
  }
  resetRecap(balance_dataToDisplay: Balance[]): Balance[] {
    balance_dataToDisplay
      .filter((e, i) => e.current_balance != 0 )
      .forEach((e, i) => e.recap=false);
     return balance_dataToDisplay; 
  }
  getBalancerEmpty() {
    let balance = new Balance();
    balance.idbalance=0;
    balance.balance=0;
    balance.current_balance=0;
    balance.positive_balance=0;
    return balance;
  }

  getBalanceCadidate(balance1Arr: Balance[], solver: Number): Balance[] {
    let balance2Arr : Balance[] = []; 
    for(let balance_loop of this.balance_dataToDisplay()){
      let exists=false;
      if(balance_loop.recap){
        exists=true;
        continue;
      }
      // to be a candidate the id has to be different
      //if(balance.idbalance==balance_loop.idbalance){
      //  exists=true;
      //  continue;
      //}   

      // to be a candidate the current balance has to be oppositional
      if(balance_loop.current_balance > 0 ) {
        if( this.positiveCurrentBalance(balance1Arr) ){
          exists=true;
          continue;
        }                   
      }else{
        if( this.negativeCurrentBalance(balance1Arr) ){
          exists=true;
          continue;
        } 
      }

      // to be a candidate the current balance has to exists
      if(balance_loop.current_balance == 0){
        exists=true;
        continue;
      }
      
      for(let refund_loop of this.refund_dataToDisplay()){
        // to be a candidate, if they have same ID, they need have current balance
        if(refund_loop.payee.idbalance==balance_loop.idbalance 
          && 
          (  refund_loop.payee.current_balance==0
          || refund_loop.payer.current_balance==0)){
            exists=true;
            continue;
        }
      }
      if(balance1Arr.length<1){
        balance_loop.recap=true;
        balance2Arr.push(balance_loop);
        return balance2Arr;
      }

      switch(solver){
        case 1:
          if(balance1Arr.length>0 && balance_loop.positive_balance!=this.sumPositiveBalance(balance1Arr)){
            exists=true;
          }
          if(!exists){
            balance_loop.recap=true;
            balance2Arr.push(balance_loop);
            return balance2Arr;
          }
        break;
        case 2:
          if(!exists){
            balance_loop.recap=true;
            balance2Arr.push(balance_loop);
          }
          let sum1 = this.sumCurrentBalance(balance1Arr);
          let sum2 = this.sumCurrentBalance(balance2Arr);
          if(sum1+sum2!=0){
            continue;
          }else{
            return balance2Arr; 
          }      
        break;
      }
        
    }
    return balance2Arr;

  }
  negativeCurrentBalance(balance1Arr: Balance[]) {
    return balance1Arr.filter((e, i) => e.current_balance<0).length > 0;
  }
  positiveCurrentBalance(balance1Arr: Balance[]) {
    return balance1Arr.filter((e, i) => e.current_balance>0).length > 0;
  }

  sortBalance(balance_dataToDisplay : Balance[]) {
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

  addBalance(balance: Balance) {
    this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), balance]);
    this.saveBalance();
  }

  saveBalance() {
    this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
    this.storageService.set(this.nmDataBalance, this.balance_dataToDisplay());
  }

  addRefund(refund: Refund) {
    if (refund.idrefund > 0) {
      this.refund_dataToDisplay.set([...this.refund_dataToDisplay(), refund]);
      this.saveRefund();
    }
  }





  

  getTotal() {
    this.balance_total.set(this.storageService.get(this.nmDataBalance).length)
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
      value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
    });
    this.getTotalBalance();
  }

  updatePositiveBalance(balance_dataToDisplay: Balance[]) {
    balance_dataToDisplay.forEach((value, index) => {
      let valueAux = Number(value.current_balance);
      value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
    });
    return balance_dataToDisplay;
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
      value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
    });
    this.getTotalBalance();
  }

  getTotalBalance() {
    this.totalBalance.set(this.balance_dataToDisplay().map(t => t.balance).reduce((acc, value) => acc + value, 0));
    this.saveBalance();
  }
 */
}
