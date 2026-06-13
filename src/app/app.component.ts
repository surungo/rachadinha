import { Component } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Balance } from './model/balance';
import { RefundStorage } from './storage/refund.storage';
import { BalanceStorage } from './storage/balance.storage';
import BalanceService from './service/balance/balance.service';
import { RefundService } from './service/refund/refund.service';
import { TranslationService } from './service/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {


  constructor(
    private refundStorage: RefundStorage,
    private refundService: RefundService,
    public balanceStorage: BalanceStorage,
    private balanceService: BalanceService,
    public translation: TranslationService

  ) { }

  public version = "v1.1.1 b24-04-06.19";
  public isMobile = window.innerWidth < 768;

  idbalance = new FormControl(this.balanceStorage.idbalance());
  name = new FormControl(this.balanceStorage.name());
  amount = new FormControl(this.balanceStorage.amount());
  free = new FormControl(this.balanceStorage.free());
  add_balance: Balance = new Balance();
  
  showDevMode(){
    return false;
  }
  showNew(): boolean {
    return this.idbalance.value == 0;
  }

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
  btnSubstData() {
    this.updatebalance(true,true);    
    this.btnClearFields();
  }

  btnAddData() {
    this.updatebalance(true,false);
  }
  
  btnDecreaseData() {
    this.updatebalance(false,false);
  }

  updatebalance(add: boolean,subst: boolean){
    let name = String(this.name.value);
    if (name.trim() == "") {
      alert(this.translation.translate('emptyNameAlert'));
      return;
    }
    this.add_balance = new Balance();
    this.add_balance.idbalance = Number(this.idbalance.value);
    this.add_balance.name = name;
    this.add_balance.amount = Number(this.amount.value);
    if(!add){
      this.add_balance.amount=this.add_balance.amount*-1;
    }
    this.add_balance.free = Boolean(this.free.value);
    this.balanceStorage.addData(this.add_balance,subst);
    this.refundService.resolve();
    this.updateFields();
    this.balanceStorage.amount.set(0);
    this.amount.setValue(this.balanceStorage.amount());
  }

  btnRemoveItem() {
    this.balanceStorage.removeItem()
    this.refundService.resolve();
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

  setLanguage(language: 'pt' | 'en') {
    this.translation.setLanguage(language);
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

  exportDataAsJson() {
    const data = {
      balanceData: this.balanceStorage.balance_dataToDisplay(),
      refundData: this.refundStorage.refund_dataToDisplay()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'rachadinha-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  onJsonFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.balanceData && Array.isArray(parsed.balanceData)) {
          this.balanceStorage.saveBalanceData(parsed.balanceData);
        }
        if (parsed.refundData && Array.isArray(parsed.refundData)) {
          this.refundStorage.saveRefundData(parsed.refundData);
        }
        this.balanceStorage.loadBalanceData();
        this.refundStorage.loadData();
        input.value = '';
      } catch (error) {
        alert('JSON inválido');
      }
    };
    reader.readAsText(file);
  }

  btnAddBalancesTest() {
    this.balanceService.addBalancesTest();
    this.balanceService.resetBalance();
  }

}
