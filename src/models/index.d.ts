import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Task {
  readonly id: string;
  readonly title: string;
  readonly createdBy: string;
  readonly date: string;
  readonly status: boolean;
  constructor(init: ModelInit<Task>);
  static copyOf(source: Task, mutator: (draft: MutableModel<Task>) => MutableModel<Task> | void): Task;
}