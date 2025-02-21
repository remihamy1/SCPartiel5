import { Patient } from './models/Patient';
import { Medication } from './models/Medication';
import { Prescription } from './models/Prescription';
import { MedicationNameEnum } from './enums/MedicationNameEnum';
import { GeneticMarkerEnum } from './enums/GeneticMarkerEnum';
import { PrescriptionValidator } from './services/PrescriptionValidator';

const patient = new Patient("John Doe", 2500, false, [GeneticMarkerEnum.BRCA1], new Date(2019, 5, 1));
const medications = [
    new Medication(MedicationNameEnum.X),
    new Medication(MedicationNameEnum.Y),
    new Medication(MedicationNameEnum.IRM)
];
const prescription = new Prescription(patient, medications, new Date());

const validator = new PrescriptionValidator();
const result = validator.validatePrescription(prescription);

if (result.isValid) {
    console.log("Prescription is valid.");
} else {
    console.log("Prescription is invalid:");
    result.messages.forEach(msg => console.log(`- ${msg}`));
}
