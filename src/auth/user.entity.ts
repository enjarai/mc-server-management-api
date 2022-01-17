import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    static getReturnable(user: User): any {
        const {password, ...returnableUser} = user;
        return returnableUser;
    }
}