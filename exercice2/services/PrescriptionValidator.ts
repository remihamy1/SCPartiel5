import { ValidationEngine } from './ValidationEngine';
import { Prescription } from '../models/Prescription';

export class PrescriptionValidator {
    readonly validationEngine: ValidationEngine;

    constructor() {
        this.validationEngine = new ValidationEngine();
    }

    validatePrescription(prescription: Prescription): { isValid: boolean, messages: string[] } {
        return this.validationEngine.validate(prescription);
    }
}