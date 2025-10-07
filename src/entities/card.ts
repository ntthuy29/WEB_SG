import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'uuid', nullable: true })
    list_id?: string;

    @Column({ type: 'int', nullable: true })
    position?: number;

    @Column({ type: 'timestamp', nullable: true })
    due_date?: Date;

    @Column({ type: 'boolean', default: false })
    is_deleted?: boolean;

    @Column({ type: 'boolean', default: true })
    is_active?: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
}