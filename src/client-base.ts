import { VividFeed } from './vivid';

export default abstract class ClientBase {
  public abstract scrap(): Promise<VividFeed[]>;
}
