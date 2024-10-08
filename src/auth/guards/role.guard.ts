import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ){}

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some(role => userRole.includes(role));
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if(!roles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    return this.matchRoles(roles, user.role);
  }
}
