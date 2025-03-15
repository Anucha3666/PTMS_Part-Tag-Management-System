import { SetMetadata } from '@nestjs/common';
import { TRole } from 'src/types';

export const Roles = (...roles: TRole[]) => SetMetadata('roles', roles);
