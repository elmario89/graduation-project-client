import React, {FC, PropsWithChildren} from "react";
import {UserRole} from "../enums/user-role";
import {StorageService} from "../services/storage.service";
import {Navigate, Outlet} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {User} from "../types/user";

type ProtectedRoutesProps = {
    roles: UserRole[];
};

const ProtectedRoutes: FC<PropsWithChildren<ProtectedRoutesProps>> = ({ roles }) => {
    const storageService = new StorageService();
    const token = storageService.getItem<{ token: string; user: User }>('userInfo').token;

    const { role } = jwtDecode<User>(token);

    if (!token || !roles.some((r) => r === role)) return <Navigate to="/403" />;

    return <Outlet />;
}

export default ProtectedRoutes;