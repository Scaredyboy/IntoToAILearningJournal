export interface Employee {
    employeeNumber: number;
    lastName: string;
    firstName: string;
    extension: string;
    email: string;
    officeCode: string;
    reportsTo?: number | null;
    jobTitle: string;
}
