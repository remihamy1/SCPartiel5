import { Prescription } from '../models/Prescription';
import { MedicationNameEnum } from '../enums/MedicationNameEnum';
import { WeekdayEnum } from '../enums/WeekdayEnum';
import { GeneticMarkerEnum } from '../enums/GeneticMarkerEnum';
import { ValidationResult } from "../models/ValidationResult";

export class ValidationEngine {
    validate(prescription: Prescription): ValidationResult {
        const results = new ValidationResult(true, []);
        
        results.messages.push(...this.validateRule801(prescription));
        results.messages.push(...this.validateRule327(prescription));
        results.messages.push(...this.validateRule666(prescription));

        results.isValid = results.messages.length === 0;

        return results;
    }

    private validateRule801(prescription: Prescription): string[] {
        const messages: string[] = [];
        const { patient, medications } = prescription;
        
        const hasMedicationX = medications.some(med => med.name === MedicationNameEnum.X);
        
        if (hasMedicationX) {
            const condition1 = patient.whiteBloodCellCount > 2000;
            const condition2 = medications.some(med => med.name === MedicationNameEnum.Gamma) && patient.whiteBloodCellCount > 1500;
            const condition3 = patient.isRelapsed && patient.lastConsultationDate.getFullYear() === 2019;

            if (!(condition1 || condition2 || condition3)) {
                messages.push("Rule 801: Patient does not meet the criteria for medication X.");
            }
        }
        return messages;
    }

    private validateRule327(prescription: Prescription): string[] {
        const messages: string[] = [];
        const { patient, medications } = prescription;

        const hasMedicationY = medications.some(med => med.name === MedicationNameEnum.Y);
        const hasMedicationZ = medications.some(med => med.name === MedicationNameEnum.Z);
        const hasBRCA1 = patient.geneticMarkers.includes(GeneticMarkerEnum.BRCA1);
        const isWednesday = prescription.date.getDay() === WeekdayEnum.Wednesday;
        const isUnderIRM = medications.some(med => med.name === MedicationNameEnum.IRM);

        if (hasMedicationY && hasMedicationZ && !(hasBRCA1 || (isWednesday && isUnderIRM))) {
            messages.push("Rule 327: Medications Y and Z cannot be combined without the BRCA1 marker or special conditions.");
        }
        return messages;
    }

    private validateRule666(prescription: Prescription): string[] {
        const messages: string[] = [];
        const stockAvailable = 10;
        const medicationWReserved = 3;
        const isWeekend = prescription.date.getDay() === WeekdayEnum.Sunday || prescription.date.getDay() === WeekdayEnum.Saturday;
        const safetyMargin = isWeekend ? 0.2 : 0;

        const totalNeeded = medicationWReserved + Math.ceil(3 * (1 + safetyMargin));
        
        if (stockAvailable < totalNeeded) {
            messages.push("Rule 666: Insufficient stock for medication W, including emergency reserve.");
        }

        return messages;
    }
}