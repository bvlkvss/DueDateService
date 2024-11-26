export class DueDateService{
    private static WORKDAY_START_HOUR = 9; 
    private static WORKDAY_END_HOUR = 17; 
    private static SATURDAY = 6;
    private static SUNDAY = 0;

    public calculateDueDate(submitDate: Date, turnaroundTime: number): Date | undefined{
        if (!this.isWithinWorkingHours(submitDate))
        {
            console.log(`ERROR: submitDate ${submitDate.toString()} must be within working hours. (9AM-5PM Monday to Friday)`)
            return undefined;
        }

        if (turnaroundTime < 0 || !Number.isInteger(turnaroundTime))
        {
            console.log(`ERROR: turnaroundTime ${turnaroundTime.toString()} must be a valid number of hours (Integer and >= 0)`)
            return undefined;
        }

        let remainingHours = turnaroundTime;
        let currentDate = new Date(submitDate);

        while (remainingHours > 0) {
            const currentHour = currentDate.getHours();
            const availableHoursToday = Math.min(
                DueDateService.WORKDAY_END_HOUR - currentHour,
                remainingHours
            );

            remainingHours -= availableHoursToday;
            currentDate.setHours(currentHour + availableHoursToday);

            if (remainingHours > 0) {
                this.advanceToNextWorkingDayStart(currentDate);
            }
        }

        return currentDate;
    }
    
    private advanceToNextWorkingDayStart(date: Date): void {
        do {
            date.setDate(date.getDate() + 1);
            date.setHours(DueDateService.WORKDAY_START_HOUR, date.getMinutes(), date.getSeconds(), 0);
        } while (this.isWeekend(date));
    }

    private isWithinWorkingHours(date: Date): boolean {
        const currentHour = date.getHours();
        return (
            !this.isWeekend(date) &&
            currentHour >= DueDateService.WORKDAY_START_HOUR &&
            currentHour < DueDateService.WORKDAY_END_HOUR
        );
    }

    private isWeekend(date: Date): boolean {
        const day = date.getDay();
        return day === DueDateService.SATURDAY || day === DueDateService.SUNDAY; 
    }
}