import {Day} from "../types/day";

const useRoleMessageHook = (role: Day | undefined): string => {
    switch (role) {
        case Day.Monday: {
            return 'Monday';
        }
        case Day.Tuesday: {
            return 'Tuesday';
        }
        case Day.Wednesday: {
            return 'Wednesday';
        }
        case Day.Thursday: {
            return 'Thursday';
        }
        case Day.Friday: {
            return 'Friday';
        }
        case Day.Saturday: {
            return 'Saturday';
        }
        case Day.Sunday: {
            return 'Sunday';
        }
        default: {
            return 'Unknown...';
        }
    }
}

export default useRoleMessageHook;