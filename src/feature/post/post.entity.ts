import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User, Comentary } from '..';


@Entity({name : 'posts', schema : 'blog'})
class Post{
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({ width : 60})
    name : string

    @Column({type : 'text', unique : true})
    description : string

    @CreateDateColumn({
        type : 'date'
    })
    created : Date
    
    @ManyToOne(()=> User, (user)=> user.profile)
    @JoinColumn({referencedColumnName : 'id'})
    user : User

    @OneToMany(()=> Comentary,(comment)=> comment.post)
    comentaries : Comentary[]
}

export { Post };