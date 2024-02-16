import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Player } from './model/player';
import { FormControl } from '@angular/forms';
import {MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


const PLAYER_DATA: Player[] = [
  {idplayer: 1,  name: 'Hydrogen',  amount: 500.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00, free: true, players: new Array},
  {idplayer: 2,  name: 'Helium',    amount: 700.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  {idplayer: 3,  name: 'Lithium',   amount: 300.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  {idplayer: 4,  name: 'Beryllium', amount: 100.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  {idplayer: 5,  name: 'Boron',     amount:   0.00, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  //{idplayer: 6,  name: 'Carbon',    amount: 12.07, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  //{idplayer: 7,  name: 'Nitrogen',  amount: 14.67, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  //{idplayer: 8,  name: 'Oxygen',    amount: 15.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  //{idplayer: 9,  name: 'Fluorine',  amount: 18.94, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
  //{idplayer: 10, name: 'Neon',      amount: 20.17, balance: 0.00, positive_current_balance: 0.00, current_balance: 0.00,  free: false, players: []},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent  implements AfterViewInit{
  title = 'rachadinha';

  player: Player = { idplayer: 1, name: '', amount: 0, balance: 0, positive_current_balance: 0.00, current_balance: 0,  free: false, players: []  };
  displayedColumns: string[] = ['select',  'idplayer', 'name', 'positive_current_balance', 'balance', 'amount', 'free'];
  dataToDisplay = [...PLAYER_DATA];
  dataSource = new MatTableDataSource(this.dataToDisplay);
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

  constructor(private _liveAnnouncer: LiveAnnouncer){
    //this.clearTable()

    this.update();
    //this.solver(0);
    
  }
  
  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  simulation(){
    this.addPlayerById(2,4);
    this.addPlayerById(4,2);
    this.addPlayerById(1,3);
    this.addPlayerById(1,5);
    this.addPlayerById(3,1);
    this.addPlayerById(5,1);

  }

  addPlayerById(id1: Number,id2: Number){
    this.dataToDisplay.forEach(value1 => {
      if(value1.idplayer==id1){
        this.dataToDisplay.forEach(value2 => {
          if(value2.idplayer==id2){
            value1.players = [...value1.players, value2];
          }
        })  
      }
    });
  }

  solver(level: Number){
    this.dataToDisplay.forEach((value1,index1)=>{
      value1.players.forEach((value2,index2)=>{
        value1.current_balance+=value2.current_balance;
      });
    });
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  getTotal() {
    this.total.setValue(this.dataToDisplay.length)
    return this.total.value;
  }
  
  getTotalNoFree() {
    this.totalNoFree.setValue(this.dataToDisplay.map(t => t.free).reduce((acc, value) => (!value)?acc + 1:acc, 0));
    return this.totalNoFree.value;
  }
  
  getTotalForPerson(totalAmount: Number,totalNoFree: Number) {
    this.totalForPerson.setValue(Number(totalAmount)/Number(totalNoFree));
    return this.totalForPerson.value;
  }
  
  getTotalCurrentBalance() {
    return this.dataToDisplay.map(t => t.current_balance).reduce((acc, value) => acc + value, 0);
  }
  
  getTotalBalance() {
    return this.dataToDisplay.map(t => t.balance).reduce((acc, value) => acc + value, 0);
  }
  
  getTotalAmount() {
    this.totalAmount.setValue(this.dataToDisplay.map(t => t.amount).reduce((acc, value) => acc + value, 0));
    return this.totalAmount.value;
  }

  updateBalance(totalForPerson: Number) {
    this.dataToDisplay.forEach((value,index)=>{
      if(value.free){
        value.balance=value.amount;
      }else{
        value.balance=value.amount-Number(totalForPerson);
      }
    });

  }
  updateCurrentBalance(){
    this.dataToDisplay.forEach((value,index)=>{
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
      this.dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==count){
          idplayer=0;
        }
      });
      count++;
    }
    this.dataToDisplay.forEach((value,index)=>{
      if(value.name==name){
        name=name+idplayer;
      }
    });
  
   /* const randomElementIndex = Math.floor(Math.random() * PLAYER_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, PLAYER_DATA[randomElementIndex]];*/
    let pplayer: Player = Object.create(this.player);
    pplayer.idplayer=idplayer;
    pplayer.name=name;
    pplayer.amount=Number(this.amount.value);
    pplayer.free=Boolean(this.free.value);
    this.dataToDisplay = [...this.dataToDisplay, pplayer];
    this.dataSource.data = this.dataToDisplay;
    this.update();
  }

  removeData() {
    this.selection.selected.forEach((svalue,sindex)=>{
      this.dataToDisplay.forEach((value,index)=>{
        if(value.idplayer==svalue.idplayer) this.dataToDisplay.splice(index,1);
      });
    });
    //this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.data=this.dataToDisplay;
    this.selection.clear();
    this.update();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataToDisplay.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataToDisplay);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idplayer + 1}`;
  }

  clearTable() {
    this.dataToDisplay=[];
    this.dataSource.data=this.dataToDisplay;
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
