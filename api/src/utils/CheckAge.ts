export function checkAge(date: any): boolean{
    const today: Date = new Date()
    try {
        const birth_date: Date = typeof date === "string" ? new Date(date) : date;

        let diference = today.getFullYear() - birth_date.getFullYear()

        const current_month = today.getMonth();
        const current_day = today.getDate();
        const birth_month = birth_date.getMonth();
        const birth_day = birth_date.getDate();

        if (current_month < birth_month || (current_month === birth_month && current_day < birth_day)) {
            diference--;
        }

        if (diference <= 9) {
            return true
        }
        return false
    }
    catch {
        return false
    }
}