import { ParsedEntry } from './parser.strategy.interface.js'

export default interface ISettingsFileSubjectContext {
  read(): object

  write(newData: ParsedEntry): void
}
