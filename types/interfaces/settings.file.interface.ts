import { ParsedEntry } from './parser.strategy.interface.ts'

export default interface ISettingsFileSubjectContext {
  read(): Record<string, any>

  write(newData: Record<string, any>): void
}
