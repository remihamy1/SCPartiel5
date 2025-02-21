import { GeneticMarkerEnum } from "../enums/GeneticMarkerEnum";

export class Patient {
    constructor(
        public name: string,
        public whiteBloodCellCount: number,
        public isRelapsed: boolean,
        public geneticMarkers: GeneticMarkerEnum[],
        public lastConsultationDate: Date
    ) {}
}