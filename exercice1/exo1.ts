class Package {
    weight: number;
    distance: number;

    constructor(weight: number, distance: number) {
        this.weight = weight;
        this.distance = distance;
    }
}

class DeliveryService {
    readonly calculator: DeliveryPriceCalculator;
    readonly printer: InvoicePrinter;

    constructor(discountStrategy: CustomerDiscount) {
        this.calculator = new DeliveryPriceCalculator(discountStrategy);
        this.printer = new InvoicePrinter();
    }

    processDelivery(packages: Package[], urgent: boolean): void {
        const price = this.calculator.calculateDeliveryPrice(packages, urgent);
        this.printer.printInvoice(price);
    }
}

class DeliveryPriceCalculator {
    readonly discountStrategy: CustomerDiscount;

    constructor(discountStrategy: CustomerDiscount) {
        this.discountStrategy = discountStrategy;
    }

    calculateDeliveryPrice(packages: Package[], urgent: boolean): number {
        PackageValidator.validate(packages); 

        let total = 0;
        for (const pkg of packages) {
            total += BasePriceCalculator.calculate(pkg, urgent);
        }

        total = this.discountStrategy.applyDiscount(total); 
        total = PackagesNumberDiscount.apply(total, packages.length);

        return total;
    }
}

class BasePriceCalculator {
    static calculate(pkg: Package, urgent: boolean): number {
        let basePrice = pkg.distance * 0.1;

        if (pkg.weight > 10) {
            basePrice += 5;
        } else if (pkg.weight > 5) {
            basePrice += 3;
        }

        if (urgent) {
            basePrice *= 1.5;
        }

        return basePrice;
    }
}

class PackageValidator {
    static validate(packages: Package[]): void {
        for (const pkg of packages) {
            if (pkg.weight < 0) {
                throw new Error("Invalid weight!");
            }
        }
    }
}

class PackagesNumberDiscount {
    static apply(total: number, packageCount: number): number {
        return packageCount > 3 ? total * 0.95 : total;
    }
}


interface CustomerDiscount {
    applyDiscount(price: number): number;
}

class VIPDiscount implements CustomerDiscount {
    applyDiscount(price: number): number {
        return price * 0.8;
    }
}

class BusinessDiscount implements CustomerDiscount {
    applyDiscount(price: number): number {
        return price * 0.9;
    }
}

class InvoicePrinter {
    printInvoice(price: number): void {
        console.log(`Total: ${price}`);

        if (price > 100) {
            console.log("Apply special discount next time!");
        }
    }
}