import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Player } from './model/player';
import { FormControl } from '@angular/forms';


const PLAYER_DATA: Player[] = [
  {position: 1,  name: 'Hydrogen',  amount:  1.79, balance: 0.00, current_balance: 0.00, free: true},
  {position: 2,  name: 'Helium',    amount:  4.06, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 3,  name: 'Lithium',   amount:  6.41, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 4,  name: 'Beryllium', amount:  9.22, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 5,  name: 'Boron',     amount: 10.81, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 6,  name: 'Carbon',    amount: 12.07, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 7,  name: 'Nitrogen',  amount: 14.67, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 8,  name: 'Oxygen',    amount: 15.94, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 9,  name: 'Fluorine',  amount: 18.94, balance: 0.00, current_balance: 0.00,  free: false},
  {position: 10, name: 'Neon',      amount: 20.17, balance: 0.00, current_balance: 0.00,  free: false},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  title = 'rachadinha';

  
  player: Player = { position: 1, name: 'Hydrogen', amount: 1.79, balance: 0.00, current_balance: 0.00,  free: true  };
  displayedColumns: string[] = ['select', 'position', 'name', 'current_balance', 'balance', 'amount', 'free'];
  dataToDisplay = [...PLAYER_DATA];
  dataSource = new ExampleDataSource(this.dataToDisplay);
  selection = new SelectionModel<Player>(true, []);
  name = new FormControl(this.player.name);
  amount = new FormControl(this.player.amount);
  free = new FormControl(this.player.free);
  
  addData() {
    debugger;
    let count=1;
    let position=0;
    let name='Hydrogen';
    while(position==0){
      position=count;
      this.dataToDisplay.forEach((value,index)=>{
        if(value.position==count){
          position=0;
        }
      });
      count++;
    }
    this.dataToDisplay.forEach((value,index)=>{
      if(value.name==name){
        name=name+position;
      }
    });
  
   /* const randomElementIndex = Math.floor(Math.random() * PLAYER_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, PLAYER_DATA[randomElementIndex]];*/
    let pplayer: Player = Object.create(this.player);
    pplayer.position=position;
    pplayer.name=name;
    
    this.dataToDisplay = [...this.dataToDisplay, pplayer];
    this.dataSource.setData(this.dataToDisplay);
    
  }

  removeData() {
    this.selection.selected.forEach((svalue,sindex)=>{
      this.dataToDisplay.forEach((value,index)=>{
        if(value.position==svalue.position) this.dataToDisplay.splice(index,1);
      });
    });
    //this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
    this.selection.clear();
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}


class ExampleDataSource extends DataSource<Player> {
  private _dataStream = new ReplaySubject<Player[]>();

  constructor(initialData: Player[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Player[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Player[]) {
    this._dataStream.next(data);
  }
  
}