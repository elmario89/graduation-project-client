import {UserRole} from "../enums/user-role";

const useRoleMessageHook = (role: UserRole | undefined): string => {
    switch (role) {
        case UserRole.Student: {
            return 'Student';
        }
        case UserRole.Admin: {
            return 'Admin';
        }
        case UserRole.Teacher: {
            return 'Teacher';
        }
        default: {
            return 'Unknown...';
        }
    }
}

export default useRoleMessageHook;