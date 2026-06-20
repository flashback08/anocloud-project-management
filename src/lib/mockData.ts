import { User, Project, Task, Comment, ActivityLog } from '../types';

export const mockUsers: User[] = [
  {
    id: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    name: "Alex Rivera",
    email: "alex.rivera@anocloud.internal",
    role: "ADMIN",
    created_at: "2026-01-15T08:00:00Z"
  },
  {
    id: "usr_01J0V42379B3L6Y9C2PRQN89A2",
    name: "Marcus Vance",
    email: "marcus.vance@anocloud.internal",
    role: "MEMBER",
    created_at: "2026-01-20T09:15:00Z"
  },
  {
    id: "usr_01J0V42721C4M7Z0D3STQP90B3",
    name: "Elena Rostova",
    email: "elena.rostova@anocloud.internal",
    role: "MEMBER",
    created_at: "2026-02-01T10:30:00Z"
  }
];

export const mockProjects: Project[] = [
  {
    id: "prj_01J0V43D95E5N8A1E4UVWR01C4",
    name: "Enterprise Multi-Tenant Infrastructure Spark",
    description: "Migration of relational clusters to low-latency driver adapters running on modern decoupled virtualization topologies.",
    start_date: "2026-06-01T00:00:00Z",
    end_date: "2026-09-30T23:59:59Z",
    status: "IN_PROGRESS",
    created_by: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    created_at: "2026-05-25T14:22:00Z"
  },
  {
    id: "prj_01J0V43H12F6P9B2F5VWXS02D5",
    name: "Prisma 7 Query Engine Benchmark Matrix",
    description: "Performance auditing and regression profiling for advanced structural query mutations across high-concurrency pools.",
    start_date: "2026-04-10T00:00:00Z",
    end_date: "2026-06-15T18:00:00Z",
    status: "COMPLETED",
    created_by: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    created_at: "2026-04-01T09:00:00Z"
  },
  {
    id: "prj_01J0V43M45G7Q0C3G6WXYT03E6",
    name: "Decentralized Key/Value Cache Layer",
    description: "Architectural prototyping for a Redis-less local edge state hydration broker optimized for transient memory nodes.",
    start_date: null,
    end_date: null,
    status: "ON_HOLD",
    created_by: "usr_01J0V42379B3L6Y9C2PRQN89A2",
    created_at: "2026-06-10T11:45:00Z"
  }
];

export const mockTasks: Task[] = [
  {
    id: "tsk_01J0V44A12H8R1D4H7XYZU04F7",
    project_id: "prj_01J0V43D95E5N8A1E4UVWR01C4",
    title: "Configure Prisma 7 Driver Adapter Setup",
    description: "Implement @prisma/adapter-pg over pg transaction pools to bypass conventional compute limits inside serverless handler routes.",
    assigned_to: "usr_01J0V42379B3L6Y9C2PRQN89A2",
    priority: "HIGH",
    status: "IN_PROGRESS",
    due_date: "2026-06-30T17:00:00Z",
    created_at: "2026-06-02T08:30:00Z"
  },
  {
    id: "tsk_01J0V44D34J9S2E5J8YZAV05G8",
    project_id: "prj_01J0V43D95E5N8A1E4UVWR01C4",
    title: "Draft JSON Schema Validation Guardrails",
    description: "Build robust backend structural validation frameworks checking inbound payload parameters before committing database execution contexts.",
    assigned_to: "usr_01J0V42721C4M7Z0D3STQP90B3",
    priority: "MEDIUM",
    status: "TO_DO",
    due_date: "2026-07-15T12:00:00Z",
    created_at: "2026-06-03T11:00:00Z"
  },
  {
    id: "tsk_01J0V44G56K0T3F6K9ZABW06H9",
    project_id: "prj_01J0V43D95E5N8A1E4UVWR01C4",
    title: "Establish Glassmorphic UI Design Foundation",
    description: "Build reusable, accessible primitive design layouts with high backdrop blur properties and semantic styling patterns using Tailwind CSS.",
    assigned_to: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    priority: "LOW",
    status: "REVIEW",
    due_date: "2026-06-25T23:59:59Z",
    created_at: "2026-06-05T16:40:00Z"
  },
  {
    id: "tsk_01J0V44J78L1U4G7M0ABCX07JA",
    project_id: "prj_01J0V43H12F6P9B2F5VWXS02D5",
    title: "Isolate Query Mutation Latency Spikes",
    description: "Trace performance regressions in heavy relational many-to-many lookup joins. Apply specific indexes across targeted foreign-key tracking IDs.",
    assigned_to: "usr_01J0V42721C4M7Z0D3STQP90B3",
    priority: "HIGH",
    status: "DONE",
    due_date: "2026-06-12T16:00:00Z",
    created_at: "2026-04-12T09:00:00Z"
  },
  {
    id: "tsk_01J0V44M90M2V5H8N1ABCD08KB",
    project_id: "prj_01J0V43H12F6P9B2F5VWXS02D5",
    title: "Synchronize Dev Dependencies across Matrix",
    description: "Align version targets across typescript, eslint, and build configuration trees to guarantee compile parity in CI pipelines.",
    assigned_to: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    priority: "LOW",
    status: "DONE",
    due_date: "2026-04-15T18:00:00Z",
    created_at: "2026-04-10T10:15:00Z"
  },
  {
    id: "tsk_01J0V44P12N3W6J9P2ABCX09LC",
    project_id: "prj_01J0V43M45G7Q0C3G6WXYT03E6",
    title: "Model Topology for Cluster Memory Rings",
    description: "Draft mathematical mock simulations detailing target consistent hashing ring structures to distribute memory loads evenly.",
    assigned_to: null,
    priority: "HIGH",
    status: "TO_DO",
    due_date: null,
    created_at: "2026-06-11T13:00:00Z"
  }
];

export const mockComments: Comment[] = [
  {
    id: "cmt_01J0V45A12P4X7K0Q3ABCD10MD",
    task_id: "tsk_01J0V44A12H8R1D4H7XYZU04F7",
    user_id: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    comment: "The driver adapter setup resolved the immediate compute limit bottleneck. Monitor transaction concurrency levels closely over staging pools.",
    created_at: "2026-06-18T14:30:00Z"
  },
  {
    id: "cmt_01J0V45D34Q5Y8L1R4ABCD11NE",
    task_id: "tsk_01J0V44A12H8R1D4H7XYZU04F7",
    user_id: "usr_01J0V42379B3L6Y9C2PRQN89A2",
    comment: "Understood. Successfully linked pg node client pools directly into the Prisma initialization module.",
    created_at: "2026-06-19T09:12:00Z"
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log_01J0V46A12R6Z9M2S5ABCD12PF",
    user_id: "usr_01J0V41Z38A2K5X8B1NQPM78Z1",
    action: "PROJECT_CREATED",
    entity_type: "PROJECT",
    entity_id: "prj_01J0V43D95E5N8A1E4UVWR01C4",
    created_at: "2026-05-25T14:22:00Z"
  },
  {
    id: "log_01J0V46D34S7A0N3T6ABCD13QG",
    user_id: "usr_01J0V42379B3L6Y9C2PRQN89A2",
    action: "TASK_STATUS_UPDATED",
    entity_type: "TASK",
    entity_id: "tsk_01J0V44A12H8R1D4H7XYZU04F7",
    created_at: "2026-06-19T09:12:00Z"
  }
];