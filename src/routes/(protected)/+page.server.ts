import { getProfilCurrentWeekShifts, getProfilCurrentMonthShiftsMetric } from "$lib/api/profil"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const { parent } = event;
    const { user } = await parent();
    
    try {
        const [currentWeekShifts, currentMonthShiftsMetric] = await Promise.all([
            getProfilCurrentWeekShifts(event),
            getProfilCurrentMonthShiftsMetric(event)
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
