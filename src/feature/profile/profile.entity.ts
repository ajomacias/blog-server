import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';

@Entity({ name : 'profiles', schema : 'blog' })
class Profile{
    @PrimaryGeneratedColumn()
    id : number
    @Column({ width : 150, nullable : true})
    description : string;
    @Column({type : 'text', nullable : true})
    img : string
    @OneToOne(()=> User)
    @JoinColumn({referencedColumnName : 'id'})
    user : User

}

export { Profile };