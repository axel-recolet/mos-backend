import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  docType: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;
}