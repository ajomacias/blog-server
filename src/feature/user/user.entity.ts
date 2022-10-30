import {
  OneToOne,
  JoinColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

import { hashText, isEquals } from "../../utils";

import { Profile } from "../profile";

@Entity({ schema: "blog", name : 'users' })
class User { 
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: "varchar", length: "50", unique : true })
  name: string;
  
  @Column({ type: "text" })
  password: string;
  
  @OneToOne(()=> Profile)
  @JoinColumn({referencedColumnName : 'id'})
  profile : Profile

  @CreateDateColumn()
  created: string;

  hashPassword(password : string){
    this.password = hashText(password);
  }
  comparePassword(noHash : string){
    return isEquals(noHash, this.password);
  }

}

export { User };