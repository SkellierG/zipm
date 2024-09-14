export default interface ISettingsFileSubjectContext {
  read(): object

  write(newData: object): void
}
