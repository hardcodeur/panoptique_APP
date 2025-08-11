import { getUserCurrentWeekShifts, getUserCurrentMonthShiftsMetric } from "$lib/api/user"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const { parent } = event;
    const { user } = await parent();
    
    if (!user?.id) {
        return {
            user,
            currentWeekShifts: { shifts: [] },
            currentMonthShiftsMetric: { totalHours: 0, totalShifts: 0, activitiesCount: [] }
        };
    }

    const userId = user.id;

    try {
        const [currentWeekShifts, currentMonthShiftsMetric] = await Promise.all([
            getUserCurrentWeekShifts(userId, event),
            getUserCurrentMonthShiftsMetric(userId, event)
        ]);
    
        return {
            user,
            currentWeekShifts,
            currentMonthShiftsMetric
        };
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return {
            user,
            currentWeekShifts: { shifts: [] },
            currentMonthShiftsMetric: { totalHours: 0, totalShifts: 0, activitiesCount: [] }
        };
    }
}
