import {Property} from "@tsed/schema";

export class AgentCreation {
    @Property()
    id: number;

    @Property()
    name: string;

    @Property()
    email: string;

    @Property()
    phone: string;

    @Property()
    internal_notes: string;

    @Property()
    is_active: boolean;

    @Property()
    created_at: Date;

    @Property()
    updated_at: Date;
}
