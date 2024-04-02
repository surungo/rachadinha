import { Injectable } from '@angular/core';
import { Refund } from '../../model/refund';
import { BalanceStorage } from '../../storage/balance.storage';
import { Balance } from '../../model/balance';
import { UtilService } from '../util.service';
import { RefundStorage } from '../../storage/refund.storage';
import BalanceService from '../balance/balance.service';

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  
  constructor(
    private balanceStorage: BalanceStorage,
    private utilService: UtilService,
    private refundStorage: RefundStorage,
    private balanceService: BalanceService,
  ) { }

  allRefunds() {
    this.refundStorage.saveRefundData(this.getCombinations());
  }

  getCombinations(): Refund[]{
    let refund_dataToDisplay: Refund[] = [];
    let balance_dataToDisplay: Balance[] = this.balanceStorage.loadBalanceData(); 
    balance_dataToDisplay
      .filter((payer, i) =>  payer.current_balance < 0 )
      .forEach((payer, index) => {
        balance_dataToDisplay
          .filter((payee, i) =>  payee.current_balance > 0 )
          .forEach((payee, index) => {
            let refund = new Refund();
            refund.payee=payee;
            refund.payer=payer;
            refund.amount=0;
            refund.current_balance = this.calculateCurrentBalance(refund);
            refund.positive_balance = this.utilService.convertToPositiveValue(refund.current_balance);
            //refund.idrefund = this.utilService.leftPad(String(refund_dataToDisplay.length+1), 3, "0");
            refund.idrefund = refund_dataToDisplay.length+1;
            refund_dataToDisplay=[...refund_dataToDisplay,refund];
     
        });
   
    });

    
   
    
    return refund_dataToDisplay;
  }


  resolve() {
    if(this.balanceStorage.balance_dataToDisplay().length<2)return;
    this.balanceService.resetBalance();
    let refund_dataToDisplay = this.getCombinations();
    let count = 0;
    while(this.existsRecap(refund_dataToDisplay) && refund_dataToDisplay.length > count ){
      refund_dataToDisplay=this.payFirst(refund_dataToDisplay);
      count++;
    }
    
    
    this.refundStorage.saveRefundData(refund_dataToDisplay);

  }
  existsRecap(refund_dataToDisplay: Refund[]) {
    return refund_dataToDisplay.filter((e, i) =>
        e.payee.current_balance > 0 || 
        e.payer.current_balance > 0 ).length > 0;
  }

  generateCombination(
    refund_dataToDisplay: Refund[],
    balance_dataToDisplay: Balance[],
    refund: Refund,
    start: number,
    index: number,
    r: number,
    all: boolean
  ): Refund[] {
    let size = balance_dataToDisplay.length;
    let end = size - 1;

    if (index === r) {
      if(!this.exists(refund,refund_dataToDisplay)){
        refund.amount=0;
        refund.current_balance = this.calculateCurrentBalance(refund);
        refund.positive_balance = this.utilService.convertToPositiveValue(refund.current_balance);
        //refund.idrefund = this.utilService.leftPad(String(refund_dataToDisplay.length+1), 3, "0");
        refund.idrefund = refund_dataToDisplay.length+1;
        let refundAux = new Refund();
        refundAux.load(refund);
        refund_dataToDisplay=[...refund_dataToDisplay,refundAux];
      }
      return refund_dataToDisplay;
    }

    for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
      if (balance_dataToDisplay[i].current_balance > 0) {
        refund.payee = balance_dataToDisplay[i];
      } else {
        refund.payer = balance_dataToDisplay[i];
      }
      refund_dataToDisplay = this.generateCombination(refund_dataToDisplay, balance_dataToDisplay, refund, i + 1, index + 1, r, all);
    }

    if (all && r <= end && start === 0) {
      start = 0;
      index = 0;
      r++;
      refund_dataToDisplay = this.generateCombination(refund_dataToDisplay, balance_dataToDisplay, new Refund(), start, index, r, all);
    }
    return refund_dataToDisplay;
  }

  calculateCurrentBalance(refund: Refund): number{
    return refund.payee.current_balance+refund.payer.current_balance;
  }

  exists(refund:Refund, refund_dataToDisplay: Refund[]){
    return refund_dataToDisplay.filter((e, i) =>
        e.payee.idbalance == refund.payee.idbalance && 
        e.payer.idbalance == refund.payer.idbalance ).length > 0;
  }

  sortPositiveBalance(refund_dataToDisplay : Refund[]): Refund[]{
    refund_dataToDisplay.sort((a, b) => a.current_balance - b.current_balance); 
    refund_dataToDisplay.sort((a, b) => a.positive_balance - b.positive_balance); 
    return refund_dataToDisplay;
  }

  payFirst(refund_dataToDisplay : Refund[]): Refund[]{
    refund_dataToDisplay=this.sortPositiveBalance(refund_dataToDisplay);
    let index = 0;
    let refund = refund_dataToDisplay[index];
    if(refund.payee.positive_balance>refund.payer.positive_balance){
      refund.amount=refund.payer.positive_balance;
      refund.payer.current_balance=0;
      refund.payer.positive_balance=0;
      refund.payee.current_balance=refund.payee.current_balance-refund.amount;
      refund.payee.positive_balance=refund.payee.current_balance;

    }else{
      refund.amount=refund.payee.positive_balance;
      refund.payee.current_balance=0;
      refund.payee.positive_balance=0;
      refund.payer.current_balance=refund.payer.current_balance+refund.amount;
      refund.payer.positive_balance=this.utilService.convertToPositiveValue(refund.payer.current_balance);

    }
    refund_dataToDisplay=this.updateCurrentBalance(refund_dataToDisplay);
    
    refund_dataToDisplay=this.resolved(refund_dataToDisplay);
    refund_dataToDisplay=this.removePaidOff(refund_dataToDisplay);
    return refund_dataToDisplay;
  }
  resolved(refund_dataToDisplay: Refund[]): Refund[] {
    refund_dataToDisplay.forEach((refund, index) => {
      if(refund.amount>0){
        refund.positive_balance=this.balanceStorage.totalAmount()
      }
    });
    return refund_dataToDisplay;
  }
  removePaidOff(refund_dataToDisplay: Refund[]): Refund[] {
    return refund_dataToDisplay.filter((e, i) =>
        e.amount > 0 || (
        e.payee.current_balance != 0 && 
        e.payer.current_balance != 0 ) );

    
    
  }
  updateCurrentBalance(refund_dataToDisplay: Refund[]): Refund[] {
    refund_dataToDisplay.forEach((value, index) => {
      value.current_balance = this.calculateCurrentBalance(value);
      value.positive_balance = this.utilService.convertToPositiveValue(value.current_balance);

    });
    return refund_dataToDisplay;
  }

  totalAmount(): string|number {
    return (this.refundStorage.refund_dataToDisplay().map(t => t.amount).reduce((acc, value) => acc + ((value>0)?value:0) , 0));
  }

}
