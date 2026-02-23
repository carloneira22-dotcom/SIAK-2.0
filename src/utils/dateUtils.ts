export function calcularDiasRestantes(fechaIngreso: string): { transcurridos: number, restantes: number, estado: 'ok' | 'warning' | 'danger' | 'overdue' } | null {
    if (!fechaIngreso) return null;
    
    // Parse the input date (assuming YYYY-MM-DD format from input type="date")
    const parts = fechaIngreso.split('-');
    if (parts.length !== 3) return null;
    
    const start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const end = new Date(); // Current date
    
    // Reset times to midnight for accurate day counting
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    if (isNaN(start.getTime())) return null;
    
    let transcurridos = 0;
    let current = new Date(start);
    
    // Count business days (Monday to Friday)
    while (current < end) {
        const dayOfWeek = current.getDay();
        // 0 is Sunday, 6 is Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            transcurridos++;
        }
        current.setDate(current.getDate() + 1);
    }
    
    const limite = 30; // 30 business days limit
    const restantes = limite - transcurridos;
    
    let estado: 'ok' | 'warning' | 'danger' | 'overdue' = 'ok';
    if (restantes < 0) estado = 'overdue';
    else if (restantes <= 5) estado = 'danger';
    else if (restantes <= 15) estado = 'warning';
    
    return { transcurridos, restantes, estado };
}
