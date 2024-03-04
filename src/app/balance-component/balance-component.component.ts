import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Player } from '../model/player';
import { FormControl } from '@angular/forms';
import {MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '../local-storage.service';
import { BusinessService } from '../service/business.service';


const PLAYER_DATA: Player[] = [
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

@Component({
  selector: 'app-balance-component',
  templateUrl: './balance-component.component.html',
  styleUrl: './balance-component.component.css'
})
export class BalanceComponentComponent   implements AfterViewInit{
  title = 'rachadinha';
  balance_player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false  };
  displayedColumns: string[] = ['select',  'idplayer', 'name', 'positive_current_balance', 'balance', 'amount', 'free'];
  balance_dataToDisplay = [...PLAYER_DATA];
  balance_dataSource = new MatTableDataSource(this.balance_dataToDisplay);
  selection = new SelectionModel<Player>(true, []);
  idplayer = new FormControl("");
  name = new FormControl("");
  amount = new FormControl(0);
  free = new FormControl("");
  total = new FormControl(0);
  totalAmount = new FormControl(0);
  totalForPerson = new FormControl(0);
  totalNoFree = new FormControl(0);
  totalCurrentBalance = new FormControl(0);
  totalBalance = new FormControl(0);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public businessService: BusinessService
    ){
  }
  
  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit(): void {
    this.balance_dataSource.sort = this.sort;
  }
 
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  getTotal() {
    this.total.setValue(this.balance_dataToDisplay.length)
    return this.total.value;
  }
  
  getTotalNoFree() {
    this.totalNoFree.setValue(this.balance_dataToDisplay.map(t => t.free).reduce((acc, value) => (!value)?acc + 1:acc, 0));
    return this.totalNoFree.value;
  }
  
  getTotalForPerson(totalAmount: Number,totalNoFree: Number) {
    this.totalForPerson.setValue(Number(totalAmount)/Number(totalNoFree));
    return this.totalForPerson.value;
  }
  
  getTotalCurrentBalance() {
    return this.balance_dataToDisplay.map(t => t.current_balance).reduce((acc, value) => acc + value, 0);
  }
  
  getTotalBalance() {
    return this.balance_dataToDisplay.map(t => t.balance).reduce((acc, value) => acc + value, 0);
  }
  
  getTotalAmount() {
    this.totalAmount.setValue(this.balance_dataToDisplay.map(t => t.amount).reduce((acc, value) => acc + value, 0));
    return this.totalAmount.value;
  }

  updateBalance(totalForPerson: Number) {
    this.balance_dataToDisplay.forEach((value,index)=>{
      if(value.free){
        value.balance=value.amount;
      }else{
        value.balance=value.amount-Number(totalForPerson);
      }
    });

  }
  updateCurrentBalance(){
    this.balance_dataToDisplay.forEach((value,index)=>{
      value.current_balance=value.balance;   
      value.positive_current_balance=Math.sqrt(Math.pow(Number(value.current_balance),2)) ;   
    });
  }

  update(){
    let total = this.getTotal();
    let totalAmount = this.getTotalAmount();
    let totalNoFree =this.getTotalNoFree();
    let totalForPerson = this.getTotalForPerson(Number(totalAmount), Number(totalNoFree));
    this.updateBalance(Number(totalForPerson));  
    this.getTotalBalance();
  }

  
  addData() {
    let count=1;
    let idplayer=0;
    let name=String(this.name.value);
    if(name.trim() == ""){
      alert("Preencha um nome");
      return;
    }
    while(idplayer==0){
      idplayer=count;
      this.balance_dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==count){
          idplayer=0;
        }
      });
      count++;
    }
    this.balance_dataToDisplay.forEach((value,index)=>{
      if(value.name==name){
        name=name+idplayer;
      }
    });
  
   /* const randomElementIndex = Math.floor(Math.random() * PLAYER_DATA.length);
    this.balance_dataToDisplay = [...this.balance_dataToDisplay, PLAYER_DATA[randomElementIndex]];*/
    let pplayer: Player = Object.create(this.balance_player);
    pplayer.idplayer=idplayer;
    pplayer.name=name;
    pplayer.amount=Number(this.amount.value);
    pplayer.free=Boolean(this.free.value);
    this.balance_dataToDisplay = [...this.balance_dataToDisplay, pplayer];
    this.balance_dataSource.data = this.balance_dataToDisplay;
    this.update();
  }

  removeData() {
    this.selection.selected.forEach((svalue,sindex)=>{
      this.balance_dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==svalue.idplayer) this.balance_dataToDisplay.splice(index,1);
      });
    });
    //this.balance_dataToDisplay = this.balance_dataToDisplay.slice(0, -1);
    this.balance_dataSource.data=this.balance_dataToDisplay;
    this.selection.clear();
    this.update();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.balance_dataToDisplay.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.balance_dataToDisplay);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idplayer + 1}`;
  }

  clearTable() {
    this.balance_dataToDisplay=[];
    this.balance_dataSource.data=this.balance_dataToDisplay;
  }

  clearFields(){
    this.idplayer.setValue("");
    this.name.setValue("");
    this.amount.setValue(0);
    this.free.setValue("");
  }

  loadData(row?: Player) {
    if (row) {
      this.idplayer.setValue(String(row.idplayer));
      this.name.setValue(row.name);
      this.amount.setValue(row.amount);
      this.free.setValue(String(row.free));
    }
  }  
  
  
}

