//You may need to change the port number
const BASE_URL = "http://localhost:5678/webhook";

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

export async function getAllEmployees(): Promise<Employee[]> {
    const res = await fetch(`${BASE_URL}/employees`);
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
}

export async function createEmployee(data: Employee): Promise<Employee> {
    const res = await fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create employee");
    return res.json();
}

export async function updateEmployee(employeeNumber: number, data: Employee): Promise<Employee> {
    const res = await fetch(`${BASE_URL}/${employeeNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update employee");
    return res.json();
}

export async function deleteEmployee(employeeNumber: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${employeeNumber}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete employee");
}
