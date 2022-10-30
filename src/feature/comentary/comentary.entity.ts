import { Column,Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn  } from "typeorm";
import { Post } from "..";
import { User } from "..";
import { IsNotEmpty } from 'class-validator';

@Entity({name : 'comments',schema : 'blog'})
class Comentary {
    @PrimaryGeneratedColumn()
    id : number

    @Column({type: 'text'})
    description : string

    @CreateDateColumn({type : 'date'})
    created : Date

    @ManyToOne(()=> User)
    @JoinColumn({referencedColumnName : 'id'})
    @IsNotEmpty()
    user : User

    @ManyToOne(()=>Post)
    @JoinColumn({referencedColumnName : 'id'})
    @IsNotEmpty()
    post : Post

}

export { Comentary };