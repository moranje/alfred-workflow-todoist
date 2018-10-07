import { exec } from 'shelljs'

process.chdir('dist/workflow')

describe('Integration: Workflow', () => {
  it("'create' should return a parsed json response", () => {
    let query = 'Get milk @15min @at_home #Stuff p1, tomorrow'

    let output = exec(`node alfred-workflow-todoist.js create "${query}"`, { silent: true }).stdout
    expect(output).toMatch(
      /{\\\"content\\\":\\\"Get milk\\\",\\\"priority\\\":4,\\\"due_string\\\":\\\"tomorrow\\\"}/
    )
  })

  it("'settings' should return a parsed json response", () => {
    let query = 'token 0123456789abcde0123456789abcde01234'

    let output = exec(`node alfred-workflow-todoist.js settings "${query}"`, { silent: true })
      .stdout
    expect(output).toMatch(
      /{\\\"key\\\":\\\"token\\\",\\\"value\\\":\\\"0123456789abcde0123456789abcde01234\\\"}/
    )
  })
})
