import { ParsedEntry } from './parser.strategy.interface.js'

export default interface ISettingsFileSubjectContext {
  read(): Record<string, any>

  write(newData: Record<string, any>): void
}
