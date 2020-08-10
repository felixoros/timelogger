export class DateHelper {
    private static months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    public static beautifyDate(date: string): string {
        const d = new Date(date);
        return d.getDate() + "/" + DateHelper.months[d.getMonth()] + "/" + d.getFullYear() + " " + this.getDoubleZeroReprezentation(d.getHours()) + ":" + this.getDoubleZeroReprezentation(d.getMinutes()) + ":" + this.getDoubleZeroReprezentation(d.getSeconds());
    }

    private static getDoubleZeroReprezentation(n: number): string {
        if (n >= 0 && n <= 9)
            return '0' + n.toString();
        return n.toString();
    }

    public static computeTimeDifferenceFromNow(date: string) {
        const utcNow = new Date(new Date().toUTCString());
        const d = new Date(date);

        const diffMs = utcNow.getTime() - d.getTime();
        return Math.round(diffMs / 60000);
    }
}