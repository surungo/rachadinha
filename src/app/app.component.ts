import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Balance } from './model/balance';
import { RefundService } from './service/refund.service';
import { BalanceService } from './service/balance.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  
  constructor(
    public refundService: RefundService,
    public balanceService: BalanceService
    ){}
  
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  add_balance: Balance = new Balance();
  
  btnAddData(){
    let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    this.add_balance=new Balance();
    this.add_balance.name=name;
    this.add_balance.amount=Number(this.amount.value);
    this.add_balance.free=Boolean(this.free.value);
    this.balanceService.addData(this.add_balance);
    this.btnClearFields();
  }

  btnRemoveItem() {
    this.balanceService.removeItem()
  }

  btnRemoveData() {
    this.balanceService.removeData();
  }

  btnClearFields(){
    this.name.setValue("");
    this.amount.setValue(0);
    this.free.setValue("");
  }


  btnUpdateBalance() {
    this.balanceService.updateBalance();
  }

  btnRestartCurrentBalance() {
    this.balanceService.restartCurrentBalance()
  }

  btnUpdateRefund() {
    this.refundService.updateRefund()
  }  

  btnAddBalancesTest(){
    this.balanceService.addBalancesTest();
  }

}