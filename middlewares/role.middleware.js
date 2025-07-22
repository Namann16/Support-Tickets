import { ApiError } from "../utils/ApiError.js";

const rolesAuthorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: Access denied");
    }
    next();
  };
};

export default rolesAuthorize;
