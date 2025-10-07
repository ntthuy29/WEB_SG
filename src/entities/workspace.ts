import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Workspace {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    name?: string;

    @Column({ type: 'uuid', nullable: true })
    user_id?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'boolean', default: false })
    is_deleted?: boolean;

    @Column({ type: 'boolean', default: true })
    is_active?: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
}
