import { Component, effect } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Balance } from './model/balance';
import { RefundStorage } from './storage/refund.storage';
import { BalanceStorage } from './storage/balance.storage';
import BalanceService from './service/balance/balance.service';
import { RefundService } from './service/refund/refund.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent {


  constructor(
    private refundStorage: RefundStorage,
    private refundService: RefundService,
    public balanceStorage: BalanceStorage,
    private balanceService: BalanceService,

  ) { }

  public version = "v1.1.0 b24-04-01.22";

  idbalance = new FormControl(this.balanceStorage.idbalance());
  name = new FormControl(this.balanceStorage.name());
  amount = new FormControl(this.balanceStorage.amount());
  free = new FormControl(this.balanceStorage.free());
  add_balance: Balance = new Balance();

  hiddenClearFiels(): boolean {
    return this.amount.value == 0 && String(this.name.value) == '';
  }

  hiddenNotSelected() {
    const numSelected = this.balanceStorage.balance_selection().selected.length;
    return numSelected == 0;
  }

  hiddenEditItem() {
    const numSelected = this.balanceStorage.balance_selection().selected.length;
    return numSelected != 1;
  }

  btnAddData() {
    let name = String(this.name.value);
    if (name.trim() == "") {
      alert("Preencha um nome");
      return;
    }
    this.add_balance = new Balance();
    this.add_balance.idbalance = Number(this.idbalance.value);
    this.add_balance.name = name;
    this.add_balance.amount = Number(this.amount.value);
    this.add_balance.free = Boolean(this.free.value);
    this.balanceStorage.addData(this.add_balance);
    this.refundService.resolve();
    this.updateFields();
    this.balanceStorage.amount.set(0);
    this.amount.setValue(this.balanceStorage.amount());
    
  }
  btnDecreaseData() {
    let name = String(this.name.value);
    if (name.trim() == "") {
      alert("Preencha um nome");
      return;
    }
    this.add_balance = new Balance();
    this.add_balance.idbalance = Number(this.idbalance.value);
    this.add_balance.name = name;
    this.add_balance.amount = Number(this.amount.value);
    this.add_balance.free = Boolean(this.free.value);
    this.balanceStorage.decreaseData(this.add_balance);
    this.refundService.resolve();
    this.balanceStorage.amount.set(0);
    this.amount.setValue(this.balanceStorage.amount());
  }

  btnRemoveItem() {
    this.balanceStorage.removeItem()
  }

  btnRemoveData() {
    this.balanceStorage.removeData();
    this.refundStorage.removeData();
  }

  btnClearFields() {
    this.balanceStorage.idbalance.set(0);
    this.balanceStorage.name.set("");
    this.balanceStorage.amount.set(0);
    this.balanceStorage.free.set(false);
    this.idbalance.setValue(this.balanceStorage.idbalance());
    this.name.setValue(this.balanceStorage.name());
    this.amount.setValue(this.balanceStorage.amount());
    this.free.setValue(this.balanceStorage.free());
  }

  btnEditItem() {
    this.balanceStorage.editItem();
    this.updateFields();
  }

  updateFields(){
    this.idbalance.setValue(this.balanceStorage.idbalance());
    this.name.setValue(this.balanceStorage.name());
    this.free.setValue(this.balanceStorage.free());
  }

  btnSolverRefund() {
    this.refundService.resolve();
  }
  btnAllRefund() {
    this.refundService.allRefunds();
  }

  btnAddBalancesTest() {
    this.balanceService.addBalancesTest();
    this.balanceService.resetBalance();
  }

}
