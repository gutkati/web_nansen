export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
}

export function normalizeDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function groupDatesByMonth(dates: string[]) {
    if (!dates || dates.length === 0) return [];
    const monthMap = new Map<string, Date[]>();

    dates.forEach(dateStr => {
        const date = new Date(dateStr);
        const monthName = date.toLocaleString('default', {month: 'long', year: 'numeric'}); // например: "июль 2025"

        if (!monthMap.has(monthName)) {
            monthMap.set(monthName, []);
        }

        monthMap.get(monthName)!.push(date);
    });

    const result: { name: string; date: Date[] }[] = [];

    monthMap.forEach((dates, name) => {
        name = name[0].toUpperCase() + name.slice(1)
        result.push({name, date: dates});
    });

    // сортировка по убыванию дат (чтобы последний месяц был первым)
    return result.sort((a, b) => b.date[0].getTime() - a.date[0].getTime());
}