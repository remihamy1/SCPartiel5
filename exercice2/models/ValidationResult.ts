export class ValidationResult {
    constructor(
        public isValid: boolean,
        public messages: string[]
    ) {}
}
