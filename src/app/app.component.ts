import { Component, effect } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Balance } from './model/balance';
import { RefundStorage } from './storage/refund.storage';
import { BalanceStorage } from './storage/balance.storage';
import  BalanceService  from './service/balance/balance.service';
import { RefundService } from './service/refund/refund.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent{
  
  constructor(
    private refundStorage: RefundStorage,
    private refundService: RefundService,
    public balanceStorage: BalanceStorage,
    private balanceService: BalanceService,
    
    ){}

    public version = "v1.0.0 b24-03-31.02";
  
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
    this.balanceStorage.addData(this.add_balance);
    this.btnClearFields();
    this.refundService.resolve();
  }

  btnRemoveItem() {
    this.balanceStorage.removeItem()
  }

  btnRemoveData() {
    this.balanceStorage.removeData();
    this.refundStorage.removeData();
  }

  btnClearFields(){
    this.name.setValue("");
    this.amount.setValue(0);
    this.free.setValue("");
  }

  btnSolverRefund() {
    this.refundService.resolve();
  }  
  btnAllRefund() {
    this.refundService.allRefunds();
  }  

  btnAddBalancesTest(){
    this.balanceService.addBalancesTest();
    this.balanceService.resetBalance();
  }

}


