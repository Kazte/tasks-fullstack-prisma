export default interface Task {
  id: number;
  title: string;
  body: string;
  important: boolean;
  create_at: Date;
  update_at: Date;
}
