import { Injectable, signal } from "@angular/core";
import { Balance } from "../model/balance";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { LocalStorageService } from "./local-storage.service";
import { UtilService } from "../service/util.service";

@Injectable({
    providedIn: 'root',
})

export class BalanceStorage {

    nmDataBalance: string = "dataBalance";
    public balance = signal<Balance>(new Balance());
    public balance_dataToDisplay = signal<Balance[]>([]);
    public balance_dataSource = signal(new MatTableDataSource(this.balance_dataToDisplay()));
    public balance_selection = signal(new SelectionModel<Balance>(true, []));

    public balanceLength = signal(0);
    public totalAmount = signal(0);
    public totalNoFree = signal(0);
    public totalForPerson = signal(0);
    public totalBalance = signal(0);

    constructor(
        private storageService: LocalStorageService,
        private utilService: UtilService,) {
    }

    loadBalanceData():Balance[] {
        this.balance_dataToDisplay.set(this.storageService.get(this.nmDataBalance));
        this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
        return this.balance_dataToDisplay();
    }

    addData(value: Balance) {
        let count = 1;
        let idbalance = 0;
        this.balance.set(value);

        // load Storage
        this.loadBalanceData();

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
    }

    addBalance(balance: Balance) {
        this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), balance]);
        this.saveBalance();
    }

    removeItem() {
        this.balance_dataToDisplay.set(this.storageService.get(this.nmDataBalance));
        this.balance_selection().selected.forEach((svalue, sindex) => {
            this.balance_dataToDisplay().forEach((value, index) => {
                if (value.idbalance == svalue.idbalance) this.balance_dataToDisplay().splice(index, 1);
            });
        });
        this.balance_dataSource().data = this.balance_dataToDisplay();
        this.balance_selection().clear();
        this.storageService.set(this.nmDataBalance, this.balance_dataToDisplay());
        this.loadBalanceData();
    }

    removeData() {
        this.storageService.clear();
        this.loadBalanceData();
    }
    
    saveBalance() {
        this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
        this.storageService.set(this.nmDataBalance, this.balance_dataToDisplay());
    }
    
    saveBalanceData(Balance_Data: Balance[]) {
        this.balance_dataToDisplay.set([...Balance_Data]);
        this.saveBalance();
    }
}
