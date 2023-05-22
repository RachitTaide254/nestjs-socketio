import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt} from "passport-jwt";
import {  Strategy } from "passport-local";
import { AuthService} from "../auth.service";
import { Admin } from "src/admin/admin.model";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({ usernameField: 'email' })
    }

    async validate(email:string,password:string):Promise<any>{
        const user = await this.authService.validate_user(email,password);
        //console.log(user,'sds')
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }

}