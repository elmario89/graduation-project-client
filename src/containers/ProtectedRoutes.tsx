import React, {FC, PropsWithChildren} from "react";
import {UserRole} from "../enums/user-role";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../providers/AuthProvider";

type ProtectedRoutesProps = {
    roles: UserRole[];
};

const ProtectedRoutes: FC<PropsWithChildren<ProtectedRoutesProps>> = ({ roles }) => {
    const { user } = useAuth();

    if (!user || !roles.some((r) => r === user.role)) return <Navigate to="/403" />;

    return <Outlet />;
}

export default ProtectedRoutes;