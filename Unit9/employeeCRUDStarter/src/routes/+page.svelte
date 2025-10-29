<script lang="ts">
    import {onMount} from "svelte";
    import {
        getAllEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        type Employee,
    } from "$lib/api";

    let employees: Employee[] = [];
    let newEmployee: Employee = {
        employeeNumber: 0,
        firstName: "",
        lastName: "",
        email: "",
        extension: "",
        officeCode: "",
        reportsTo: undefined,
        jobTitle: "",
    };
    let editing: Employee | null = null;

    async function loadEmployees() {
        try {
            employees = await getAllEmployees();
        } catch (err) {
            console.error("Failed to load employees:", err);
        }
    }

    async function addEmployee() {
        try {
            await createEmployee(newEmployee);
            newEmployee = {
                employeeNumber: 0,
                firstName: "",
                lastName: "",
                email: "",
                extension: "",
                officeCode: "",
                reportsTo: undefined,
                jobTitle: "",
            };
            await loadEmployees();
        } catch (err) {
            console.error("Create failed:", err);
        }
    }

    async function saveEdit(employeeNumber: number) {
        if (!editing) return;
        try {
            await updateEmployee(employeeNumber, editing);
            editing = null;
            await loadEmployees();
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    async function removeEmployee(employeeNumber: number) {
        try {
            await deleteEmployee(employeeNumber);
            await loadEmployees();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    onMount(loadEmployees);
</script>

<div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-600">
        Employee Directory
    </h1>

    <!-- CREATE FORM -->
    <form
            on:submit|preventDefault={addEmployee}
            class="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 justify-center"
    >
        <input
                class="border p-2 rounded w-40"
                placeholder="First Name"
                bind:value={newEmployee.firstName}
                required
        />
        <input
                class="border p-2 rounded w-40"
                placeholder="Last Name"
                bind:value={newEmployee.lastName}
                required
        />
        <input
                class="border p-2 rounded w-56"
                placeholder="Email"
                bind:value={newEmployee.email}
                required
        />
        <input
                class="border p-2 rounded w-28"
                placeholder="Ext"
                bind:value={newEmployee.extension}
        />
        <input
                class="border p-2 rounded w-28"
                placeholder="Office Code"
                bind:value={newEmployee.officeCode}
        />
        <input
                class="border p-2 rounded w-28"
                placeholder="Reports To (ID)"
                type="number"
                bind:value={newEmployee.reportsTo}
        />
        <input
                class="border p-2 rounded w-40"
                placeholder="Job Title"
                bind:value={newEmployee.jobTitle}
        />
        <button
                type="submit"
                class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
            ➕ Add Employee
        </button>
    </form>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full text-left text-sm">
            <thead class="bg-indigo-600 text-white">
            <tr>
                <th class="px-4 py-2">#</th>
                <th class="px-4 py-2">First Name</th>
                <th class="px-4 py-2">Last Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Ext</th>
                <th class="px-4 py-2">Office</th>
                <th class="px-4 py-2">Reports To</th>
                <th class="px-4 py-2">Job Title</th>
                <th class="px-4 py-2 text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each employees as emp (emp.employeeNumber)}
                <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-2">{emp.employeeNumber}</td>

                    <!-- First Name -->
                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.firstName}/>
                        {:else}
                            {emp.firstName}
                        {/if}
                    </td>

                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.lastName}/>
                        {:else}
                            {emp.lastName}
                        {/if}
                    </td>

                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.email}/>
                        {:else}
                            {emp.email}
                        {/if}
                    </td>

                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.extension}/>
                        {:else}
                            {emp.extension}
                        {/if}
                    </td>

                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.officeCode}/>
                        {:else}
                            {emp.officeCode}
                        {/if}
                    </td>
                    <td class="px-4 py-2 text-center">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input
                                    type="number"
                                    class="border p-1 rounded w-20"
                                    bind:value={editing.reportsTo}
                            />
                        {:else}
                            {emp.reportsTo}
                        {/if}
                    </td>
                    <td class="px-4 py-2">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <input class="border p-1 rounded w-full" bind:value={editing.jobTitle}/>
                        {:else}
                            {emp.jobTitle}
                        {/if}
                    </td>
                    <td class="px-4 py-2 text-center">
                        {#if editing?.employeeNumber === emp.employeeNumber}
                            <button
                                    class="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                    on:click={() => saveEdit(emp.employeeNumber)}
                            >
                                Save
                            </button>
                            <button
                                    class="bg-gray-400 text-white px-3 py-1 rounded"
                                    on:click={() => (editing = null)}
                            >
                                Cancel
                            </button>
                        {:else}
                            <button
                                    class="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                    on:click={() => (editing = { ...emp })}
                            >
                                Edit
                            </button>
                            <button
                                    class="bg-red-500 text-white px-3 py-1 rounded"
                                    on:click={() => removeEmployee(emp.employeeNumber)}
                            >
                                Delete
                            </button>
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>
