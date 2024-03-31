import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class UtilService {

    convertToPositiveValue(value: number): number {
        return Math.sqrt(Math.pow(value, 2))
    }

    leftPad(str: string, length: number, padChar: string): string {
        // Implement the leftPad function (if needed)
        // Example implementation:
        while (str.length < length) {
            str = padChar + str;
        }
        return str; // Placeholder
    }

}