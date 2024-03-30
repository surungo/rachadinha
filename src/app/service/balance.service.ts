import { Injectable, signal } from "@angular/core";
import { Balance } from "../model/balance";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { LocalStorageService } from "../local-storage.service";
import { RefundService } from "./refund.service";
import { UtilService } from "./util.service";

@Injectable({
    providedIn: 'root',
})

export class BalanceService {
    BALANCE_DATA: Balance[] = [
        //{	amount:	650	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	1	,	name:	"Hydrogen"	},
        //{	amount:	350	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	2	,	name:	"Helium"	},
        //{	amount:	700	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	3	,	name:	"Lithium"	},
        //{	amount:	400	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	4	,	name:	"Beryllium"	},
        //{	amount:	400	,	balance:	0.00	,	positive_balance:	0.00	,	current_balance:	0.00	,	free:	false	,	recap:	false	,	idbalance:	5	,	name:	"Boron"	},
        { amount: 200, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 6, name: "Carbon" },
        { amount: 650, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 7, name: "Nitrogen" },
        { amount: 650, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 8, name: "Oxygen" },
        { amount: 700, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 9, name: "Fluorine" },
        { amount: 400, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 10, name: "Neon" },
        { amount: 400, balance: 0.00, positive_balance: 0.00, current_balance: 0.00, free: false, recap: false, idbalance: 11, name: "Sodium" },

    ];

    nmDataBalance: string = "dataBalance";
    public balance = signal<Balance>(new Balance());
    public balance_dataToDisplay = signal<Balance[]>([]);
    public balance_dataSource = signal(new MatTableDataSource(this.balance_dataToDisplay()));
    public balance_selection = signal(new SelectionModel<Balance>(true, []));

    public balance_total = signal(0);
    public totalAmount = signal(0);
    public totalNoFree = signal(0);
    public totalForPerson = signal(0);
    public totalBalance = signal(0);

    constructor(private storageService: LocalStorageService,
        public refundService: RefundService,
        public utilService: UtilService,) {
        //this.loadData();
    }

    loadBalanceData() {
        this.balance_dataToDisplay.set(this.storageService.get(this.nmDataBalance));
        this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
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
        this.updateBalance();
    }

    addBalance(balance: Balance) {
        this.balance_dataToDisplay.set([...this.balance_dataToDisplay(), balance]);
        this.saveBalance();
    }

    updateBalance() {
        this.updateTotals();
        this.balance_dataToDisplay().forEach((value, index) => {
            if (value.free) {
                value.balance = value.amount;
            } else {
                value.balance = value.amount - Number(this.totalForPerson());
            }
            let valueAux = Number(value.current_balance);
            value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
        });
        this.getTotalBalance();
    }

    loadData() {
        this.loadBalanceData();
        this.updateBalance();
    }

    saveBalance() {
        this.balance_dataSource.set(new MatTableDataSource(this.balance_dataToDisplay()));
        this.storageService.set(this.nmDataBalance, this.balance_dataToDisplay());
    }

    updateTotals() {
        this.getTotal();
        this.getTotalAmount();
        this.getTotalNoFree();
        this.getTotalForPerson();
    }

    getTotalBalance() {
        this.totalBalance.set(this.balance_dataToDisplay().map(t => t.balance).reduce((acc, value) => acc + value, 0));
        this.saveBalance();
    }

    getTotal() {
        this.balance_total.set(this.storageService.get(this.nmDataBalance).length)
    }

    getTotalAmount() {
        this.totalAmount.set(this.balance_dataToDisplay().map(t => t.amount).reduce((acc, value) => acc + value, 0));
    }

    getTotalNoFree() {
        this.totalNoFree.set(this.balance_dataToDisplay().map(t => t.free).reduce((acc, value) => (!value) ? acc + 1 : acc, 0));
    }

    getTotalForPerson() {
        this.totalForPerson.set(Number(this.totalAmount()) / Number(this.totalNoFree()));
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
        this.loadData();
    }

    removeData() {
        this.storageService.clear();
        this.loadData();
    }

    restartCurrentBalance() {
        this.updateTotals();
        this.balance_dataToDisplay().forEach((value, index) => {
            if (value.free) {
                value.balance = value.amount;
                value.current_balance = value.amount;
            } else {
                value.balance = value.amount - Number(this.totalForPerson());
                value.current_balance = value.amount - Number(this.totalForPerson());
            }
            let valueAux = Number(value.balance);
            value.positive_balance = this.utilService.convertToPositiveValue(valueAux);
        });
        this.getTotalBalance();
    }

    addBalancesTest() {
        this.balance_dataToDisplay.set([...this.BALANCE_DATA]);
        this.saveBalance();
    }
}
