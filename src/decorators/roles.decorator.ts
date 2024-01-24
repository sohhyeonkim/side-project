import { Role } from '../common/role.type';
import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ROLES = 'requiredRoles';
export const Roles = (roles: Role[]) => SetMetadata(REQUIRED_ROLES, roles);