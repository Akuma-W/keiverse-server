import { SetMetadata } from '@nestjs/common';

// Mark endpoint as public (skip auth)
export const Public = () => SetMetadata('isPublic', true);
