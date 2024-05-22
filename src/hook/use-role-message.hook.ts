import {UserRole} from "../enums/user-role";

const useRoleMessageHook = (role: UserRole | undefined): string => {
    switch (role) {
        case UserRole.Student: {
            return 'Студент';
        }
        case UserRole.Admin: {
            return 'Админ';
        }
        case UserRole.Teacher: {
            return 'Учитель';
        }
        default: {
            return 'Неопределено...';
        }
    }
}

export default useRoleMessageHook;