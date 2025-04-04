import { jwtDecode } from "jwt-decode"; // Ensure this import works

import { SD_Roles } from "../Utility/SD";

const withAdminAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const accessToken = localStorage.getItem("token") ?? "";

        if (accessToken) {
            const decode = jwtDecode<{ role: string }>(accessToken);

            if (decode.role !== SD_Roles.ADMIN) {
                window.location.replace("/access-denied");
                return null;
            }
        } else {
            window.location.replace("/login");
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAdminAuth;
