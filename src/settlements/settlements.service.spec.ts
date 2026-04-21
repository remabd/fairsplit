import {
    SettlementsService,
    type BalanceSummary,
} from './settlements.service';

describe('SettlementsService', () => {
    let service: SettlementsService;

    beforeEach(() => {
        // We only test the pure simplifyDebts algorithm here — no DB needed
        service = new SettlementsService(
            null as any,
            null as any,
            null as any,
            null as any,
        );
    });

    describe('simplifyDebts', () => {
        it('should return empty when everyone is balanced', () => {
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 0 },
                { userId: 'b', userName: 'Bob', balance: 0 },
            ];
            expect(service.simplifyDebts(balances)).toEqual([]);
        });

        it('should handle simple two-person debt', () => {
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 50 },
                { userId: 'b', userName: 'Bob', balance: -50 },
            ];
            const debts = service.simplifyDebts(balances);
            expect(debts).toHaveLength(1);
            expect(debts[0]).toEqual({
                from: 'b',
                fromName: 'Bob',
                to: 'a',
                toName: 'Alice',
                amount: 50,
            });
        });

        it('should simplify three-person circular debt', () => {
            // A is owed 100, B owes 60, C owes 40
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 100 },
                { userId: 'b', userName: 'Bob', balance: -60 },
                { userId: 'c', userName: 'Charlie', balance: -40 },
            ];
            const debts = service.simplifyDebts(balances);
            expect(debts).toHaveLength(2);

            const totalTransferred = debts.reduce(
                (sum, d) => sum + d.amount,
                0,
            );
            expect(totalTransferred).toBe(100);
        });

        it('should minimize transfers in complex scenario', () => {
            // A paid 120, B paid 60, C paid 0, D paid 0. Split equally (45 each)
            // A balance: 120 - 45 = 75
            // B balance: 60 - 45 = 15
            // C balance: 0 - 45 = -45
            // D balance: 0 - 45 = -45
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 75 },
                { userId: 'b', userName: 'Bob', balance: 15 },
                { userId: 'c', userName: 'Charlie', balance: -45 },
                { userId: 'd', userName: 'Diana', balance: -45 },
            ];
            const debts = service.simplifyDebts(balances);

            // Should have at most 3 transfers (n-1 where n=4)
            expect(debts.length).toBeLessThanOrEqual(3);

            // Total flowing to creditors should match total owed
            const totalToA = debts
                .filter((d) => d.to === 'a')
                .reduce((s, d) => s + d.amount, 0);
            const totalToB = debts
                .filter((d) => d.to === 'b')
                .reduce((s, d) => s + d.amount, 0);
            expect(totalToA).toBe(75);
            expect(totalToB).toBe(15);
        });

        it('should handle near-zero balances (floating point)', () => {
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 0.001 },
                { userId: 'b', userName: 'Bob', balance: -0.001 },
            ];
            expect(service.simplifyDebts(balances)).toEqual([]);
        });

        it('should handle single person with no debt', () => {
            const balances: BalanceSummary[] = [
                { userId: 'a', userName: 'Alice', balance: 0 },
            ];
            expect(service.simplifyDebts(balances)).toEqual([]);
        });
    });
});
