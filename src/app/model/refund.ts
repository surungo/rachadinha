import { Balance } from "./balance";

Balance
export class Refund {
    idrefund!: number;
    payer!: Balance;    
    payee!: Balance;
    amount!: number;
    current_balance!: number;
    positive_balance!: number;

    constructor() {} 
    
    load(refund: Refund){
        this.idrefund=refund.idrefund;
        this.payer=refund.payer;    
        this.payee=refund.payee;
        this.amount=refund.amount;
        this.current_balance=refund.current_balance;
        this.positive_balance=refund.positive_balance;
    }
}
