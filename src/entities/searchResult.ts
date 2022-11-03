import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("search_result")
export class searchResult extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    query: string;

    @Column({type: "text"})
    result: string;

    @CreateDateColumn()
    created: number;
}