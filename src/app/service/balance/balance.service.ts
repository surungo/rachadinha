import { Injectable } from '@angular/core';
import { BalanceStorage } from '../../storage/balance.storage';
import { Balance } from '../../model/balance';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root'
})
export default class BalanceService {

  BALANCE_DATA: Balance[] = [
    {	amount:	650	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	1	 ,	name:	"Hydrogen"	},
    {	amount:	350	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	2	 ,	name:	"Helium"	},
    {	amount:	700	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	3	 ,	name:	"Lithium"	},
    {	amount:	400	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	4	 ,	name:	"Beryllium"	},
    {	amount:	400	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	5	 ,	name:	"Boron"	},
    { amount: 200,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  6  , name: "Carbon" },
    { amount: 650,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  7  , name: "Nitrogen" },
    { amount: 650,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  8  , name: "Oxygen" },
    { amount: 700,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  9  , name: "Fluorine" },
    { amount: 400,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  10 , name: "Neon" },
    { amount: 400,  balance:  0.00  , positive_balance: 0.00  , current_balance:  0.00  , free: false , recap:  false , idbalance:  11 , name: "Sodium" },

  ];

  constructor(
    private balanceStorage: BalanceStorage,
    private utilService: UtilService,
  ) { }

  addBalancesTest() {
    this.balanceStorage.saveBalanceData(this.BALANCE_DATA);
    //this.balanceStorage.saveBalanceData(this.BALANCE_DATA.slice(0, 5));
    //this.balanceStorage.saveBalanceData(this.BALANCE_DATA.slice(5, 11));
  }

  loadData(): Balance[] {
    let balance_dataToDisplay = this.balanceStorage.loadBalanceData();
    balance_dataToDisplay = this.calculateBalance(balance_dataToDisplay);
    return balance_dataToDisplay;
  }

  updateTotals(balance_dataToDisplay: Balance[]): Balance[] {
    this.calculateTotal(balance_dataToDisplay);
    this.calculateTotalAmount(balance_dataToDisplay);
    this.calculateTotalNoFree(balance_dataToDisplay);
    this.calculateTotalForPerson(balance_dataToDisplay);
    return balance_dataToDisplay;
  }

  calculateTotalAmount(balance_dataToDisplay: Balance[]): number {
    if(balance_dataToDisplay==null)return 0;
    return (balance_dataToDisplay.map(t => t.amount).reduce((acc, value) => acc + value, 0));
  }
  totalAmount() : string | number {
    return this.calculateTotalAmount(this.balanceStorage.balance_dataToDisplay());
  }
  //remove
  setTotalAmount(){
    this.balanceStorage.totalAmount.set(this.calculateTotalAmount(this.loadData()));
  }
  
  calculateTotalBalance(balance_dataToDisplay: Balance[]): number {
    if(balance_dataToDisplay==null)return 0;
    return (balance_dataToDisplay.map(t => t.balance).reduce((acc, value) => acc + ((value>0)?value:0) , 0));
  }
  totalBalance(): string | number {
    return this.calculateTotalBalance(this.balanceStorage.balance_dataToDisplay());
  }
  // remove
  setTotalBalance() {
    this.balanceStorage.totalBalance.set(this.calculateTotalBalance(this.loadData()));
  }

  calculateTotal(balance_dataToDisplay: Balance[]): number {
    if(balance_dataToDisplay==null)return 0;
    return (balance_dataToDisplay.length);
  }
  balanceLength(): string | number {
    return this.calculateTotal(this.balanceStorage.balance_dataToDisplay());
   }
   //remove
  setTotal() {
    this.balanceStorage.balanceLength.set(this.calculateTotal(this.loadData()));
  }
  
  calculateTotalNoFree(balance_dataToDisplay: Balance[]): number {
    if(balance_dataToDisplay==null)return 0;
    return (balance_dataToDisplay.map(t => t.free).reduce((acc, value) => (!value) ? acc + 1 : acc, 0));
  }
  totalNoFree(): string | number{
    return this.calculateTotalNoFree(this.balanceStorage.balance_dataToDisplay());
  }
  //remove
  setTotalNoFree() {
    this.balanceStorage.totalNoFree.set(this.calculateTotalNoFree(this.loadData()));
  }

  calculateTotalForPerson(balance_dataToDisplay: Balance[]) :number{
    let totalAmount = this.calculateTotalAmount(balance_dataToDisplay);
    let totalNoFree = this.calculateTotalNoFree(balance_dataToDisplay);
    if(totalNoFree==0)return 0;
    return ( totalAmount / totalNoFree );
  }
  totalForPerson(): string | number{
    return this.calculateTotalForPerson(this.balanceStorage.balance_dataToDisplay());
  }
  //remove
  setTotalForPerson() {
    this.balanceStorage.totalForPerson.set(this.calculateTotalForPerson(this.balanceStorage.balance_dataToDisplay()));
  }
  
  setAllTotals(){
    this.setTotal();
    this.setTotalAmount();
    this.setTotalBalance();
    this.setTotalForPerson();
    this.setTotalNoFree();
  }

  resetBalance() {
    let balance_dataToDisplay = this.updateTotals(this.loadData());
    balance_dataToDisplay = this.calculateBalance(balance_dataToDisplay);
    this.balanceStorage.saveBalanceData(balance_dataToDisplay);
    this.setAllTotals();
  }

  calculateBalance(balance_dataToDisplay: Balance[]): Balance[] {
    balance_dataToDisplay = this.updateTotals(balance_dataToDisplay);
    let totalForPerson = this.calculateTotalForPerson(balance_dataToDisplay);
    balance_dataToDisplay.forEach((value, index) => {
      if (value.free) {
        value.balance = value.amount;
      } else {
        value.balance = value.amount - Number(totalForPerson);
      }
      let valueAux = Number(value.current_balance);
      value.current_balance = value.balance;
      value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
    });
    return balance_dataToDisplay;
  }

}
