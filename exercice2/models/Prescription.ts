import { Medication } from "./Medication";
import { Patient } from "./Patient";

export class Prescription {
    constructor(public patient: Patient, public medications: Medication[], public date: Date) {}
}