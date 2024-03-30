import { Balance } from "./balance";

Balance
export class Refund {
    idrefund!: number;
    payer!: Balance;    
    payee!: Balance;
    amount!: number;

    constructor() {}    
}
