import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class UtilService {

    convertToPositiveValue(value: number): number {
        return Math.sqrt(Math.pow(value, 2))
    }

}