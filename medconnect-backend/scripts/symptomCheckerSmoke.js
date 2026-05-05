const assert = require('assert')
const { checkSymptoms } = require('../controllers/symptomController')

const callChecker = async (body) => {
  const req = { body }
  const result = { statusCode: 200, payload: null }

  const res = {
    status(code) {
      result.statusCode = code
      return this
    },
    json(payload) {
      result.payload = payload
      return payload
    },
  }

  await checkSymptoms(req, res)
  return result
}

const run = async () => {
  const empty = await callChecker({ symptoms: '' })
  assert.strictEqual(empty.statusCode, 400, 'Empty symptoms should return 400')

  const short = await callChecker({ symptoms: 'pain' })
  assert.strictEqual(short.statusCode, 400, 'Low-quality symptoms should return 400')

  const typoInput = await callChecker({ symptoms: 'feaver and vomitting for 2 days' })
  assert.strictEqual(typoInput.statusCode, 200, 'Valid symptom sentence should return 200')
  assert.ok(typoInput.payload.symptoms.includes('fever'), 'Typo should normalize feaver -> fever')
  assert.ok(Array.isArray(typoInput.payload.healthTips), 'Response must include healthTips array')
  assert.ok(typoInput.payload.recommendedSpecialist, 'Response must include recommendedSpecialist')

  const urinary = await callChecker({ symptoms: 'burning urination and frequent urination' })
  assert.strictEqual(urinary.statusCode, 200, 'Urinary symptoms should return 200')
  assert.ok(urinary.payload.recommendedSpecialist, 'Should return a specialist for urinary symptoms')

  console.log('Symptom checker smoke test passed.')
}

run().catch((error) => {
  console.error('Symptom checker smoke test failed.')
  console.error(error)
  process.exit(1)
})
