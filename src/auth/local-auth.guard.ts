import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";



@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){////FOR JWT AUTH
    async canActivate(context: ExecutionContext){
        //console.log(context,'111ahdosahoa')
        const result =(await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        //console.log(result,request,'ahdosahoa')
        //console.log(result,'ahdosahoa')
        await super.logIn(request)
        return result;
    }
}

export class AuthenticatedGuard implements CanActivate{
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
}