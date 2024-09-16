export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest' // Transforma archivos TypeScript usando ts-jest
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1' // Mapea rutas con extensión ".js"
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  testMatch: ['<rootDir>/types/tests/**/*.test.ts'], // Ejecuta solo pruebas en la carpeta "tests"
  transformIgnorePatterns: ['/node_modules/', '/typesLegacy/'] // Aquí está corregido el error tipográfico
};
