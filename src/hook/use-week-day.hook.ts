import {Day} from "../types/day";

const useRoleMessageHook = (role: Day | undefined): string => {
    switch (role) {
        case Day.Monday: {
            return 'Понедельник';
        }
        case Day.Tuesday: {
            return 'Вторник';
        }
        case Day.Wednesday: {
            return 'Среда';
        }
        case Day.Thursday: {
            return 'Четверг';
        }
        case Day.Friday: {
            return 'Пятница';
        }
        case Day.Saturday: {
            return 'Суббота';
        }
        case Day.Sunday: {
            return 'Воскресенье';
        }
        default: {
            return 'Неопределено...';
        }
    }
}

export default useRoleMessageHook;