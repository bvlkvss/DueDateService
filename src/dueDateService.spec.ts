import { DueDateService } from './dueDateService';

describe('DueDateService', () => {
    const dueDateService = new DueDateService();

    it('should return undefined for a submit date outside working hours', () => {
        const invalidDate = new Date('2024-11-25T08:00:00'); // Before 9 AM
        const result = dueDateService.calculateDueDate(invalidDate, 8);
        expect(result).toBeUndefined();
    });

    it('should return undefined for a submit date on the weekend', () => {
        const weekendDate = new Date('2024-11-24T10:00:00'); // Sunday 
        const result = dueDateService.calculateDueDate(weekendDate, 8);
        expect(result).toBeUndefined();
    });

    it('should return undefined for a negative turnaround number of hours', () => {
        const weekendDate = new Date('2024-11-25T10:00:00'); // Monday 
        const result = dueDateService.calculateDueDate(weekendDate, -3);
        expect(result).toBeUndefined();
    });

    it('should return undefined for a non integer turnaround number of hours', () => {
        const weekendDate = new Date('2024-11-25T10:00:00'); // Monday 
        const result = dueDateService.calculateDueDate(weekendDate, 22.5);
        expect(result).toBeUndefined();
    });

    it('should calculate due date for a turnaround time within the same day', () => {
        const submitDate = new Date('2024-11-25T10:00:00'); // Monday
        const turnaroundTime = 5; 
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(new Date('2024-11-25T15:00:00'));
    });

    it('should calculate due date for a turnaround time within the same week', () => {
        const submitDate = new Date('2024-11-25T14:00:00'); // Monday
        const turnaroundTime = 10; 
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(new Date('2024-11-26T16:00:00')); // Tuesday
    });

    it('should calculate due date for a turnaround time that spans over the weekend', () => {
        const submitDate = new Date('2024-11-22T14:00:00'); // Friday
        const turnaroundTime = 8; 
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(new Date('2024-11-25T14:00:00')); // Monday
    });

    it('should return the same date for a turnaround time of 0', () => {
        const submitDate = new Date('2024-11-25T10:00:00'); // Monday
        const turnaroundTime = 0;
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(submitDate);
    });

    it('should return the same date the week after for a turnaround time of one week', () => {
        const submitDate = new Date('2024-11-25T10:00:00'); // Monday
        const turnaroundTime = 40;
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(new Date('2024-12-02T10:00:00')); // Next monday
    });

    it('should calculate due time when submit time is not on the hour and spans over the weekend', () => {
        const submitDate = new Date('2024-11-22T10:27:27'); // Friday
        const turnaroundTime = 8;
        const result = dueDateService.calculateDueDate(submitDate, turnaroundTime);
        expect(result).toEqual(new Date('2024-11-25T10:27:27')); // Monday
    });
});